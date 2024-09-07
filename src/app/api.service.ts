import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';



export interface CustomerData {

  type:number,
  name: string,
  brandName: string,
  nationalId: string,
  economicNumber: string,
  passportNumber: string,
  status: 0,
  email: string,
  moblie: string,
  postalCode: string,
  address: string,
  inqueryStatus:0,
  BranchCode:number,
  BranchName:string,
  isMainBranch:false
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
 

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  // addCustomer(data: any): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });

  //   const url = 'http://172.18.70.15:20946/api/v1/taxpayer/AddCustomer?userid=4Ow5Fn'

  //   return this.http.post<any>(url, data, { headers }).pipe(
  //     catchError(error => {
  //       this.showNotification('خطایی در ارسال داده رخ داد', 'error');
  //       return of(null); 
  //     })
  //   );
  // }



  getIdFromService(): Observable<number> {
    const url = 'http://172.18.70.15:20946/api/v1/metadata/economicactivisttype?userid=4Ow5Fn';
    return this.http.get<any>(url).pipe(
      switchMap(res => {
        const id = res?.data?.id;  
        if (id) {
          return of(id);
        } else {
          this.showNotification('خطا در دریافت id', 'error');
          return of(0);
        }
      }),
      catchError(error => {
        this.showNotification('خطا در دریافت id', 'error');
        return of(0);
      })
    );
  }

  addCustomerWithId(customerData: any): Observable<any> {
    return this.getIdFromService().pipe(
      switchMap(id => {
        if (id !== null) {

          const updatedCustomerData = { ...customerData, type: id };

          const headers = new HttpHeaders({
            'Content-Type': 'application/json'
          });

          const url = 'http://172.18.70.15:20946/api/v1/taxpayer/AddCustomer?userid=4Ow5Fn';

          return this.http.post<any>(url, updatedCustomerData, { headers }).pipe(
            catchError(error => {
              this.showNotification('خطایی در ارسال داده رخ داد', 'error');
              return of(null);
            })
          );
        } else {
          this.showNotification('id نامعتبر است', 'error');
          return of(null);
        }
      })
    );
  }


  public showNotification(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 3000, 
    });
  }
}
