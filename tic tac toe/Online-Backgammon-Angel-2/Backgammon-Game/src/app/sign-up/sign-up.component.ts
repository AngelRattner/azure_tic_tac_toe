import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(private http: HttpClient,
    private router: Router) { }

  ngOnInit(): void {
  }

  signUp(name :string, pass :string) {
    if(name =="")return alert("you must enter a user name!");
    else if(name.length<2)return alert("your name must have at list 2 Character")
    else if(pass.length<3)return alert("your passowrd must have at list 3 Character")
    this.http.post<any>("http://localhost:1000/signUp", { name, pass }).subscribe(res => {
      //wirte if user created or already exist 
      console.log(res)
      if (res.statusCode === 200) {
        alert("user added");
        this.router.navigate(['/menu'])
      }
    }, er => {
      console.log(er);
      alert(er.error.error);
    });
  }
}

