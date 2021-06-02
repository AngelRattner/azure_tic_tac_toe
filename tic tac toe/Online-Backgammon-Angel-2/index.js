const express = require('express');
const app = express();
const cors = require('cors')
const socket = require("socket.io")
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const { create } = require('domain');
var cookie = require('cookie');

const database = path.join(__dirname, "UserDB.json");

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json({ limit: "50mb" }))

let userName = ""; 
let RoomNumber = 0;
var position = {
  x: 200,
  y: 200
};
const connecteUsers =[]

const listOfUsers = []; //name  
const listofUsersNames = []; //id by name


const listOfRooms =[] //i=0 room 1 the index are users and vlue is roomnumber
const listOfRoomNameS=[]//i =room1 =>user1/2

const server = app.listen(1000, () => {
  console.log('server is working')
})
app.post('/login', (rec, res, next) => {
  const stream = fs.readFileSync(database);
  var jsonTmp = JSON.parse(stream)
  const findUser = jsonTmp.User.find(user => user.name == rec.body.name)
  console.log(findUser);
  //if user dosnt exsit send error
  if (findUser == null) {
    console.log("no user found")
    const error = new Error('username not exist')
    error.httpStatusCode = 400
    return next(error)
  }
  if(findUser.pass !=rec.body.pass){
    console.log("password is worng")
    const error = new Error('password inncorect')
    error.httpStatusCode = 400
    return next(error)
  }
  if(connecteUsers.find(user=>user.name==findUser.name))
  {
    console.log("user already connected")
    const error = new Error('user already connected')
    error.httpStatusCode = 400
    return next(error)
  }
  connecteUsers.push(findUser)
  console.log("logged in");
  userName = rec.body.name;

  // res.statusCode === 200;-
  res.status(200).send({
    statusCode: 200,
    status: 'success'
  })
  res.status(500).send(err)
}, (error, req, res, next) => {
  res.status(400).send({
    error: error.message
  })
})

app.post('/signUp', function (rec, res, next) {
  const stream = fs.readFileSync(database);
  var jsonTmp = JSON.parse(stream);
  var useTmp = { "name": rec.body.name, "pass": rec.body.pass }
  const userExist = jsonTmp.User.find(user => user.name == rec.body.name)
  if (userExist != null) {
    //send to user that user taken not working--------------------
    console.log("user already exist pick another name");
    const error = new Error('user already exist pick another name')
    error.httpStatusCode = 400
    return next(error)
  }
  jsonTmp.User.push(useTmp)
  fs.writeFile(database, JSON.stringify(jsonTmp), function () {
    console.log("user saved to json");
    // res.statusCode === 200;
    res.status(200).send({
      statusCode: 200,
      status: 'success'
    })
  })
  // res.send("user already exist pick another name"); 
}, (error, req, res, next) => {
  res.status(400).send({
    error: error.message
  })
})


const io = socket(server, {
  cors: {
    origin: '*',
  }
})
//when user connect
io.on('connection', async (socket) => {
  console.log('a user connected');
  console.log(socket.id);
  //save id
  const userId = socket.id;
  //open prive room for new user
  socket.join(userId);
  // listOfUsers.push(userId)
  // and then later
  io.to(userId).emit('hi', 'this is privet');
  //send the list of the users
  io.emit('newUser', listOfUsers)



  //when user disconnect
  socket.on('disconnect', () => {
    console.log(socket.id + 'user disconnected');
    const userId = socket.id;
    console.log(listOfUsers);
    console.log(connecteUsers);
    for (var i = 0; i < listOfUsers.length; i++) {
      for (var j = 0; j < connecteUsers.length; j++) {
      if(listOfUsers[i]==connecteUsers[j].name){connecteUsers.splice(j,1); break}
    }
  }
    for (var i = 0; i < listOfUsers.length; i++) {
      if (listofUsersNames[listOfUsers[i]] == socket.id) {
        listOfUsers.splice(i, 1);
        listofUsersNames.splice(listOfUsers[i],1);
        break;
      }
    }
    io.emit("login",listOfUsers)
  });

  //game invit
  socket.on('emitInvite', (data) => {
    //put sender in room 
    listOfRooms[data.sender]=`room-${RoomNumber}`
    listOfRooms[data.reciver]=`room-${RoomNumber}`
    listOfRoomNameS[`room-${RoomNumber}`]=data
    RoomNumber=RoomNumber+1
    socket.join(listOfRooms[data.sender])
    //find reciver and invite them to the room
    var socketid = listofUsersNames[data.reciver];
    io.to(socketid).emit("gameInvite", data);
    //socket.join("room");
    //io.to(id).emit('gameInvite', socket.id);
  })

  socket.on('InviteAccapted', (data) => {
    socket.join(listOfRooms[data.sender])
    console.log(data);
    //find sender to tell them join game
    var socketid = listofUsersNames[data.sender];
    io.to(socketid).emit("joinGame", data);
     })
  

  socket.on("user_conncted",(data)=>{
    listofUsersNames[data]=socket.id;
    listOfUsers.push(data)
    io.emit("login",listOfUsers)
   // io.emit('newUser', listOfUsers)
  })
  //grop msg in game
  socket.on('send_message_ingame',(data)=>{
    //find room to send msg to
    console.log( listOfRooms[data.sender]);
    var socketRoom = listOfRooms[data.sender]
    console.log(listOfRooms[data.sender]);
    console.log(data.mrssage);
    io.to(socketRoom).emit("new_message_ingame", data);
  })


  socket.on('gameJoin',()=>{socket.emit('position',position);})
  socket.on('move',data=>{
    //get room
    var room = listOfRooms[data.sender]
    io.to(room).emit("turn",data)
  })
  socket.on('newGame',(data)=>{
    var room = listOfRooms[data.sender]
    io.to(room).emit("replay",data)
  })  
  socket.on('gamestart',data=>{
    console.log(data);
    var room = listOfRooms[data]
    console.log(room);
    listOfRoomNameS[room]={
      sender : listOfRoomNameS[room].sender,
      reciver : listOfRoomNameS[room].reciver,
      senderSighn :'O',
      reciverSighn : 'X',
      turn: 'X'
    }
    io.to(room).emit('start',listOfRoomNameS[room])
  })
  socket.on('emitCancel', data=>{
    var socketid = listofUsersNames[data.reciver];
    listOfRooms[data.sender] =null//remove the players from the room
    listOfRooms[data.reciver] =null //remove the players from the room
    console.log(socketid);
    io.to(socketid).emit('Cancel',data.sender)
  })
  socket.on('emitDecline',data=>{
    var socketid = listofUsersNames[data.sender];
    listOfRooms[data.sender] =null//remove the players from the room
    listOfRooms[data.reciver] =null //remove the players from the room
    console.log(socketid);
    io.to(socketid).emit('Decline')
  })
  socket.on('emitquitGame',(data)=>{
    console.log(socket.rooms);
    var room = listOfRooms[data]
    listOfRooms[data] =null //remove the pointrer of player - room
    socket.leave(room) 
    console.log(socket.rooms);
    reciverName = listOfRoomNameS[room].reciver
    if(data ==reciverName){//make sure that the secend player recive the msg that the first player left
      reciverName = listOfRoomNameS[room].sender
      io.to(room).emit('playerLeft',data)
    }
    else{
    io.to(room).emit('playerLeft',data)
    }
  })
  socket.on('backToLobby',()=>{io.emit("login",listOfUsers)})
});



