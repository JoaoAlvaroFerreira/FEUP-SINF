import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { environment } from 'src/app/environment';
import { tap, retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class ApiService {

  constructor(private http: HttpClient) { }

  get(ep) {
    return this.http.get<Object>(`${environment.url}/${ep}`,
    {
    headers: new HttpHeaders({
      Authorization: localStorage.getItem('primaveraToken')
    })
  });
}
  
  getTokenFromJasmin(){
    return this.http.post(
      `${environment.tokenUrl}`,
      `client_id=${environment.client_id}&
      client_secret=${environment.client_secret}&
      scope=${environment.scope}&
      grant_type=${environment.grant_type}`,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
      }
    ).pipe(retry(2),tap(
      (response: any) => localStorage.setItem('primaveraToken', `Bearer ${response.access_token}`)
    ));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };


}


/*
Copyright Google LLC. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/