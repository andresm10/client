import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MailComponent } from './components/mail/mail.component'

const routes: Routes = [
  {
    path: '',
    component: MailComponent
  },
  {
    path:'email',
    component: MailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
