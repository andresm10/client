import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Mail} from './../interfaces/Mails'
import {EmailResponse} from './../interfaces/EmailResponse'
import {Observable} from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class MailService {

  //BASE_URL: string = "https://chiper-backend.herokuapp.com";
  BASE_URL: string = "http://localhost:3000";

  constructor(private readonly http: HttpClient) {}

  sendWithMailgun(mail: Mail): Observable<EmailResponse>{
    return this.http.post<EmailResponse>(`${this.BASE_URL}/mail/mailgun`, mail);
  }

  sendWithAwsSes(mail: Mail): Observable<EmailResponse>{
    return this.http.post<EmailResponse>(`${this.BASE_URL}/mail/aws`, mail);
  }
}
