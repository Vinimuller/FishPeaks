import { Component } from '@angular/core';
import { HttpServiceService } from './http-service.service'

interface myData {
  fishTemperature:   number,
  airTemperature:    number,
  airHumidity:       number,
  lastReceived:   "Date"
}


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

  fishData = {
    fishTemperature: 20,
    airTemperature:  0,
    airHumidity:     0,
    lastReceived:    "Date"
  }

  constructor( private service: HttpServiceService) { 

  };

  ngOnInit(){
    this.service.getData().subscribe(data => {
      console.log("/fishData: " + data);
      this.fishData = data;
      console.log(this.fishData.lastReceived);
    });

  }

}
