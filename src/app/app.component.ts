import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
 
import {
  MqttMessage,
  MqttModule,
  MqttService
} from 'angular2-mqtt';

@NgModule({
  imports: [
    MqttModule.forRoot({
      provide: MqttService,
      useFactory: mqttServiceFactory
    })
  ]
})

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  public myOtherMessage$: Observable<MqttMessage>;
 
  constructor(private _mqttService: MqttService) { 
    this._mqttService.observe('my/topic').subscribe((message: MqttMessage) => {
      this.myMessage = message.payload.toString();
  });
    this.myOtherMessage$ = this._mqttService.observe('my/other/topic');
	}
}
