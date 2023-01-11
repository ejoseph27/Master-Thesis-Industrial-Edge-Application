import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeapiComponent } from './homeapi/homeapi.component';
import { LoginWidgetComponent } from './login-widget/login-widget.component';

const routes: Routes = [
{path : '', component:LoginWidgetComponent},
{path : 'home', component:HomeapiComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
