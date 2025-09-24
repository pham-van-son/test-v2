//Interface bằng lái xe
export interface BcaLicenseType {
    pkLicenseTypeId: number;
    name: string;
    code: string;
    isActived: boolean;
    isDeteted: boolean;
    createdByUser: string;
    createdDate: Date;
    updatedByUser?: string;
    updatedDate?: Date;
    // UI specific properties
    checked?: boolean;
}

// Interface người lái xe
export interface HrmEmployee {
    pkEmployeeId: number;
    employeeCode: string;
    fkCompanyId: number;
    fkDepartmentId: number;
    name: string;
    displayName: string;
    birthday?: Date;
    sex?: number;
    address?: string;
    mobile?: string;
    phoneNumber1?: string;
    phoneNumber2?: string;
    employeeType: number;
    identityNumber?: string;
    driverLicense?: string;
    issueLicenseDate?: Date;
    issueLicensePlace?: string;
    expireLicenseDate?: Date;
    createdByUser: string;
    createdDate: Date;
    updatedByUser?: string;
    updatedDate?: Date;
    flags: number;
    isSent?: boolean;
    licenseType?: number;
    driverImage?: string;
    isLocked: boolean;
    isDeleted: boolean;
    fkUserId?: string;
    driverAvatar?: string;
    lockDate?: Date;
    // UI specific properties
    isEditing?: boolean;
    checked?: boolean;
}

// Interface update người lái xe
export interface UpdateDriversRequest {
    employeeIds: number[];
    updateData: HrmEmployee;
}

// Interface config xuất file excel
export interface ExportConfig {
    title: string;
    licenseCategories: string;
    mergeTitleRows: string;
    mergeCategoriesRows: string;
}
