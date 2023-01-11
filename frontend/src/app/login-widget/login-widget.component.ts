
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../service/authentication/authentication.service';
import { Router } from '@angular/router'
import { BackendService } from '../service/shared/backend.service';
@Component({
  selector: 'app-login-widget',
  templateUrl: './login-widget.component.html',
  styleUrls: ['./login-widget.component.css']
})

export class LoginWidgetComponent implements OnInit {

  constructor(public authenticationService: AuthenticationService, private router: Router, private backendService : BackendService) { }
  ngOnInit(): void { }

  loginEvent(loginData: NgForm) {
    
   this.backendService.loginFunc(loginData.value).subscribe((response:any) => {
      console.log(response);
     
      // this.authenticationService.setPassword(loginData.value.password);
      // this.authenticationService.setUsername(loginData.value.username);
      if ('access_token' in response) {
        this.authenticationService.setUserCredentials(loginData.value);
        console.log("USERCREDENTIAL", this.authenticationService.getUserCredentials());
        this.authenticationService.setToken(response['access_token']);
        this.router.navigateByUrl('/home');
      }
                             
    });
    
  }
}



