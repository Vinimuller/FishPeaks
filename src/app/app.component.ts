import { Component, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent {
  url   = 'http://192.168.0.36:5000';
  temperature: number = 28;

/*
  public fishConfig = {
  setPointTemperature:      0,
  upperDeadBandTemperature: 0,
  lowerDeadBandTemperature: 0,
  temperature_a_coeficient: 0,
  temperature_b_coeficient: 0,
  autoTemperatureControl:   false,
  relayStatus:              false,
  leds:                     false,
  sendDataInterval:         60   
  };
*/

  public tico: any;

  constructor(public ref: ChangeDetectorRef, 
    private http: HttpClient) { };


  successGet(Response)
  {
      console.log(Response);
      
      this.tico = Response;

      this.temperature = this.tico.fishTemperature;

      this.ref.markForCheck();
      //this.temperature = this.tico.fishTemperature;
      
      console.log("tico " + this.tico.fishTemperature);
      console.log("temp " + this.temperature);
  }

  getFishData() 
  {    
    this.http.get(this.url + "/fishData").subscribe(this.successGet,function(error){
      console.log(error);
    });
  }

  getFishConfig() 
  {
    console.log("temp " + this.temperature);    
    this.temperature = 10;
  }
}
