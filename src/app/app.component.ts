
import { AfterContentInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { WebserviceService } from './services/webservice.service';
import { MessageService } from './services/message.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnChanges, AfterContentInit {

  //@ViewChild('myDiv',{  static:false }) myDiv: ElementRef;
  newMessage: string = '';
  messageList: any;

  currentUser: any;
  selectedUser: any
  roomId: any;
  messageArray: any;
  storageArray: any;
  phone: any;
  count: number=0;
  msgId: any;
  constructor(private webService: WebserviceService,   
    private messageService:MessageService,private changeDetectorRef: ChangeDetectorRef) {

      window.onload=function(){
        const startbtn:any = document.getElementById("myDiv");
        startbtn.click()
      //  alert('Page Loaded')
      };
  }


  usersList: any = [
    {
      id: 1,
      name: 'test1',
      phone: '9876598765',
      image: 'assets/user/user-1.png',
      countData:[
        {
        id:'room-1',count:0},
        {
          id:'room-2',count:0
        }
      ],
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
      countData:[
        {
        id:'room-1',count:0},
        {
          id:'room-6',count:0
        }
      ],
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
      count:0,
      countData:[
        {
        id:'room-2',count:0},
        {
          id:'room-6',count:0
        }
      ],
      roomId: {
        1: 'room-2',
        2: 'room-6',

      }
    },
  ]

  ngAfterContentInit() {
    window.onload=function(){
      const startbtn:any = document.getElementById("myDiv");
      startbtn.click()
    //  alert('Page Loaded')
    };
    console.log("afterinit");
    // setTimeout(() => {
    //   const startbtn:any = document.getElementById("myDiv");
    //   // startbtn.addEventListener("click", () => {
    //   //   //Show the loader and hide the button
    //   //   console.log('clicked')
    //   // });

    //   startbtn.click()
    //   startbtn.onclick = function(){alert('hi');};
    //   },  1000);
     
  }
  ngOnInit() {
 
    //this.webService.initiateAudio()
    // setTimeout(() => {
    //   this.myDiv.click();

    //   }, 200);
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
   // this.count=0
    this.webService.selectedUserRoomId.subscribe(id => {
      
     // this.msgId=id
      console.log(id)
    if (id && this.currentUser.countData.find((item:any)=>item.id==id)) {
      debugger
      this.webService.playAudio()
       // this.count=this.count+1;
        this.getChatData()
     }
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
   // this.changeDetectorRef.detectChanges();
  // this.webService.initiateAudio()
  }
  async sendMsg() {
    let chatArray:any
    let  pData=await this.messageService.getMessages()
    this.storageArray = pData;
    const storeIndex = this.storageArray
      .findIndex((storage: any) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      chatArray={
        user: this.currentUser.name,
        message: this.newMessage,
        phone: this.phone
      }
      this.storageArray[storeIndex].from=this.currentUser.id,
      this.storageArray[storeIndex].roomId= this.roomId,
      this.storageArray[storeIndex].count=this.storageArray[storeIndex].count+1;
      this.storageArray[storeIndex].chats.push(chatArray);
      this.messageService.updateMessages(this.storageArray[storeIndex]).subscribe(data=>{
        console.log(data)
        this.getChatData();
      })
    } else {
      chatArray = {
        roomId: this.roomId,
        from:this.currentUser.id,
        count:1,
        chats: [{
          user: this.currentUser.name,
          message: this.newMessage,
          phone: this.phone
        }]
      };
      this.messageService.sendMessage(chatArray).subscribe(data=>{
        console.log(data)
        this.getChatData();
      })
      this.storageArray.push(chatArray);
    }

    this.setStorage(this.storageArray);

    this.newMessage = '';
    this.webService.sendMessage(this.roomId)
    
  
  }

  selectUser(phone: any) {
   // this.count=0;
    this.selectedUser = this.usersList.find((user: any) => user.phone === phone);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];
    this.webService.getUser(this.selectedUser);
    this.updateSelectedUserCount({roomId:this.roomId,from:this.currentUser.id,count:0})
   // this.getCount(this.roomId)
    this.getChatData()
  }
  updateSelectedUserCount(data:any){
    this.messageService.updateCount(data).subscribe(res=>{
      console.log(res)
    })
  }
  getCount(roomId:any){
    this.messageService.getCount({roomId:roomId,from:this.currentUser.id}).subscribe(res=>{
      //this.usersList = this.usersList.filter((user: any) => user.phone !== this.phone.toString());
      console.log(res)
    })
  }
  async getChatData() {
    let  pData=await this.messageService.getMessages()
    this.storageArray = pData//this.getStorage();

    const storeIndex = this.storageArray
      .findIndex((storage: any) => storage.roomId === this.roomId);
    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    
    }
    this.getUnreadCount()
    this.join(this.selectedUser);
  }

  getUnreadCount(){
    this.usersList?.forEach((user:any) => {
      user.countData?.forEach((d:any)=>{
        this.storageArray?.forEach((st:any) => {
          user.from=st.from
          if(st.from!==this.currentUser.id){
            if(st.roomId==d.id){
              if(d.id==this.roomId){
                this.updateSelectedUserCount({roomId:this.roomId,from:this.currentUser.id,count:0})
              }
              else{
                d.count=st.count
              }

          }
          }
         
        });
      })
    });
   
    console.log(this.usersList)
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
  adduser(){
    // userschema = mongoose.Schema({ id: Number,
    //   name: String,
    //   phone: String,
    //   image: String,
    //   countData:[{id:String,count:Number}]
    // });

  }

}