import { VehicleGroup } from './vehicles.interface';

export interface AdminUser {
    pkUserId: string;              // Guid
    fkCompanyId: number;
    username: string;
    userNameLower: string;
    password: string;
    fullname: string;
    userType: number;              // byte
    isLock: boolean;
    lastPasswordChanged?: Date;
    changePasswordAfterDays?: number; // short
    createdByUser: string;         // Guid
    createdDate?: Date;
    updatedByUser?: string;        // Guid
    updatedDate?: Date;
    lastLoginDate?: Date;
    lockLevel?: number;
    isDeleted?: boolean;
    phoneNumber?: string;
    createdIp?: string;
    updatedIp?: string;
    email?: string;
    allowedAccessIp?: string;
    useSecurityCodeSms: boolean;
    usernameBap?: string;
    loginType?: string;
    superiorSaleId?: string;       // Guid
    extendChangePasswordDays: number;
    isActived: boolean;
    activedDate?: Date;
    requiredChangePasswordDays: number;
    isWeakPassword?: boolean;
    keepWeakPasswordDate?: Date;
    fkCompany: VehicleGroup;
}

export interface AdminUserVehicleGroup {
    fkUserId: string;              // Guid
    fkVehicleGroupId: number;
    parentVehicleGroupId?: number;
    createdByUser?: string;        // Guid
    createdDate?: Date;
    updateByUser?: string;
    updatedDate?: Date;
    updatedByUser?: string;        // Guid
    isDeleted?: boolean;
}




