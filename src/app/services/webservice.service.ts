
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";


@Injectable({
  providedIn: 'root',
})
export class WebserviceService {

  public message$: BehaviorSubject<string> = new BehaviorSubject('');
  constructor() {}

  socket = io('http://localhost:3000');

  public appendElement(data:string,position:string,){
    let container:any=document.getElementById('container')
    let element=document.createElement('div');
    element.innerText=data;
    element.classList.add('message')
    element.classList.add(position);
    container.append(element)

  }
  public sendMessage(message:any) {
    this.appendElement(message,'right')
    this.socket.emit('send', message);
   // this.onRecieveMsg()
  }

  onRecieveMsg(){
    this.socket.off('recieve').on('recieve',data=>{
      console.log(data)
      this.appendElement(data.message,'left')
    })
  }
  public getNewMessage = () => {
    this.socket.on('message', (message) =>{
      this.message$.next(message);
    });
    
    return this.message$.asObservable();
  };

  getUser(name:any){
    this.socket.emit('new-user-joined', name)
    this.onUserJoined();
  }
  onUserJoined(){
    this.socket.off('user-joined').on('user-joined', name=>{
   //  console.log(name)
      this.appendElement(name,'right')
    })
  }
  onUserLeft(){
    this.socket.on('left',data=>{
      this.appendElement(`${data} left`,'left')
    })
  }
}
