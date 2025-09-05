import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgChartsModule } from 'ng2-charts';
import { Chart } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { centerTextPlugin } from '../../../../shared/pipe/count-chart-donut.pipe';
import { Vehicle } from '../../../../core/interface/vehicle.interface';
import { ChartDonutComponent } from '../../../../shared/components/chart-donut/chart-donut.component';
import { ChartBarComponent } from '../../../../shared/components/chart-bar/chart-bar.component';
import { CompanyOverviewStatisticalComponent } from "./component/company-overview-statistical/company-overview-statistical.component";

Chart.register(ChartDataLabels, centerTextPlugin);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgChartsModule,
    CompanyOverviewStatisticalComponent,
    ChartDonutComponent,
    ChartBarComponent
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  @ViewChildren(ChartDonutComponent) donutCharts!: QueryList<ChartDonutComponent>;
  @ViewChildren(ChartBarComponent) barCharts!: QueryList<ChartBarComponent>;

  private i18nService = inject(TranslateService);

  private refreshIntervalId: any;
  selectedVehicles: number[] = [];
  isDropdownOpen: boolean = false;

  vehicles: Vehicle[] = [
    { id: 1, name: '43C01338_C', status: 'at-plant', hasGoods: true, location: 'Cty Sedovina ( trang thiết bị trường học )' },
    { id: 2, name: '43C01339_C', status: 'at-plant', hasGoods: false, location: 'Keyhinge Hòa Cầm' },
    { id: 3, name: '43C01340_C', status: 'at-plant', hasGoods: true, location: 'Sợi Phú Nam' },
    { id: 4, name: '43C01341_C', status: 'at-plant', hasGoods: false, location: 'Cty Sedovina ( trang thiết bị trường học )' },
    { id: 5, name: '43C01342_C', status: 'at-plant', hasGoods: true, location: 'Cty Sedovina ( trang thiết bị trường học )' },
    { id: 6, name: '43C01343_C', status: 'at-port', hasGoods: true, location: '504' },
    { id: 7, name: '43C01344_C', status: 'at-port', hasGoods: false, location: 'A Minh' },
    { id: 8, name: '43C01345_C', status: 'at-port', hasGoods: true, location: 'A. Bửu ( Đại đồng _Đại lộc )' },
    { id: 9, name: '43C01346_C', status: 'at-port', hasGoods: false, location: 'An Lợi Tinh' },
    { id: 10, name: '43C01347_C', status: 'at-port', hasGoods: true, location: 'An Phú Tài' },
    { id: 11, name: '43C01348_C', status: 'at-port', hasGoods: false, location: 'Anh Bửu ( giác trầm làm hương )' },
    { id: 12, name: '43C01349_C', status: 'at-port', hasGoods: true, location: 'Bãi Container Chân Thật' },
    { id: 13, name: '43C01350_C', status: 'at-port', hasGoods: false, location: 'Bãi Container Hoàng Bảo Anh' },
    { id: 14, name: '43C01351_C', status: 'at-port', hasGoods: true, location: 'Bãi Container Hoàng Bảo Anh ( KCN PBA1 )' },
    { id: 15, name: '43C01352_C', status: 'at-port', hasGoods: false, location: 'Bãi X50' },
    { id: 16, name: '43C01353_C', status: 'at-port', hasGoods: true, location: 'Bãi xe 223 Trục chính (trả hàng bct )' },
    { id: 17, name: '43C01354_C', status: 'at-port', hasGoods: false, location: 'bãi Dăm Bạch đàn' },
    { id: 18, name: '43C01355_C', status: 'at-port', hasGoods: true, location: 'Bãi Tân Thành ( container Hòa cầm )' },
    { id: 19, name: '43C01356_C', status: 'at-port', hasGoods: true, location: 'bãi Dăm Bạch đàn' },
    { id: 20, name: '43C01357_C', status: 'at-port', hasGoods: false, location: 'bãi Dăm Bạch đàn' },
    { id: 21, name: '43C01358_C', status: 'at-port', hasGoods: true, location: 'Bãi Tân Thành' },
    { id: 22, name: '43C01359_C', status: 'at-port', hasGoods: true, location: 'bãi Dăm Bạch đàn' },
    { id: 23, name: '43C01360_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Hồng' },
    { id: 24, name: '43C01361_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Bạch Đằng' },
    { id: 25, name: '43C01362_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Đuống' },
    { id: 26, name: '43C01363_C', status: 'at-port', hasGoods: false, location: '504' },
    { id: 27, name: '43C01364_C', status: 'at-port', hasGoods: false, location: '504' },
    { id: 28, name: '43C01365_C', status: 'at-port', hasGoods: true, location: 'Bãi Cà Mau' },
    { id: 29, name: '43C01366_C', status: 'at-port', hasGoods: false, location: '504' },
    { id: 30, name: '43C01366_C', status: 'at-port', hasGoods: false, location: 'Bãi sông Đuống' },
    { id: 31, name: '43C01367_C', status: 'at-port', hasGoods: true, location: 'bãi Dăm Bạch đàn' },
    { id: 32, name: '43C01368_C', status: 'at-port', hasGoods: false, location: 'Bãi Hòa Bình' },
    { id: 33, name: '43C01369_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Đà' },
    { id: 34, name: '43C01370_C', status: 'at-port', hasGoods: false, location: 'Bãi Cửa Lò' },
    { id: 35, name: '43C01371_C', status: 'at-port', hasGoods: true, location: 'Bãi Thanh Hóa' },
    { id: 36, name: '43C01372_C', status: 'at-plant', hasGoods: true, location: 'Keyhinge Hòa Cầm' },
    { id: 37, name: '43C01373_C', status: 'at-plant', hasGoods: true, location: 'Keyhinge Hòa Cầm' },
    { id: 38, name: '43C01374_C', status: 'at-plant', hasGoods: true, location: 'Cty Sedovina ( trang thiết bị trường học )' },
    { id: 39, name: '43C01375_C', status: 'at-plant', hasGoods: true, location: 'Sợi Phú Nam' },
    { id: 40, name: '43C01376_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Daikkin' },
    { id: 41, name: '43C01377_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Hưng Long' },
    { id: 42, name: '43C01378_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Thái Bình' },
    { id: 43, name: '43C01379_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Hưng Long' },
    { id: 44, name: '43C01380_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Hồng' },
    { id: 45, name: '43C01381_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Hồng' },
    { id: 46, name: '43C01382_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Hồng' },
    { id: 47, name: '43C01383_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Hồng' },
    { id: 48, name: '43C01384_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Hồng' },
    { id: 49, name: '43C01385_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Đà' },
    { id: 50, name: '43C01386_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Đà' },
    { id: 51, name: '43C01387_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Đà' },
    { id: 52, name: '43C01388_C', status: 'at-port', hasGoods: false, location: 'Bãi Cà Mau' },
    { id: 53, name: '43C01389_C', status: 'at-port', hasGoods: false, location: 'Bãi Cà Mau' },
    { id: 54, name: '43C01390_C', status: 'at-port', hasGoods: false, location: 'Bãi Cà Mau' },
    { id: 55, name: '43C01391_C', status: 'at-port', hasGoods: false, location: 'Bãi Cà Mau' },
    { id: 56, name: '43C01392_C', status: 'at-port', hasGoods: false, location: 'Bãi Cà Mau' },
    { id: 57, name: '43C01393_C', status: 'at-port', hasGoods: false, location: 'Bãi Cà Mau' },
    { id: 58, name: '43C01394_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Bạch Đằng' },
    { id: 59, name: '43C01395_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Bạch Đằng' },
    { id: 60, name: '43C01396_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Bạch Đằng' },
    { id: 61, name: '43C01397_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Bạch Đằng' },
    { id: 62, name: '43C01398_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Bạch Đằng' },
    { id: 63, name: '43C01399_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Bạch Đằng' },
    { id: 64, name: '43C01400_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Bạch Đằng' },
    { id: 65, name: '43C01401_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 66, name: '43C01402_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 67, name: '43C01403_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 68, name: '43C01404_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 69, name: '43C01405_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 70, name: '43C01406_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 71, name: '43C01407_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 72, name: '43C01408_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 73, name: '43C01409_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 74, name: '43C01410_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 75, name: '43C01411_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 76, name: '43C01412_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 77, name: '43C01413_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 78, name: '43C01414_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 79, name: '43C01415_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Daikkin' },
    { id: 80, name: '43C01416_C', status: 'at-plant', hasGoods: false, location: 'Dệt may Thái Bình' },
    { id: 81, name: '43C01417_C', status: 'at-plant', hasGoods: true, location: 'Nhà máy Vinamilk' },
    { id: 82, name: '43C01418_C', status: 'at-plant', hasGoods: false, location: 'Sợi Phú Nam' },
    { id: 83, name: '43C01419_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Samsung' },
    { id: 84, name: '43C01420_C', status: 'at-plant', hasGoods: true, location: 'Nhà máy LG' },
    { id: 85, name: '43C01421_C', status: 'at-plant', hasGoods: false, location: 'Nhà máy LG' },
    { id: 86, name: '43C01422_C', status: 'at-plant', hasGoods: true, location: 'Nhà máy LG' },
    { id: 87, name: '43C01423_C', status: 'at-plant', hasGoods: false, location: 'Nhà máy LG' },
    { id: 88, name: '43C01424_C', status: 'at-plant', hasGoods: true, location: 'Nhà máy LG' },
    { id: 89, name: '43C01425_C', status: 'at-plant', hasGoods: true, location: 'Nhà máy LG' },
    { id: 90, name: '43C01426_C', status: 'at-plant', hasGoods: false, location: 'Nhà máy LG' },
    { id: 91, name: '43C01427_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Nestle' },
    { id: 92, name: '43C01428_C', status: 'at-plant', hasGoods: false, location: 'Nhà máy Coca-Cola' },
    { id: 93, name: '43C01429_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Panasonic' },
    { id: 94, name: '43C01430_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Phong Phú' },
    { id: 95, name: '43C01431_C', status: 'at-plant', hasGoods: false, location: 'Sợi Phú Nam' },
    { id: 96, name: '43C01432_C', status: 'at-plant', hasGoods: true, location: 'Sợi Phú Nam' },
    { id: 97, name: '43C01433_C', status: 'at-plant', hasGoods: false, location: 'Sợi Phú Nam' },
    { id: 98, name: '43C01434_C', status: 'at-plant', hasGoods: true, location: 'Sợi Phú Nam' },
    { id: 99, name: '43C01435_C', status: 'at-plant', hasGoods: true, location: 'Sợi Phú Nam' },
    { id: 100, name: '43C01436_C', status: 'at-plant', hasGoods: false, location: 'Sợi Phú Nam' },
    { id: 101, name: '43C01437_C', status: 'at-plant', hasGoods: true, location: 'Keyhinge Hòa Cầm' },
    { id: 102, name: '43C01438_C', status: 'at-plant', hasGoods: false, location: 'Keyhinge Hòa Cầm' },
    { id: 103, name: '43C01439_C', status: 'at-plant', hasGoods: true, location: 'Keyhinge Hòa Cầm' },
    { id: 104, name: '43C01440_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 105, name: '43C01441_C', status: 'on-road', hasGoods: false, location: '' },
    { id: 106, name: '43C01442_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 107, name: '43C01443_C', status: 'on-road', hasGoods: false, location: '' },
    { id: 108, name: '43C01444_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 109, name: '43C01445_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 110, name: '43C01446_C', status: 'on-road', hasGoods: false, location: '' },
    { id: 111, name: '43C01447_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 112, name: '43C01448_C', status: 'on-road', hasGoods: false, location: '' },
    { id: 113, name: '43C01449_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 114, name: '43C01450_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 115, name: '43C01451_C', status: 'on-road', hasGoods: false, location: '' },
    { id: 116, name: '43C01452_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 117, name: '43C01453_C', status: 'on-road', hasGoods: false, location: '' },
    { id: 118, name: '43C01454_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 119, name: '43C01455_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 120, name: '43C01456_C', status: 'on-road', hasGoods: false, location: '' },
    { id: 121, name: '43C01457_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 122, name: '43C01458_C', status: 'on-road', hasGoods: false, location: '' },
    { id: 123, name: '43C01459_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 124, name: '43C01460_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 125, name: '43C01461_C', status: 'at-border', hasGoods: false, location: '' },
    { id: 126, name: '43C01462_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 127, name: '43C01463_C', status: 'at-border', hasGoods: false, location: '' },
    { id: 128, name: '43C01464_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 129, name: '43C01465_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 130, name: '43C01466_C', status: 'at-border', hasGoods: false, location: '' },
    { id: 131, name: '43C01467_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 132, name: '43C01468_C', status: 'at-border', hasGoods: false, location: '' },
    { id: 133, name: '43C01469_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 134, name: '43C01470_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 135, name: '43C01471_C', status: 'at-border', hasGoods: false, location: '' },
    { id: 136, name: '43C01472_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 137, name: '43C01473_C', status: 'at-border', hasGoods: false, location: '' },
    { id: 138, name: '43C01474_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 139, name: '43C01475_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 140, name: '43C01476_C', status: 'at-border', hasGoods: false, location: '' },
    { id: 141, name: '43C01477_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 142, name: '43C01478_C', status: 'at-border', hasGoods: false, location: '' },
    { id: 143, name: '43C01479_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 144, name: '43C01480_C', status: 'at-port', hasGoods: true, location: 'Bãi sông Hồng' },
    { id: 145, name: '43C01481_C', status: 'at-port', hasGoods: false, location: 'Bãi sông Đà' },
    { id: 146, name: '43C01482_C', status: 'at-port', hasGoods: true, location: 'Bãi Cà Mau' },
    { id: 147, name: '43C01483_C', status: 'at-port', hasGoods: false, location: 'Bãi sông Bạch Đằng' },
    { id: 148, name: '43C01484_C', status: 'at-port', hasGoods: true, location: 'Bãi Vũng Tàu' },
    { id: 149, name: '43C01485_C', status: 'at-port', hasGoods: false, location: 'Bãi Quy Nhơn' },
    { id: 150, name: '43C01486_C', status: 'at-port', hasGoods: true, location: 'Bãi Nha Trang' },
    { id: 151, name: '43C01487_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 152, name: '43C01488_C', status: 'at-plant', hasGoods: false, location: 'Công xưởng Mektek' },
    { id: 153, name: '43C01489_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 154, name: '43C01490_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 155, name: '43C01491_C', status: 'at-plant', hasGoods: false, location: 'Công xưởng Mektek' },
    { id: 156, name: '43C01492_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Hưng Long' },
    { id: 157, name: '43C01493_C', status: 'at-plant', hasGoods: false, location: 'Dệt may Hưng Long' },
    { id: 158, name: '43C01494_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Hưng Long' },
    { id: 159, name: '43C01495_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Hưng Long' },
    { id: 160, name: '43C01496_C', status: 'at-plant', hasGoods: false, location: 'Dệt may Hưng Long' },
    { id: 161, name: '43C01497_C', status: 'at-plant', hasGoods: true, location: 'Nhà máy Vinamilk' },
    { id: 162, name: '43C01498_C', status: 'at-plant', hasGoods: false, location: 'Nhà máy Vinamilk' },
    { id: 163, name: '43C01499_C', status: 'at-plant', hasGoods: true, location: 'Nhà máy Vinamilk' },
    { id: 164, name: '43C01500_C', status: 'at-plant', hasGoods: true, location: 'Nhà máy Vinamilk' },
    { id: 165, name: '43C01501_C', status: 'at-plant', hasGoods: false, location: 'Nhà máy Vinamilk' },
    { id: 166, name: '43C01502_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Samsung' },
    { id: 167, name: '43C01503_C', status: 'at-plant', hasGoods: false, location: 'Công xưởng Samsung' },
    { id: 168, name: '43C01504_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Samsung' },
    { id: 169, name: '43C01505_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Samsung' },
    { id: 170, name: '43C01506_C', status: 'at-plant', hasGoods: false, location: 'Công xưởng Samsung' },
    { id: 171, name: '43C01507_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Thái Bình' },
    { id: 172, name: '43C01508_C', status: 'at-plant', hasGoods: false, location: 'Dệt may Thái Bình' },
    { id: 173, name: '43C01509_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Thái Bình' },
    { id: 174, name: '43C01510_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Thái Bình' },
    { id: 175, name: '43C01511_C', status: 'at-plant', hasGoods: false, location: 'Dệt may Thái Bình' },
    { id: 176, name: '43C01512_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 177, name: '43C01513_C', status: 'on-road', hasGoods: false, location: '' },
    { id: 178, name: '43C01514_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 179, name: '43C01515_C', status: 'on-road', hasGoods: false, location: '' },
    { id: 180, name: '43C01516_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 181, name: '43C01517_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 182, name: '43C01518_C', status: 'on-road', hasGoods: false, location: '' },
    { id: 183, name: '43C01519_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 184, name: '43C01520_C', status: 'on-road', hasGoods: false, location: '' },
    { id: 185, name: '43C01521_C', status: 'on-road', hasGoods: true, location: '' },
    { id: 186, name: '43C01522_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 187, name: '43C01523_C', status: 'at-border', hasGoods: false, location: '' },
    { id: 188, name: '43C01524_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 189, name: '43C01525_C', status: 'at-border', hasGoods: false, location: '' },
    { id: 190, name: '43C01526_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 191, name: '43C01527_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 192, name: '43C01528_C', status: 'at-border', hasGoods: false, location: '' },
    { id: 193, name: '43C01529_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 194, name: '43C01530_C', status: 'at-border', hasGoods: false, location: '' },
    { id: 195, name: '43C01531_C', status: 'at-border', hasGoods: true, location: '' },
    { id: 196, name: '43C01532_C', status: 'at-plant', hasGoods: true, location: 'Công xưởng Mektek' },
    { id: 197, name: '43C01533_C', status: 'at-plant', hasGoods: false, location: 'Công xưởng Mektek' },
    { id: 198, name: '43C01534_C', status: 'at-plant', hasGoods: true, location: 'Dệt may Hưng Long' },
    { id: 199, name: '43C01535_C', status: 'at-plant', hasGoods: true, location: 'Nhà máy Vinamilk' },
    { id: 200, name: '43C01536_C', status: 'at-plant', hasGoods: false, location: 'Công xưởng Samsung' },
    { id: 201, name: '43C01537_C', status: 'at-port', hasGoods: true, location: 'Bãi Cảng Hải Phòng' },
    { id: 202, name: '43C01538_C', status: 'at-port', hasGoods: false, location: 'Bãi Cảng Đà Nẵng' },
    { id: 203, name: '43C01539_C', status: 'at-port', hasGoods: true, location: 'Cảng Tiên Sa' },
    { id: 204, name: '43C01540_C', status: 'at-port', hasGoods: false, location: 'Cảng Liên Chiểu' },
    { id: 205, name: '43C01541_C', status: 'at-port', hasGoods: true, location: 'Bãi Cảng Vũng Rô' },
    { id: 206, name: '43C01542_C', status: 'at-port', hasGoods: true, location: 'Cảng Cam Ranh' },
    { id: 207, name: '43C01543_C', status: 'at-port', hasGoods: false, location: 'Bãi Cảng Sài Gòn' },
    { id: 208, name: '43C01544_C', status: 'at-port', hasGoods: true, location: 'Cảng Cát Lái' },
    { id: 209, name: '43C01545_C', status: 'at-port', hasGoods: false, location: 'Bãi Cảng Bà Rịa' },
    { id: 210, name: '43C01546_C', status: 'at-port', hasGoods: true, location: 'Cảng Phú Mỹ' },
    { id: 211, name: '43C01547_C', status: 'at-port', hasGoods: false, location: 'Bãi Cảng Dung Quất' },
    { id: 212, name: '43C01548_C', status: 'at-port', hasGoods: true, location: 'Cảng Kỳ Hà' },
    { id: 213, name: '43C01549_C', status: 'at-port', hasGoods: true, location: 'Bãi Cảng Chân Mây' },
    { id: 214, name: '43C01550_C', status: 'at-port', hasGoods: false, location: 'Cảng Vân Phong' },
    { id: 215, name: '43C01551_C', status: 'at-port', hasGoods: true, location: 'Bãi Cảng Nam Định' },
    { id: 216, name: '43C01552_C', status: 'at-port', hasGoods: false, location: 'Cảng Cái Mép' },
    { id: 217, name: '43C01553_C', status: 'at-port', hasGoods: true, location: 'Bãi Cảng Bến Nghé' },
    { id: 218, name: '43C01554_C', status: 'at-port', hasGoods: true, location: 'Cảng Hiệp Phước' },
    { id: 219, name: '43C01555_C', status: 'at-port', hasGoods: false, location: 'Bãi Cảng Đồng Nai' },
    { id: 220, name: '43C01556_C', status: 'at-port', hasGoods: true, location: 'Cảng Tân Cảng' }
  ];

  private adjustAutoWidthsBound = () => this.adjustAutoWidths();

  ngOnInit(): void {
    this.startAutoRefresh();
    window.addEventListener('adjustAutoWidths', this.adjustAutoWidthsBound);
  }

  ngOnDestroy(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
    window.removeEventListener('adjustAutoWidths', this.adjustAutoWidthsBound)
  }

  /*Reload lại tất cả chart */
  refreshAll(): void {
    this.donutCharts.forEach((d) => d.refreshChart());
    this.barCharts.forEach((b) => b.refreshChart());
  }

  /*Xử lý Dropdown và checkbox để lấy danh sách xe*/
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedVehicles = this.vehicles.map((v) => v.id);
    } else {
      this.selectedVehicles = [];
    }
    this.refreshAll();
  }

  onCheckboxChange(event: any, id: number) {
    if (event.target.checked) {
      this.selectedVehicles = [...this.selectedVehicles, id];
    } else {
      this.selectedVehicles = this.selectedVehicles.filter(v => v !== id);
    }
    this.refreshAll();
  }

  getSelectedText(): string {
    if (this.selectedVehicles.length === 0) {
      return this.i18nService.instant('DASHBOARD.SELECT_PLACEHOLDER');
    }
    if (this.selectedVehicles.length === 1) {
      const v = this.vehicles.find(x => x.id === this.selectedVehicles[0]);
      return v ? v.name : this.i18nService.instant('DASHBOARD.SELECT_PLACEHOLDER');
    }
    return `${this.selectedVehicles.length} ${this.i18nService.instant('DASHBOARD.SELECT_VEHICLE')}`;
  }

  get filteredVehicles() {
    return this.selectedVehicles.length === 0
      ? this.vehicles
      : this.vehicles.filter(v => this.selectedVehicles.includes(v.id));
  }

  /* Xử lý cho phần tính năng chọn độ rộng -> khi ở chế độ auto */
  adjustAutoWidths() {
    const widgets = Array.from(document.querySelectorAll<HTMLElement>('app-chart-donut, app-chart-bar'))
      .filter(el => el.offsetParent !== null);

    if (!widgets.length) return;

    const rowContainer = document.querySelector<HTMLElement>('.dashboard-row') ?? widgets[0].parentElement!;

    const rows: HTMLElement[][] = [];
    const TOL = 8;

    widgets.forEach(el => {
      const top = Math.round(el.getBoundingClientRect().top);
      let grp = rows.find(g => Math.abs(Math.round(g[0].getBoundingClientRect().top) - top) <= TOL);
      if (grp) grp.push(el);
      else rows.push([el]);
    });

    rows.forEach(row => {
      const containerWidth = rowContainer.getBoundingClientRect().width || window.innerWidth;
      let fixedColsSum = 0;
      const autoWidgets: HTMLElement[] = [];

      row.forEach(el => {
        if (window.getComputedStyle(el).display === 'none') return;
        if (el.classList.contains('widget-width-auto')) {
          autoWidgets.push(el);
        } else {
          let cols = 0;
          const maxW = el.style.maxWidth;
          if (maxW && maxW.includes('%')) {
            cols = Math.round((parseFloat(maxW) / 100) * 12);
          } else {
            const w = el.getBoundingClientRect().width;
            cols = Math.round((w / containerWidth) * 12) || 1;
          }
          cols = Math.min(Math.max(cols, 1), 12);
          fixedColsSum += cols;
        }
      });

      let remain = Math.max(0, 12 - fixedColsSum);

      if (autoWidgets.length > 0) {
        const perAutoCols = remain > 0 ? (remain / autoWidgets.length) : (12 / autoWidgets.length);

        autoWidgets.forEach((el) => {
          const percent = (perAutoCols / 12) * 100;
          el.style.flex = `0 0 ${percent}%`;
          el.style.maxWidth = `${percent}%`;
          el.style.order = '';
        });
      }
    });
  }

  /* Cài đặt reload lại toàn bộ chart ở màn dashboard -> 5p/1lần */
  private startAutoRefresh(): void {
    const refreshIntervalMs = 5 * 60 * 1000;
    this.refreshIntervalId = setInterval(() => {
      this.refreshAll();
    }, refreshIntervalMs);
  }
}
