import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { API_CONSTANTS } from '../constants';
import { IApiResponse, IPaginationResponse } from '../interface';
import { BcaLicenseType, ExportConfig, HrmEmployee, UpdateDriversRequest } from '../interface/driver.interface';

/* Service xử lý các API liên quan đến quản lý lái xe */
@Injectable({ providedIn: 'root' })
export class DriverService {
    private readonly apiUrl = environment.apiUrl; /* URL gốc của API */

    constructor(
        private http: HttpClient, /* HttpClient để gọi API */
    ) { }

    /* Lấy danh sách lái xe với phân trang và bộ lọc */
    listDrivers(page: number, pageSize: number, searchTerm?: string, driverLicense?: string, licenseTypes?: number[], employeeIds?: number[]): Observable<IApiResponse<IPaginationResponse<HrmEmployee>>> {
        let params = new HttpParams();
        params = params.append('page', page.toString()); /* Trang hiện tại */
        params = params.append('pageSize', pageSize.toString()); /* Số bản ghi mỗi trang */

        /* Chỉ thêm tham số nếu có giá trị */
        if (searchTerm) {
            params = params.append('searchTerm', searchTerm); /* Từ khóa tìm kiếm theo tên */
        }
        if (driverLicense) {
            params = params.append('driverLicense', driverLicense); /* Tìm kiếm theo số GPLX */
        }
        if (licenseTypes && licenseTypes.length > 0) {
            licenseTypes.forEach(licenseType => {
                params = params.append('licenseTypes', licenseType.toString()); /* Lọc theo loại bằng lái xe */
            });
        }
        if (employeeIds && employeeIds.length > 0) {
            employeeIds.forEach(id => {
                params = params.append('employeeIds', id.toString()); /* Lọc theo danh sách ID nhân viên */
            });
        }

        return this.http.get<IApiResponse<IPaginationResponse<HrmEmployee>>>(
            `${this.apiUrl}${API_CONSTANTS.DRIVER.LIST_DRIVER}`, { params },
        );
    }

    /* Lấy danh sách tất cả loại bằng lái xe (A1, A2, B, C...) */
    listBcaLicenseType(): Observable<IApiResponse<BcaLicenseType>> {
        return this.http.get<IApiResponse<BcaLicenseType>>(
            `${this.apiUrl}${API_CONSTANTS.DRIVER.LIST_LICENSE}`,
        );
    }

    /* Cập nhật thông tin một hoặc nhiều lái xe */
    updateDrivers(data: UpdateDriversRequest): Observable<IApiResponse<number>> {
        return this.http.put<IApiResponse<number>>(
            `${this.apiUrl}${API_CONSTANTS.DRIVER.UPDATE_DRIVER}`, data,
        );
    }

    /* Xuất danh sách lái xe ra file Excel */
    exportDrivers(data: ExportConfig): Observable<Blob> {
        return this.http.post(
            `${this.apiUrl}${API_CONSTANTS.DRIVER.EXPORT_DRIVER}`, data ?? {}, {
            responseType: 'blob', /* Trả về file dưới dạng Blob để download */
        },
        );
    }

    /* Xóa một lái xe theo ID */
    deleteDriver(employeeId: number): Observable<IApiResponse<number>> {
        return this.http.delete<IApiResponse<number>>(
            `${this.apiUrl}${API_CONSTANTS.DRIVER.DELETE_DRIVER}/${employeeId}`,
        );
    }
}