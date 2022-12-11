import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AwsServiceService {

  BASE_URL: string = "http://localhost:3000";

  constructor(private readonly http:HttpClient) { }

  async awsListEntities(){
    return this.http.get<any>(`${this.BASE_URL}/aws/entities`);
  }
}
