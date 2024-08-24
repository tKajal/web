
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";


@Injectable({
  providedIn: 'root',
})
export class WebserviceService {

  audio = new Audio('../assets/media/MessageTone.mp3');
  chatsData=new BehaviorSubject(null)

  constructor() {}

  socket = io('https://web-api-nine-green.vercel.app');

  public appendElement(data:string,position:string,){
    let container:any=document.getElementById('container')
    let element=document.createElement('div');
    element.innerText=data;
    element.classList.add('message')
    element.classList.add(position);
    container.append(element)
    if(position=='left'){
      this.audio.play();
    }
  }
  public sendMessage(chatData:any) {
   // this.appendElement(message,'right')
    this.socket.emit('send', chatData);
   // this.onRecieveMsg()
  }

  onRecieveMsg(){
    this.socket.off('recieve').on('recieve',data=>{
      console.log(data)
      this.getStorage()
    //  this.getMessage()
    //  this.appendElement(data.message,'left')
    })
  }
  getUser(name:any){
    this.socket.emit('new-user-joined', name)
    this.onUserJoined();
  }
  onUserJoined(){
    this.socket.off('user-joined').on('user-joined', name=>{
   //  console.log(name)
     // this.appendElement(name,'right')
    })
  }
  onUserLeft(){
    this.socket.on('left',data=>{
    //  this.appendElement(`${data} left`,'right')
    })
  }
  getMessage(): Observable<any> {
    return new Observable<{user: string, message: string}>(observer => {
      this.socket.on('new message', (data) => {
        observer.next(data);
      });

      // return () => {
      //   this.socket.disconnect();
      // }
    });
  }

  getStorage() {
    const storage: any = localStorage.getItem('chats');

    let data=storage ? JSON.parse(storage) : [];
    this.chatsData.next(data)
    return data
  }

  setStorage(data:any) {
    localStorage.setItem('chats', JSON.stringify(data));
  }
  joinRoom(data:any): void {
    this.socket.emit('join', data);
  }

}
