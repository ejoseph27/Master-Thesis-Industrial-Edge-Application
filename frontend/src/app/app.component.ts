import { Component } from '@angular/core';
import { AuthenticationService } from './service/authentication/authentication.service';
import {NgbConfig} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Industrial Edge Application Service';
  constructor (public authenticationService:AuthenticationService, ngbConfig: NgbConfig){
    ngbConfig.animation = false;
  }
}
