const express 	= require('express');
const path 		= require('path');
const mqtt 		= require("mqtt");
const app 		= express();

var aux = 0;
var date = new Date();

var fishData = {
  "fishTemperature":      	  28
};

var fishConfig = {
  "setPointTemperature":      28,
  "upperDeadBandTemperature": 0.8,
  "lowerDeadBandTemperature": 1,
  "temperature_a_coeficient": -0.078,
  "temperature_b_coeficient": 83.1,
  "autoTemperatureControl":   true,
  "relayStatus":              false,
  "leds":                     true,
  "sendDataInterval":         60   
};

var client = mqtt.connect('mqtt:iot.eclipse.org:1883');

// Serve only the static files form the dist directory
//app.use(express.static(__dirname+'/src'));

app.set('view engine', 'pug')

app.get('/', function (req, res) {
  date = new Date();
  date.setHours(date.getHours()-3);
  var dateStr = date.toUTCString();

  res.render('index', { title: 'Fish Peaks', fishTemperature: fishData.fishTemperature, 
  	relayStatus: fishConfig.relayStatus, date: dateStr})
})

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);

var setFishConfig = function(fishConfig) {
  console.log("publishing: " + JSON.stringify(fishConfig) + "\n");

  client.publish("U7886zhUcV_fish_house/config/rx", JSON.stringify(fishConfig), { retain: true, qos: 1 });
};

var setFishData = function(fishData) {
  console.log("publishing: " + JSON.stringify(fishData) + "\n");

  client.publish("U7886zhUcV_fish_house/data", JSON.stringify(fishData), { retain: true, qos: 1 });
};

client.subscribe('U7886zhUcV_fish_house/data/fishtemp', { qos: 1 }, function(err, granted) {
  if (err)
    console.log(err);
  else
  {
    console.log("client connected : ", granted);
  }
});

client.subscribe('U7886zhUcV_fish_house/config/tx', { qos: 1 }, function(err, granted) {
  if (err)
    console.log(err);
  else
  {
    console.log("client connected : ", granted);
  }
});

/*** client on connect ***/
client.on("connect", function() {
  console.log("cleint is connected");
})

/*** client on reconnect ***/
client.on("reconnect", function() {
  console.log("cleint is reconnected");
})

/*** client on error ***/
client.on("error", function(err) {
  console.log("error from client --> ", err);
})

/*** client on close ***/
client.on("close", function() {
    console.log("client is closed");
  })
  /*** client on offline ***/
client.on("offline", function(err) {
  console.log("client is offline");
});

client.on('message', function(topic, message) { 
  //fishStatus = JSON.parse(message.toString());

  if(topic == "U7886zhUcV_fish_house/data/fishtemp")
  {
		fishData = JSON.parse(message.toString());  	
  }
  if(topic == "U7886zhUcV_fish_house/config/tx")
  {
		fishConfig = JSON.parse(message.toString());  	
  }
	console.log("Fish says: " + topic + " | " + message.toString()); // message is Buffer   
  
  if(!aux)
  {
    aux = 1;
    //setFishData(fishStatus);
    setFishConfig(fishConfig);    
  }

});