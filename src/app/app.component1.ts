
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { WebserviceService } from './services/webservice.service';
import { MessageService } from './services/message.service';
import { MessageModal } from './model/message.model';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnChanges {
  newMessage: string = '';
  messageList: string[] = [];

  constructor(
    private webService: WebserviceService,
    private messageService: MessageService
  ) {

  }
  public showScreen = false;
  public phone: any;
  public currentUser:any;
  currentUserName:string;
  public selectedUser:any;
  public roomId: string;
  public messageText: string;
  public messageArray: { user: string, message: string }[] = [];
  private storageArray:any = [];



  public userList = [
    {
      id: 1,
      name: 'Sendu',
      phone: '9876598765',
      image: 'assets/user/user-1.png',
      roomId: {
        2: 'room-1',
        3: 'room-2',
        4: 'room-3'
      }
    },
    {
      id: 2,
      name: 'Priya',
      phone: '9876543210',
      image: 'assets/user/user-2.png',
      roomId: {
        1: 'room-1',
        3: 'room-4',
        4: 'room-5'
      }
    },
    {
      id: 3,
      name: 'Piplo Rani',
      phone: '9988776655',
      image: 'assets/user/user-3.png',
      roomId: {
        1: 'room-2',
        2: 'room-4',
        4: 'room-6'
      }
    },
    {
      id: 4,
      name: 'Kharbujo Rani',
      phone: '9876556789',
      image: 'assets/user/user-4.png',
      roomId: {
        1: 'room-3',
        2: 'room-5',
        3: 'room-6'
      }
    }
  ];

  ngOnInit() {
   this.getMessages();
//  this.sendMessage(msg)
    if(!sessionStorage.getItem('currentUser')){
      this.phone = prompt('enter phone');
    }
    else{
      this.phone =sessionStorage.getItem('currentUser')
    }
    this.webService.getUser(this.phone);
    this.webService.onRecieveMsg();
    this.webService.onUserLeft();
    this.login()
  }
  login(): void {
    this.currentUser = this.userList.find(user => user.phone === this.phone.toString());
    this.currentUserName= this.currentUser.name
    this.userList = this.userList.filter((user) => user.phone !== this.phone.toString());
    sessionStorage.setItem('currentUser',this.phone)
    if (this.currentUser) {
      this.showScreen = true;
    }
  }

  getMessages() {
    // this.messageService.getMessages().subscribe(res => {
    //   console.log(res)
    // })
    debugger
    this.webService.chatsData.subscribe((data:any)=>{
      console.log(data)
      // this.storageArray = this.webService.getStorage();
    
      //        const storeIndex = this.storageArray
      //         .findIndex((storage:any) => storage.roomId === this.roomId);
      if(data && data.length>0){
        this.messageArray = data[0].chats;
      }
         
    })
    // this.webService.getMessage()
    // .subscribe((data: { user: string, room: string, message: string }) => {
    //   // this.messageArray.push(data);
    //   if (this.roomId) {
    //     setTimeout(() => {
    //       this.storageArray = this.webService.getStorage();
    //       const storeIndex = this.storageArray
    //         .findIndex((storage:any) => storage.roomId === this.roomId);
    //       this.messageArray = this.storageArray[storeIndex].chats;
    //     }, 500);
    //   }
    // });
  }
  ngOnChanges(changes: SimpleChanges): void {

  }
  sendMsg() {

    this.webService.sendMessage(this.newMessage);
    this.webService.onRecieveMsg();
  }

  sendMessage(): void {

    let chatData={
      user: this.currentUser.name,
      room: this.roomId,
      message: this.messageText
    }
    this.webService.sendMessage(chatData);

    this.storageArray = this.webService.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage:any) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText
      });
    } else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [{
          user: this.currentUser.name,
          message: this.messageText
        }]
      };

      this.storageArray.push(updateStorage);
    }

    this.webService.setStorage(this.storageArray);
    
    this.messageText = '';
  }
  selectUserHandler(phone: any): void {
    this.selectedUser = this.userList.find(user => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];
    this.getChatData()
    
  }

  getChatData(){
    this.storageArray = this.webService.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage:any) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    this.join(this.currentUser.name, this.roomId);
  }

  join(username: string, roomId: string): void {
    this.webService.joinRoom({user: username, room: roomId});
  }
}