import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError, tap, map } from 'rxjs/operators';

import { Order } from './order';
import { Links } from './links';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  baseURL = 'http://uddfdap001:8082';
  /* (POST & GET) */
  submissionsURL = 'http://uddfdap001:8082/api/form/CSD/centre-payments-ucles/submissions/';
  submittedURL = 'http://uddfdap001:8082/api/purchase-order/submitted/';
  /* Plus unique URL ID, e.g. "5cb7265ae553c80001c52924" (POST) */
  purchaseOrderURL = 'http://uddfdap001:8082/api/purchase-order/';
  /* Plus unique URL ID (POST) */
  purchaseOrderSubmittedURL = 'http://uddfdap001:8082/api/purchase-order/submitted/';
  /* POST */
  // https://mdepayments.epdq.co.uk/ncol/test/orderstandard_utf8.asp
  /* GET */
  // http://10.114.42.16:8083/api/payments/form/urn:xc:ecommerce:purchase-order:5cb7265ae553c80001c52924

  constructor(private http: HttpClient) { }

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  httpOptions2 = {
    headers: new HttpHeaders({
      // 'Content-Type': 'text/html',
      //'Content-Type': 'application/xhtml+xml',
      Referer: 'http://uddfdap001:8082/api/form/CSD/centre-payments-ucles',
      Accept: 'application/xhtml+xml'
    })
  };

  // 1. POST submit order. response: link, GET preview
  // 2. GET preview order. response: Draft & link, POST Draft
  // 3. POST create order. response: Submitted & link, GET EPDQ
  // 4. GET EPDQ payment checkout
  // 5. Navigate through Barclaycard pages and return to local success/failure page

  // HttpClient API post() method => Post order
  postSubmission(order): Observable<Links> {
    return this.http.post<Links>(this.submissionsURL, JSON.stringify(order), this.httpOptions)
      .pipe(
        tap(
          //data => console.log(JSON.stringify(data), error => console.log(error))
        ),
        catchError(this.handleError)
      );
  }

  // HttpClient API get() method => Fetch Preview Order URL
  getPreviewOrder(previewOrderURL): Observable<Order> {
    return this.http.get<Order>(previewOrderURL)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  postOrder(draftOrderURL): Observable<Links> {
    return this.http.post<Links>(draftOrderURL, JSON.stringify(draftOrderURL), this.httpOptions)
      .pipe(
        tap(
          data => console.log(JSON.stringify(data), error => console.log(error))
        ),
        catchError(this.handleError)
      );
  }

  getPayment(paymentURL): Observable<Links> { // Response is XML; can't be interpretted by epdq1.ts
    return this.http.get<Links>(paymentURL, this.httpOptions2)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  postPreviewPayment(previewPaymentURL): Observable<Links> {
    return this.http.post<Links>(previewPaymentURL, JSON.stringify(previewPaymentURL), this.httpOptions)
      .pipe(
        tap(
          data => console.log(JSON.stringify(data), error => console.log(error))
        ),
        catchError(this.handleError)
      );
  }

  // Error handling
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

}