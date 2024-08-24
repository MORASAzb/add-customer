import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = ''; 

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  addCustomer(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(this.apiUrl, data, { headers }).pipe(
      catchError(error => {
        this.showNotification('خطایی در ارسال داده رخ داد', 'error');
        return of(null); 
      })
    );
  }

  public showNotification(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000, 
    });
  }
}
