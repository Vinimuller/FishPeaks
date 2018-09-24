import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface myData {
  fishTemperature:   number,
  airTemperature:    number,
  airHumidity:       number,
  lastReceived:   	"Date"
}


@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient) { }
  
  getData(){
  	return this.http.get<myData>("http://localhost:8080"+ "/fishData");
  }
}
