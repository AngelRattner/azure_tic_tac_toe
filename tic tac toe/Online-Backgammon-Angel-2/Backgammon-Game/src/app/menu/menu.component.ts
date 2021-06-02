import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, observable } from 'rxjs';
import { map } from 'rxjs/operators'
import { RouterModule } from '@angular/router';
import { Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';
import { UsersService} from "../users.service"
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  user
  userNameCNT: number = 0;
  constructor(private http: HttpClient,
    private router: Router,
    private socket: Socket,
    private service : UsersService,
    private cookieService: CookieService) { }

  ngOnInit(): void {
  }

  login(name, pass) {
    this.user = { "name": name, "pass": pass };
    this.http.post<any>("http://localhost:1000/login", { name, pass })
      .subscribe(res => {
        //if res == stats200 send user to lobby ***with his name to socket
        console.log('loged in')
        if (res.statusCode === 200) {
         this.service.current_user = name
          this.socket.emit("user_conncted",name)
          this.router.navigate(['/lobby'])
        }
        //else tell user his name/pass worng!!
      }, er => {
        console.log(er);
        alert(er.error.error);
      });
  }
}
