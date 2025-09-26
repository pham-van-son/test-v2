/* Interface định nghĩa thông tin loại bằng lái xe */
export interface BcaLicenseType {
    pkLicenseTypeId: number; /* ID chính của loại bằng lái xe */
    name: string; /* Tên loại bằng lái xe (VD: A1, A2, B, C...) */
    code: string; /* Mã loại bằng lái xe (VD: A1, A2, B, C...) */
    isActived: boolean; /* Trạng thái hoạt động của loại bằng */
    isDeteted: boolean; /* Trạng thái xóa của loại bằng */
    createdByUser: string; /* ID người tạo */
    createdDate: Date; /* Ngày tạo */
    updatedByUser?: string; /* ID người cập nhật cuối */
    updatedDate?: Date; /* Ngày cập nhật cuối */
    checked?: boolean; /* Trạng thái được chọn trong UI (cho dropdown filter) */
}

/* Interface định nghĩa thông tin người lái xe */
export interface HrmEmployee {
    pkEmployeeId: number; /* ID chính của nhân viên lái xe */
    employeeCode: string; /* Mã nhân viên */
    fkCompanyId: number; /* ID công ty */
    fkDepartmentId: number; /* ID phòng ban */
    name: string; /* Tên thật của nhân viên */
    displayName: string; /* Tên hiển thị của nhân viên */
    birthday?: Date; /* Ngày sinh */
    sex?: number; /* Giới tính (1: Nam, 2: Nữ) */
    address?: string; /* Địa chỉ */
    mobile?: string; /* Số điện thoại di động */
    phoneNumber1?: string; /* Số điện thoại 1 */
    phoneNumber2?: string; /* Số điện thoại 2 */
    employeeType: number; /* Loại nhân viên */
    identityNumber?: string; /* Số CMND/CCCD */
    driverLicense?: string; /* Số giấy phép lái xe */
    issueLicenseDate?: Date; /* Ngày cấp bằng lái xe */
    issueLicensePlace?: string; /* Nơi cấp bằng lái xe */
    expireLicenseDate?: Date; /* Ngày hết hạn bằng lái xe */
    createdByUser: string; /* ID người tạo */
    createdDate: Date; /* Ngày tạo */
    updatedByUser?: string; /* ID người cập nhật cuối */
    updatedDate?: Date; /* Ngày cập nhật cuối */
    flags: number; /* Cờ đánh dấu */
    isSent?: boolean; /* Trạng thái đã gửi */
    licenseType?: number; /* Loại bằng lái xe (ID) */
    driverImage?: string; /* Đường dẫn ảnh lái xe */
    isLocked: boolean; /* Trạng thái bị khóa */
    isDeleted: boolean; /* Trạng thái bị xóa */
    fkUserId?: string; /* ID người dùng liên kết */
    driverAvatar?: string; /* Đường dẫn avatar lái xe */
    lockDate?: Date; /* Ngày khóa */
    isEditing?: boolean; /* Trạng thái đang chỉnh sửa trong UI */
    checked?: boolean; /* Trạng thái được chọn trong UI (cho dropdown filter) */
}

/* Interface định nghĩa request cập nhật thông tin lái xe */
export interface UpdateDriversRequest {
    employeeIds: number[]; /* Danh sách ID các nhân viên cần cập nhật */
    updateData: HrmEmployee; /* Dữ liệu cập nhật cho các nhân viên */
}

/* Interface định nghĩa cấu hình xuất file Excel */
export interface ExportConfig {
    title: string; /* Tiêu đề file Excel */
    licenseCategories: string; /* Danh mục loại bằng lái xe */
    mergeTitleRows: string; /* Số dòng gộp cho tiêu đề */
    mergeCategoriesRows: string; /* Số dòng gộp cho danh mục */
}
