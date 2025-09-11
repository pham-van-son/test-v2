export interface Group {
  fkCompanyId: number;
  pkVehicleGroupId: number;
  parentVehicleGroupId?: number;
  name: string;
  createdByUser?: string;        // Guid
  createdDate?: Date;
  updatedByUser?: string;        // Guid
  updatedDate?: Date;
  distanceA?: number;
  distanceB?: number;
  minuteA?: number;
  minuteB?: number;
  fkBgtprovinceId?: number;
  isDeleted: boolean;
  flag: number;
  status?: boolean;
  vehicleCount: number;
}

export interface Vehicles {
  fkCompanyId: number;
  pkVehicleId: number;
  vehiclePlate: string;
  privateCode: string;
  imei: string;
  isLocked: boolean;
  xncode: number;
  isCam: boolean;
  isVideoCam: boolean;
  isDeleted: boolean;
}

export interface VehicleGroup {
  fkCompanyId: number;
  fkVehicleGroupId: number;
  fkVehicleId: number;
  isDeleted: boolean;
}
export interface VehicleImage {
  CustomerId: number; // trường XnCode của xe
  VehicleName: string; // biển số xe trường vehiclePlate
  Channels: number[]; // fake 4 kênh từ 1 tới 4 và chọn thôi có thể chọn nhiều mà
  StartTime: string; // format: "2025-04-10T00:00:00"
  EndTime: string; // format: "2025-04-10T23:00:00"
  Frequency: number; // mặc định là 5
  StorageTime: number; // mặc định là 90
  SortOrder?: string; // truyền là desc hoặc asc
  Page?: number; // trang hiện tại
  PageSize?: number; // số ảnh mỗi trang
}

export interface VehicleImageResponse {
  v: string; // Biển số xe
  c: Date; // Thời gian chụp
  u: string; // URL
  s: number; // Tốc độ
  k: number; // Kênh
  w: number; // Chiều rộng
  h: number; // Chiều cao
  i: number; // ID
  t: number; // Loại
  l: string; // Giấy phép
  n: string; // Tên tài xế
}

export interface ResponseSingleContentModel<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface AssignVehicleGroupRequest {
  userId: string; // Guid
  vehicleGroupIds: number[];
}