import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Group, IApiResponse, IPaginationResponse, Vehicles, VehicleGroup, VehicleImage, ResponseSingleContentModel, AssignVehicleGroupRequest } from '../interface';
import { AdminUser } from '../interface/admin-user.interface';
import { API_CONSTANTS } from '../constants';

@Injectable({ providedIn: 'root' })
export class VehicleGroupService {
    private readonly apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) { }

    /**
     * Lấy danh sách người dùng
     * @param searchTerm Từ khóa tìm kiếm (optional)
     * @returns Observable<ResponseSingleContentModel<AdminUser[]>>
     */
    listUser(searchTerm?: string): Observable<ResponseSingleContentModel<AdminUser[]>> {
        let params = new HttpParams();
        if (searchTerm) {
            params = params.set('searchTerm', searchTerm);
        }

        return this.http.get<ResponseSingleContentModel<AdminUser[]>>(
            `${this.apiUrl}${API_CONSTANTS.VEHICLE_GROUP.LIST_ADMIN_USER}`,
            { params }
        );
    }

    /**
     * Lấy danh sách nhóm xe chưa được gán cho user
     * @param userId ID của user
     * @param searchTerm Từ khóa tìm kiếm (optional)
     * @returns Observable<ResponseSingleContentModel<Group[]>>
     */
    listAvailableVehicleGroups(userId: string, searchTerm?: string): Observable<ResponseSingleContentModel<Group[]>> {
        let params = new HttpParams();
        if (searchTerm) {
            params = params.set('searchTerm', searchTerm);
        }

        return this.http.get<ResponseSingleContentModel<Group[]>>(
            `${this.apiUrl}${API_CONSTANTS.VEHICLE_GROUP.LIST_AVAILABLE_VEHICLE_GROUP}/${userId}`,
            { params }
        );
    }

    /**
     * Lấy danh sách nhóm xe đã được gán cho user
     * @param userId ID của user
     * @param searchTerm Từ khóa tìm kiếm (optional)
     * @returns Observable<ResponseSingleContentModel<Group[]>>
     */
    listAssignedVehicleGroups(userId: string, searchTerm?: string): Observable<ResponseSingleContentModel<Group[]>> {
        let params = new HttpParams();
        if (searchTerm) {
            params = params.set('searchTerm', searchTerm);
        }

        return this.http.get<ResponseSingleContentModel<Group[]>>(
            `${this.apiUrl}${API_CONSTANTS.VEHICLE_GROUP.LIST_ASSIGN_VEHICLE_GROUP}/${userId}`,
            { params }
        );
    }

    /**
     * Gán nhóm xe cho user
     * @param request Dữ liệu gán nhóm xe
     * @returns Observable<ResponseSingleContentModel<string>>
     */
    assignVehicleGroups(request: AssignVehicleGroupRequest): Observable<ResponseSingleContentModel<string>> {
        return this.http.post<ResponseSingleContentModel<string>>(
            `${this.apiUrl}${API_CONSTANTS.VEHICLE_GROUP.ASSIGN_VEHICLE_GROUP}`,
            request
        );
    }

    /**
     * Hủy gán nhóm xe cho user
     * @param request Dữ liệu hủy gán nhóm xe
     * @returns Observable<ResponseSingleContentModel<string>>
     */
    unassignVehicleGroups(request: AssignVehicleGroupRequest): Observable<ResponseSingleContentModel<string>> {
        return this.http.post<ResponseSingleContentModel<string>>(
            `${this.apiUrl}${API_CONSTANTS.VEHICLE_GROUP.AVAILABLE_VEHICLE_GROUP}`,
            request
        );
    }
}