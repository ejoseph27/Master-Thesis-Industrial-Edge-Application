import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface Credentials {
  url: string
  username: string
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // setting GET request header

  constructor() { }

  // Get function to retreive available project list from IEM 



  //get access token () and session timeout
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  // setting the acess token to reuse
  getToken(): string {
    const data = localStorage.getItem('token');
    if (data)
      return data;
    throw new Error("Token not set");
  }

  // set and get url from the ngForm inpu

  getUrl(): string {
    return this.getUserCredentials().url
  }

  getPassword(): string {
    return this.getUserCredentials().password
  }


  // authenticate login from getToken()

  isAuthenticated(): boolean {

    try {
      return !!this.getToken();
    } catch (error) {
      return false
    }
  }

  getUsername(): string {
    return this.getUserCredentials().username
  }


  setUserCredentials(userData: Credentials) {
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  getUserCredentials() {
    const data = localStorage.getItem('userData');
    if (data)
      return JSON.parse(data);
    throw new Error("Login Credential not set");

  }

  // sessionTimeout(): number {
  //   // the session timeout value is returned as a number
  //   return (~~this.sessionTimeout)
  // }



}


























/* private readonly mockedUser = new SignInData('https://192.168.6.144:9443', 'elvis.joseph.ext@siemens.com', 'DE02july1993$');

private statusUrl = '/api/status';

 // control visibility of the navigation page
 isAuthenticated = false;
 constructor() { }
 
// implement authenticate method

authenticate(signInData: SignInData): boolean {


  if (this.checkCredentials(signInData)) {

    this.isAuthenticated = true;
    return true;
  }
  this.isAuthenticated = false;
  return false;

}

private checkCredentials(signInData: SignInData): boolean {
//should call a web service that will authenticate user and return token that will keep
 
return this.checkIemUrl(signInData.getIemUrl()) && this.checkEmail(signInData.getEmail()) && this.checkPassword(signInData.getPassword())
}


  
 private checkIemUrl(iemUrl: string): boolean {
  return iemUrl === this.mockedUser.getIemUrl();
}

private checkEmail(email: string): boolean {
  return email === this.mockedUser.getEmail();
}
private checkPassword(password: string): boolean {
  return password === this.mockedUser.getPassword();
}



} 
*/

