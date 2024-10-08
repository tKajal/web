
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { io } from "socket.io-client";


@Injectable({
  providedIn: 'root',
})
export class WebserviceService {

  audio = new Audio('../assets/media/MessageTone.mp3');
  selectedUserRoomId=new BehaviorSubject(null)

  constructor() {}

  socket = io('https://web-api-nine-green.vercel.app');

  // public appendElement(data:string,position:string,){
  //   document.addEventListener('click',function(){
  //    console.log('jy')
  //   })
  //   // let container:any=document.getElementById('default-cont')
  //   // let element=document.createElement('div');
  //   // element.innerText=data;
  //   // element.classList.add('message')
  //   // element.classList.add(position);
  //   // container.ad
  //   // if(position=='left'){
  //   //   this.audio.play();
  //   // }
  // }
  public sendMessage(selectedUserRoomId:any) {
  //  this.appendElement(message,'right')
    this.socket.emit('send', selectedUserRoomId);
   // this.onRecieveMsg()
  }

  initiateAudio(){
    let data:any=document.getElementById("default-cont");
    data.click();
    console.log(data,'is clicked')
  }
  onRecieveMsg(){
    this.socket.off('recieve').on('recieve',roomId=>{
      console.log(roomId)
     
      this.selectedUserRoomId.next(roomId.roomId)
    })
    
  }
  getUser(user:any){
    this.socket.emit('new-user-joined', user)
    this.onUserJoined();
  }
  onUserJoined(){
    this.socket.off('user-joined').on('user-joined', user=>{
     console.log(user)
     // this.appendElement(`${user.name} joined chat`,'right')
    })
  }
  onUserLeft(){
    this.socket.on('left',data=>{
      console.log(data)
     // this.appendElement(`${data.name} left`,'right')
    })
  }
  playAudio(){
    this.audio.play();
  }
}
