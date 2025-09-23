import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { API_CONSTANTS } from '../constants';

@Injectable({providedIn: 'root'})
export class DriverService {
    private readonly apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) { }

   
}