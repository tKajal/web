
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

  currentUser:any;
  selectedUser:any
  roomId: any;
  messageArray: never[];
  storageArray: any;
  constructor(private webService: WebserviceService){

  }


  usersList:any=[
    {
      id: 1,
      name: 'Anu',
      phone: '9876598765',
      image: 'assets/user/user-1.png',
      roomId: {
        2: 'room-1',
        3:'room-2'
      }
    },
    {
      id: 2,
      name: 'Navya',
      phone: '6567876543',
      image: 'assets/user/user-2.png',
      roomId: {
        1: 'room-1',
        3:'room-2'

      }
    },
    {
      id: 3,
      name: 'Kartik',
      phone: '89828930288',
      image: 'assets/user/user-2.png',
      roomId: {
        2: 'room-1',
        1:'room-2'
      }
    },
  ]
  ngOnInit(){
    let phone=prompt('enter name')
    console.log(phone)
    this.currentUser = this.usersList.find((user:any) => user.phone === phone);
   // this.roomId = this.selectedUser.roomId[this.currentUser.id];
    // this.webService.getUser(this.currentUser);
    this.webService.onRecieveMsg();
    this.webService.onUserLeft();
  }

  ngOnChanges(changes: SimpleChanges): void {
    
  }
  sendMsg(){
    // let chatData={
    //   userName:'',
    //   roomId:this.selectedUser.roomId,

    // }
    this.storageArray = this.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage:any) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.newMessage
      });
    } else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [{
          user: this.currentUser.name,
          message: this.newMessage
        }]
      };

      this.storageArray.push(updateStorage);
    }

    this.setStorage(this.storageArray);
    
    this.newMessage = '';
    this.webService.sendMessage(this.roomId);
    this.webService.selectedUserRoomId.subscribe(id=>{
      if(id){
        this.getChatData()
      }
    })
  }

  selectUser(phone:any){
    this.selectedUser = this.usersList.find((user:any) => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];
    this.webService.getUser(this.selectedUser);
   // this.getChatData()
  }
  
  getChatData(){
    this.storageArray = this.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage:any) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    this.join(this.selectedUser);
  }

  join(selectedUser:any): void {
    this.webService.onUserJoined();
  }

  getStorage() {
    const storage: any = localStorage.getItem('chatData');

    let data=storage ? JSON.parse(storage) : [];
   // this.chatsData.next(data)
    return data
  }

  setStorage(data:any) {
    localStorage.setItem('chatData', JSON.stringify(data));
  }
}