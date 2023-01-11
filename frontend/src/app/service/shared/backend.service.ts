import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { application } from 'express';
import { AuthenticationService } from '../authentication/authentication.service';
import { SignInData } from 'src/app/model/signInData';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {


  constructor(private http: HttpClient, private authenticationService: AuthenticationService) { }


  // POST function to login to IEM <return a token>

  loginFunc(data: object): Observable<any> {
    //console.log("USERCREDENTIAL", this.userDataCredential);

    return this.http.post<any>('/api/login', data);
  }


  projectList(): Observable<any> {

    const headers = new HttpHeaders({
      'Url': this.authenticationService.getUrl(), //             
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': this.authenticationService.getToken()
    });
    //console.log('acessGetvalue', typeof (this.getToken()));
    return this.http.get<any>('/api/projects', { headers: headers });

  }

   fileUpload(formData:object) {
    
    return this.http.post<any>('/api/upload', formData);
 
   }

  projectUpload(appId:string,composePath:string, flowPath:string): Observable<any> {
    const credentials=this.authenticationService.getUserCredentials();
    return this.http.post<any>('/api/deploy/cloud', { ...credentials,appId,composePath,flowPath });
  }

  flowAppUpload(appId:string,deviceId:string, url:string): Observable<any> {
    const headers = new HttpHeaders({
      'Url': this.authenticationService.getUrl(), //             
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': this.authenticationService.getToken()
    });
    const credentials=this.authenticationService.getUserCredentials();
    return this.http.post<any>('/api/ied/reterive/flow', {...credentials,appId,deviceId}, {headers:headers});
  }
  
  deviceList(): Observable<any> {

    const headers = new HttpHeaders({
      'Url': this.authenticationService.getUrl(), //             
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': this.authenticationService.getToken()
    });
    //console.log('acessGetvalue', typeof (this.getToken()));
    return this.http.get<any>('/api/devices/list', { headers: headers });

  }

  deployFlowToDevice(assets:string[],flowPath:string):Observable<any>{

    const headers = new HttpHeaders({           
      'Content-Type': 'application/json; charset=utf-8',
      'Authorization': this.authenticationService.getToken()
    });

    const url=this.authenticationService.getUrl();
    const deviceParams= {url,assets,flowPath}
    return this.http.post<any>('/api/deploy/device',deviceParams, { headers: headers });

    
  }



}





