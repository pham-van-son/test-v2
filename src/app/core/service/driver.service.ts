import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { API_CONSTANTS } from '../constants';
import { IApiResponse, IPaginationResponse } from '../interface';
import { BcaLicenseType, ExportConfig, HrmEmployee, UpdateDriversRequest } from '../interface/driver.interface';

@Injectable({providedIn: 'root'})
export class DriverService {
    private readonly apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) { }

   //Lấy danh sách lái xe
   listDrivers(page: number, pageSize: number, searchTerm?: string, driverLicense?: string): Observable<IApiResponse<IPaginationResponse<HrmEmployee>>> {
    let params = new HttpParams();
    params = params.append('page', page.toString());
    params = params.append('pageSize', pageSize.toString());
    params = params.append('searchTerm', searchTerm || '');
    params = params.append('driverLicense', driverLicense || '');

    return this.http.get<IApiResponse<IPaginationResponse<HrmEmployee>>>(
        `${this.apiUrl}${API_CONSTANTS.DRIVER.LIST_DRIVER}`, { params },
    );
   }

   //Lấy danh sách bằng lái xe
   listBcaLicenseType(): Observable<IApiResponse<BcaLicenseType>> {
    return this.http.get<IApiResponse<BcaLicenseType>>(
        `${this.apiUrl}${API_CONSTANTS.DRIVER.LIST_LICENSE}`,
    );
   }

   //Cập nhập thông tin người lái xe
   updateDrivers(data: UpdateDriversRequest): Observable<IApiResponse<number>> {
    return this.http.put<IApiResponse<number>>(
        `${this.apiUrl}${API_CONSTANTS.DRIVER.UPDATE_DRIVER}`, data,
    );
   }

   //Xuất file excel người lái xe
   exportDrivers(data: ExportConfig): Observable<Blob> {
    return this.http.post(
        `${this.apiUrl}${API_CONSTANTS.DRIVER.EXPORT_DRIVER}`, data ?? {}, {
            responseType: 'blob',
        },
    );
   }

   //Xóa người lái xe
   deleteDriver(employeeId: number): Observable<IApiResponse<number>> {
    return this.http.delete<IApiResponse<number>>(
        `${this.apiUrl}${API_CONSTANTS.DRIVER.DELETE_DRIVER}/${employeeId}`,
    );
   }
}