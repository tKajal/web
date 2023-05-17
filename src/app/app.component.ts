
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { WebserviceService } from './services/webservice.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnChanges{
  newMessage: string='';
  messageList: string[] = [];

  constructor(private webService: WebserviceService){

  }

  ngOnInit(){
    let name=prompt('enter name')
    console.log(name)
    this.webService.getUser(name);
    this.webService.onRecieveMsg();
    this.webService.onUserLeft();
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }
  sendMsg(){
    this.webService.sendMessage(this.newMessage);
    this.webService.onRecieveMsg();
  }
}