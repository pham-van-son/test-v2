import { Pipe, PipeTransform } from '@angular/core';
@Pipe({name: 'vehicleLabel'})
export class VehicleLabelPipe implements PipeTransform {
  transform(v: any) {
    if (!v) return '';
    const pp = (v.privateCode || '').trim();
    const plate = (v.vehiclePlate || '').trim();
    return pp && plate && pp !== plate ? `${pp} (${plate})` : (pp || plate || '');
  }
}
