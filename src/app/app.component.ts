import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  private url   = 'https://fishpeaks.herokuapp.com';

  public fishConfig = {
    setPointTemperature:      28,
    upperDeadBandTemperature: 0,
    lowerDeadBandTemperature: 0,
    temperature_a_coeficient: 0,
    temperature_b_coeficient: 0,
    autoTemperatureControl:   false,
    relayStatus:              false,
    leds:                     false,
    sendDataInterval:         60   
  };

  public fishData = {
    fishTemperature:          0,
    airTemperature:           0,
    airHumidity:              0
  };


  constructor( private http: HttpClient) { };

  getFishData() 
  {    
    this.http.get(this.url + "/fishData").subscribe(function(response){
      console.log("/fishData: " + JSON.stringify(response));
      this.fishData = response;

    },function(error){
      console.log("error /fishData: " + error);
    });
  }

  getFishConfig() 
  {
    this.http.get(this.url + "/fishConfig").subscribe(function(response){
      console.log("/fishConfig: " + JSON.stringify(response));
      this.fishConfig = response;

    },function(error){
      console.log("error /fishConfig: " + error);
    });
  }
}
