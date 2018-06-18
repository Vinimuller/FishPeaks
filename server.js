//Install express server
const express 	= require('express');
const path 		= require('path');
const mqtt 		= require("mqtt");
const app 		= express();
var client 		= mqtt.connect('mqtt:iot.eclipse.org:1883');

var aux = 0;
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
var fishData = {
  "fishTemperature":          0,
  "airTemperature":           0.0,   
  "airHumidity":              0
};

// Serve only the static files form the dist directory
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + '/dist/fishpeaks'));

app.get('/', function(req,res) {
   res.sendFile('index.html', { root: __dirname + "/dist/fishpeaks/"}); 
});

app.get('/fishData', function(req,res) {
    console.log("/fishData");
    res.json(fishData); 
});

app.get('/fishConfig', function(req,res) {
    console.log("/fishConfig");
    res.json(fishConfig); 
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);


//--------------------------------------------------------------------------------->> Functions

var setFishConfig = function(fishConfig) {
  console.log("publishing: " + JSON.stringify(fishConfig) + "\n");

  client.publish("U7886zhUcV_fish_house/config/rx", JSON.stringify(fishConfig), { retain: true, qos: 1 });
};





//--------------------------------------------------------------------------------->> MQTT events

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

  console.log("Fish says: " + topic + " | " + message.toString()); // message is Buffer   
 
  if(topic == "U7886zhUcV_fish_house/data/fishtemp")
  {
    fishData = JSON.parse(message.toString());
  }
  if(topic == "U7886zhUcV_fish_house/config/tx")
  {
    fishStatus = JSON.parse(message.toString());
  }
});
