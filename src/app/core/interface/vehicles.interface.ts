export interface Group {
    fkCompanyId: number;
    pkVehicleGroupId: number;
    parentVehicleGroupId: number;
    name: string;
    createdByUser: string;
    createdDate: Date;
    updatedByUser?: string;
    updatedDate?: Date
    distanceA: number;
    distanceB: number;
    minuteA: number;
    minuteB: number;
    fkBgtprovinceId?: number;
    flag: number;
    status: boolean;
    vehicleCount: number;
    isDeleted: boolean;
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
    customerId: number;
    vehicleName: string;
    channels: string[];
    startTime: Date;
    endTime: Date;
    frequency: number;
    storageTime: number;
    sortOrder: string;
}