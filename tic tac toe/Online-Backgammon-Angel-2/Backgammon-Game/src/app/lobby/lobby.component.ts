import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Router } from "@angular/router";
import { UsersService } from '../users.service';

//global 
var reciver ="";
var sender = ""; //not work this is the last one htat log in

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {
  @ViewChild ('message')
  private message : ElementRef
  //need to add user name!!***************
  UserList : Array<string>
  data = '';
  someNumber = 0;
  join = false 
  invtSent =false
  userNamelist :string[] =[];

  constructor(private router: Router,
    private socket: Socket,
    private service: UsersService,) { }

  ngOnInit(): void {
    //work
    this.socket.on("login",(data)=>{
      this.userNamelist=data
      sender=this.service.current_user
    })
  this.socket.on('joinGame',()=>{this.router.navigate(['/game'])})
      
  //#region  just doses r the importent 
  this.socket.on('newUser',(data)=>{this.UserList=data});
  this.socket.on('Decline', ()=>{this.enableList(); alert(` your opponent decline your invite`);this.invtSent=false; })
  this.socket.on('Cancel',(data)=>{this.enableList();alert(`${data} cancel his Invite`);})
  this.socket.on('gameInvite',(data)=>{
  this.data=data;
  this.join=true;
  this.disableList();
});

}

emitDecline(data){
this.enableList();
this.socket.emit('emitDecline',data)
}
disableList() {
  for (let i = 0; i < this.userNamelist.length; i++) {
    var element = <HTMLInputElement>document.getElementById(`${i}`);
    element.disabled = true;
  }
}
enableList() {
  for (let i = 0; i < this.userNamelist.length; i++) {
    var element = <HTMLInputElement>document.getElementById(`${i}`);
    element.disabled = false;
  }

  this.join = false;
}
emitCancel(){
  this.enableList();
  this.socket.emit('emitCancel',{
    sender:sender,
    reciver:reciver
  })
  this.invtSent=false;
}

  emitInvite(name){
    reciver=name;
    if(name==sender)return alert("are you so lonely that you try to play tic tac toe by yourself?")
    this.socket.emit('emitInvite',{
      sender:sender,
      reciver:name,
      RoomNumber:0
    });
    this.disableList();
    this.invtSent=true;
  }
  emitJoinGame(data){
    this.socket.emit('InviteAccapted',data)
  }
  logOut(){window.location.reload()}
}
