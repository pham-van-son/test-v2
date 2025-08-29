import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Group, IApiResponse, IPaginationResponse, Vehicles, VehicleGroup, VehicleImage } from '../interface';
import { API_CONSTANTS } from '../constants';

@Injectable({providedIn: 'root'})
export class VehicleService {
    private readonly apiUrl = environment.apiUrl;

    constructor(
        private http: HttpClient,
    ) { }

    //Nhóm xe
    listGroups(): Observable<IApiResponse<Group[]>> {
        return this.http.get<IApiResponse<Group[]>>(
            `${this.apiUrl}${API_CONSTANTS.VEHICLE.GROUP}`
        );
    }
    groupByGroupId(groupId: string): Observable<IApiResponse<Group>> {
        return this.http.get<IApiResponse<Group>>(
            `${this.apiUrl}${API_CONSTANTS.VEHICLE.GROUP_BY_GROUPID}/${groupId}`
        );
    }

    //danh sách xe
    listVehicles(groupIds: number[]): Observable<IApiResponse<Vehicles[]>> {
        let params = new HttpParams();
        groupIds.forEach((id) => {
            params = params.append('groupIds', id.toString());
        });
        return this.http.get<IApiResponse<Vehicles[]>>(
            `${this.apiUrl}${API_CONSTANTS.VEHICLE.VEHICLE_VEHICLE}`, {params}
        );
    }
    vehicleByVehicleId(vehicleId: string): Observable<IApiResponse<Vehicles>> {
        return this.http.get<IApiResponse<Vehicles>>(
            `${this.apiUrl}${API_CONSTANTS.VEHICLE.VEHICLE_VEHICLE_BY_VEHICLEID}/${vehicleId}`
        );
    }

    //danh sách quan hệ nhóm xe
    listVehicleGroups(): Observable<IApiResponse<VehicleGroup[]>> {
        return this.http.get<IApiResponse<VehicleGroup[]>>(
            `${this.apiUrl}${API_CONSTANTS.VEHICLE.VEHICLE_GROUP}`
        );
    }

    //danh sách ảnh xe
    listVehicleImages(data: VehicleImage, page: number = 1, pageSize: number = 50): Observable<IApiResponse<IPaginationResponse<any>>> {
        const requestData = {
            ...data,
            Page: page,
            PageSize: pageSize
        };
        return this.http.post<IApiResponse<IPaginationResponse<any>>>(
            `${this.apiUrl}${API_CONSTANTS.VEHICLE.VEHICLE_IMAGE}`, requestData
        );
    }
}