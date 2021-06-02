import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';

import { GameComponent } from './game/game.component';
import { FormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { SignUpComponent } from './sign-up/sign-up.component'
const socketioConfig: SocketIoConfig = { url: 'http://localhost:1000', options: {} };

import { ReactiveFormsModule } from '@angular/forms';
import { LobbyComponent } from './lobby/lobby.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,

    SignUpComponent,
    GameComponent,
    LobbyComponent,
    GameBoardComponent

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(socketioConfig),

    ReactiveFormsModule,
    AppRoutingModule,
    DragDropModule

  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
