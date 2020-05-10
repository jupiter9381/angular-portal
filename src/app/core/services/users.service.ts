import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //private apiUrl = '/api/';
  private apiUrl = 'http://localhost:8080/api/';

  constructor(
    private http: HttpClient,
  ) { }

  getUsers()  {
    return this.http.get<any>(this.apiUrl + 'get')
      .pipe(map(res => {
          return res.data;
      }));
  }
}