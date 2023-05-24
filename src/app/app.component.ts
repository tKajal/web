
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { WebserviceService } from './services/webservice.service';
import { MessageService } from './services/message.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnChanges {
  newMessage: string = '';
  messageList: any;

  currentUser: any;
  selectedUser: any
  roomId: any;
  messageArray: any;
  storageArray: any;
  phone: any;
  constructor(private webService: WebserviceService,   
    private messageService:MessageService) {
  }


  usersList: any = [
    {
      id: 1,
      name: 'test1',
      phone: '9876598765',
      image: 'assets/user/user-1.png',
      roomId: {
        2: 'room-1',
        3: 'room-2'
      }
    },
    {
      id: 2,
      name: 'test2',
      phone: '6567876543',
      image: 'assets/user/user-2.png',
      roomId: {
        1: 'room-1',
        3: 'room-6'

      }
    },
    {
      id: 3,
      name: 'test3',
      phone: '89828930288',
      image: 'assets/user/user-2.png',
      roomId: {
        1: 'room-2',
        2: 'room-6',

      }
    },
  ]
  ngOnInit() {
    if (!sessionStorage.getItem('phone') || sessionStorage.getItem('phone')==null) {
      this.phone = prompt('enter name');
      sessionStorage.setItem('phone', this.phone)
    }
    else {
      this.phone = sessionStorage.getItem('phone')
    }

    console.log(this.phone)
    this.currentUser = this.usersList.find((user: any) => user.phone === this.phone);
    // this.roomId = this.selectedUser.roomId[this.currentUser.id];
    // this.webService.getUser(this.currentUser);
    this.usersList = this.usersList.filter((user: any) => user.phone !== this.phone.toString());
    //  this.webService.getUser(this.currentUser);
    this.webService.onRecieveMsg();
    this.webService.onUserLeft();
    this.webService.selectedUserRoomId.subscribe(id => {
      if (id) {
        this.getChatData()
      }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {

  }
  async sendMsg() {
    let chatArray:any
    let  pData=await this.messageService.getMessages()
    this.storageArray = pData//this.getStorage();
    //this.storageArray = this.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage: any) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      chatArray={
        user: this.currentUser.name,
        message: this.newMessage,
        phone: this.phone
      }
      this.storageArray[storeIndex].chats.push(chatArray);
      this.messageService.updateMessages(this.storageArray[storeIndex]).subscribe(data=>{
        console.log(data)
      })
    } else {
      chatArray = {
        roomId: this.roomId,
        chats: [{
          user: this.currentUser.name,
          message: this.newMessage,
          phone: this.phone
        }]
      };
      this.messageService.sendMessage(chatArray).subscribe(data=>{
        console.log(data)
      })
      this.storageArray.push(chatArray);
    }

    this.setStorage(this.storageArray);

    this.newMessage = '';
    this.webService.sendMessage(this.roomId)
    
    this.getChatData()
  }

  selectUser(phone: any) {
    this.selectedUser = this.usersList.find((user: any) => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];
    this.webService.getUser(this.selectedUser);
    this.getChatData()
  }

  async getChatData() {
    let  pData=await this.messageService.getMessages()
    this.storageArray = pData//this.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage: any) => storage.roomId === this.roomId);
    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    this.join(this.selectedUser);
  }

  join(selectedUser: any): void {
    this.webService.onUserJoined();
  }

   getStorage() {
   
    const storage: any = localStorage.getItem('chatData');

    let data = storage ? JSON.parse(storage) : [];
    // this.chatsData.next(data)
    return data
  }

  setStorage(data: any) {
    localStorage.setItem('chatData', JSON.stringify(data));
  }
}