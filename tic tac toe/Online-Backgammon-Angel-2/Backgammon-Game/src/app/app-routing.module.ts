import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { from } from 'rxjs';
import { GameComponent } from './game/game.component';
import { LobbyComponent } from './lobby/lobby.component';
import {MenuComponent} from './menu/menu.component'
import { SignUpComponent } from "./sign-up/sign-up.component";
import { GameBoardComponent } from './game-board/game-board.component';

const routes: Routes = [
  {path: '', redirectTo: 'menu', pathMatch:'full'},
  {path: 'menu', component: MenuComponent},
  {path: 'signUp', component: SignUpComponent},
  {path: 'game', component: GameComponent},
  {path: 'lobby', component: LobbyComponent},
  {path: 'game-board', component: GameBoardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
