import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginWidgetComponent } from './login-widget/login-widget.component';
import { HomeapiComponent } from './homeapi/homeapi.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IxModule } from '@siemens/ix-angular';
@NgModule({
  declarations: [
    AppComponent,
    LoginWidgetComponent,
    HomeapiComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    IxModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
