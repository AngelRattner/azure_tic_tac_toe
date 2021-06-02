import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { UsersService } from '../users.service';
var sender=""
var reciver=""
@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  messageArr:Array<{sender:string , mrssage:string}>=[];
  squares:any[]; 
  Xturn:boolean;
  winner:string; 
  turnNum=0;
  mySign
  myTurn=true
  gameEnd=false
  @ViewChild ('message')
  private message : ElementRef
  constructor(private socket: Socket, private router: Router,private service: UsersService) {

  }
  @ViewChild ("game")
  private gameCanvas: ElementRef;
  private context: any;
  ngOnInit(): void {
    sender=this.service.current_user
    this.socket.emit("gamestart", sender)
    this.socket.on('start',data=>{
      let turn = data.turn
      if(data.sender==sender){this.mySign=data.senderSighn}
      else{this.mySign=data.reciverSighn}
      if(turn!=this.mySign){
        this.myTurn=false;
      }
    })
    this.socket.on('replay',data=>{this.newGame()})
    this.socket.on("playerLeft",(data)=>{
      alert(`${data} has left the game,  please quit the game!`);
    })
    this.socket.on('turn', data=>{
      //make a move
      this.move(data.index);
    })
    this.socket.on("new_message_ingame",(data)=>{
      this.messageArr.push(data);
      // var d1 = document.getElementById('chat');
      // d1.insertAdjacentHTML('beforeend', `<div> ${data.sender}: ${data.mrssage}</div>`);
    })
    //test
    this.socket.emit('gameJoin')
    this.newGame()
  }
  //chat in game-------------------------------------------
  sendMessage(){
    var msg =this.message.nativeElement.value
    console.log(msg);
    this.socket.emit('send_message_ingame',{
      sender:sender,
      mrssage:msg
    });
  }
  emitNewGame(){
    this.socket.emit('newGame',{
      sender:sender
    });
  }
  newGame(){
    this.squares = Array(9).fill(null);
    this.winner=null;
    this.Xturn =true;
    this.gameEnd=false;
    this.turnNum=0;
  }
  get player(){
    return this.Xturn? 'X':'O';
  }

  move(index:number){
    if(!this.squares[index]){
      this.squares.splice(index,1,this.player);
      this.Xturn=!this.Xturn;
      this.myTurn =!this.myTurn;
      this.turnNum=this.turnNum+1;
    }
    this.winner=this.checkWinner();
  }

  checkWinner() {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c]
      ) {
        this.gameEnd=true;
        return this.squares[a]+" won!";
      }
    }
    if(this.turnNum==8){this.gameEnd=true; return "its a tie!"}
    return null;
  }

emitMove(index:number){
  if(this.gameEnd)return alert(`the game have ended please play again or return to lobby`);
  if(this.myTurn){
      this.socket.emit('move',{
        index:index,
        sender:sender
      });}
      else alert(`its not your turn`);
}

emitQuitGame(){
alert(`quiting game`);
this.socket.emit('emitquitGame',sender);
this.socket.emit('backToLobby')
this.router.navigate(['/lobby']);
}






// //test-----------------------------------------------------------------------------
//   //create the cube
// public ngAfterViewInit(){
// this.context =this.gameCanvas.nativeElement.getContext("2d");
// this.socket.on('position',position=>{
//   this.context.clearRect(
//     0,
//     0,
//     this.gameCanvas.nativeElement.width,
//     this.gameCanvas.nativeElement.height
//   )
//   this.context.fillRect(position.x,position.y,20,20);
// })
// }

// //test
// public move(direction: string){
//   this.socket.emit('move',{
//     direction:direction,
//     sender:sender
//   });
  
}

