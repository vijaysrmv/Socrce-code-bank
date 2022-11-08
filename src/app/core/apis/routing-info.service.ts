
import {map} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RNDetails } from '../models/routing-number-details.model';
import { environment } from '../../../environments/environment';
import { AppConfig } from '../../app.config';

@Injectable()
export class RoutingInfoService {

  constructor(private http: HttpClient) { }

  getRoutingDetails(routingNumber: string): Observable<RNDetails> {
    return this.http.get(AppConfig.settings.ROUTING_NUMBER_API_ENDPOINT_GATEWAY, {
      params: new HttpParams().set('rn', routingNumber)
  }).pipe(map(data => <RNDetails>{ bankName: data['customer_name'] }));
  }

}
