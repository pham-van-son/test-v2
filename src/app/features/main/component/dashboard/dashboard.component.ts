import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnDestroy, OnInit } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, Chart, ChartData } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import { centerTextPlugin } from '../../../../shared/pipe/count-chart-donut.pipe';
import { Vehicle } from '../../../../core/interface/vehicle.interface';

Chart.register(ChartDataLabels, centerTextPlugin);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgChartsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private i18nService = inject(TranslateService);
  private refreshIntervalId: any;

  selectedVehicles: number[] = [];
  isDropdownOpen = false;

  widgetWidthDropdownOpenCompany = false;
  showWidgetWidthSubmenuCompany = false;
  widgetWidthCompany: 'large' | 'small' | 'medium' | 'auto' = 'large';

  widgetWidthDropdownOpenDonut1 = false;
  showWidgetWidthSubmenuDonut1 = false;
  widgetWidthDonut1: 'small' | 'large' | 'medium' | 'auto' = 'small';

  widgetWidthDropdownOpenDonut2 = false;
  showWidgetWidthSubmenuDonut2 = false;
  widgetWidthDonut2: 'small' | 'large' | 'medium' | 'auto' = 'small';

  widgetWidthDropdownOpenColumn1 = false;
  showWidgetWidthSubmenuColumn1 = false;
  widgetWidthColumn1: 'small' | 'large' | 'medium' | 'auto' = 'small';

  widgetWidthDropdownOpenColumn2 = false;
  showWidgetWidthSubmenuColumn2 = false;
  widgetWidthColumn2: 'large' | 'small' | 'medium' | 'auto' = 'large';

  showCompanyStats = true;
  visible = { donut1: true, donut2: true, colPlant: true, colPort: true };

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
    { id: 200, name: '43C01536_C', status: 'at-plant', hasGoods: false, location: 'Công xưởng Samsung' }
  ];

  public donutType: 'doughnut' = 'doughnut';
  public donutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: { enabled: true }
    }
  };
  public donut1Data: ChartData<'doughnut'> = {
    labels: [`${this.i18nService.instant("DASHBOARD.COMMON.COUNT_VEHICLE_IN_STOCK")}`, `${this.i18nService.instant("DASHBOARD.COMMON.COUNT_VEHICLE_NOT_IN_STOCK")}`],
    datasets: [{ data: [0, 0], backgroundColor: ['#509447', '#e2803c'] }]
  };
  public donut2Data: ChartData<'doughnut'> = {
    labels: [`${this.i18nService.instant("DASHBOARD.COMMON.COUNT_VEHICLE_IN_STOCK")}`, `${this.i18nService.instant("DASHBOARD.COMMON.COUNT_VEHICLE_NOT_IN_STOCK")}`],
    datasets: [{ data: [0, 0], backgroundColor: ['#509447', '#e2803c'], }]
  };

  public barPlantType: 'bar' = 'bar';
  public barPlantLabels: string[] = [];
  public barPlantData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: '#dc143c',
        label: `${this.i18nService.instant("DASHBOARD.COMMON.COUNT_VEHICLE")}`,
        barPercentage: 0.4,
        categoryPercentage: 0.4
      }
    ]
  };
  public barPlantOptions: ChartOptions<'bar'> = {
    responsive: false,
    maintainAspectRatio: false,
    datasets: {
      bar: {
        barThickness: 30,
      }
    },
    layout: { padding: { top: 20 } },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#808080',
        font: { size: 11 },
        formatter: (value) => value
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: window.innerWidth < 768 ? 45 : 0,
          minRotation: window.innerWidth < 768 ? 45 : 0,
          font: { size: 10 },
          callback: function (value, index, ticks) {
            const label = this.getLabelForValue(Number(value));
            return typeof label === 'string' && label.length > 10 ? label.match(/.{1,13}/g) : label;
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value, index, ticks) {
            if (index === ticks.length - 1) {
              return 'Số phương tiện';
            }
            return value;
          }
        }
      }
    }
  };

  public barPortType: 'bar' = 'bar';
  public barPortLabels: string[] = [];
  public barPortData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: '#20c997',
        label: 'Số phương tiện',
        barPercentage: 0.4,
        categoryPercentage: 0.4
      }
    ]
  };
  public barPortOptions: ChartOptions<'bar'> = {
    responsive: false,
    maintainAspectRatio: false,
    datasets: {
      bar: {
        barThickness: 20,
      }
    },
    layout: { padding: { top: 20 } },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#808080',
        font: { size: 11 },
        formatter: (value) => value
      }
    },
    scales: {
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: window.innerWidth < 768 ? 45 : 0,
          minRotation: window.innerWidth < 768 ? 45 : 0,
          font: { size: 10 },
          callback: function (value, index, ticks) {
            const label = this.getLabelForValue(Number(value));
            return typeof label === 'string' && label.length > 10
              ? label.match(/.{1,13}/g)
              : label;
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value, index, ticks) {
            if (index === ticks.length - 1) {
              return 'Số phương tiện';
            }
            return value;
          }
        }
      }
    }
  };

  public chartPlugins = [ChartDataLabels, centerTextPlugin];

  canvasWidth = 0;
  canvasMinWidth = '0px';

  widgetWidthDropdownOpen = false;
  showWidgetWidthSubmenu = false;
  widgetWidth: 'auto' | 'small' | 'medium' | 'large' = 'auto';

  constructor() { }

  ngOnInit(): void {
    this.updateDonut1Data();
    this.updateDonut2Data();
    this.updateBarPlantData();
    this.updateBarPortData();
    this.updateCanvasWidth();
    window.addEventListener('resize', () => this.updateCanvasWidth());
    this.initWidgetWidths();
    this.startAutoRefresh();
  }

  initWidgetWidths() {
    if (this.widgetWidthCompany === 'auto') {
      this.widgetWidthCompany = 'auto';
    }
    if (this.widgetWidthDonut1 === 'auto') {
      this.widgetWidthDonut1 = 'auto';
    }
    if (this.widgetWidthDonut2 === 'auto') {
      this.widgetWidthDonut2 = 'auto';
    }
    if (this.widgetWidthColumn1 === 'auto') {
      this.widgetWidthColumn1 = 'auto';
    }
    if (this.widgetWidthColumn2 === 'auto') {
      this.widgetWidthColumn2 = 'auto';
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.updateCanvasWidth();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleSelectAll(event: any) {
    if (event.target.checked) {
      this.selectedVehicles = this.vehicles.map(v => v.id);
    } else {
      this.selectedVehicles = [];
    }
    this.filterWidgetsBySelectedVehicles();
  }

  onCheckboxChange(event: any, id: number) {
    if (event.target.checked) {
      this.selectedVehicles.push(id);
    } else {
      this.selectedVehicles = this.selectedVehicles.filter(v => v !== id);
    }
    this.filterWidgetsBySelectedVehicles();
  }

  filterWidgetsBySelectedVehicles() {
    const filteredVehicles = this.selectedVehicles.length === 0
      ? this.vehicles
      : this.vehicles.filter(v => this.selectedVehicles.includes(v.id));

    this.updateDonut1Data(filteredVehicles);
    this.updateDonut2Data(filteredVehicles);
    this.updateBarPlantData(filteredVehicles);
    this.updateBarPortData(filteredVehicles);
  }

  getSelectedText(): string {
    if (this.selectedVehicles.length === 0) {
      return this.i18nService.instant('DASHBOARD.SELECT_PLACEHOLDER');
    }
    if (this.selectedVehicles.length === 1) {
      const v = this.vehicles.find(x => x.id === this.selectedVehicles[0]);
      return v ? v.name : `${this.i18nService.instant('DASHBOARD.SELECT_PLACEHOLDER')}`;
    }
    return `${this.selectedVehicles.length} ${this.i18nService.instant('DASHBOARD.SELECT_VEHICLE')}`;
  }

  toggleCompanyStats() {
    this.showCompanyStats = !this.showCompanyStats;
  }

  toggleDonut1() {
    this.visible.donut1 = !this.visible.donut1;
  }

  toggleDonut2() {
    this.visible.donut2 = !this.visible.donut2;
  }

  toggleColPlant() {
    this.visible.colPlant = !this.visible.colPlant;
  }

  toggleColPort() {
    this.visible.colPort = !this.visible.colPort;
  }

  openWidgetWidthDropdownDonut1() {
    this.widgetWidthDropdownOpenDonut1 = true;
  }
  closeWidgetWidthDropdownDonut1() {
    this.widgetWidthDropdownOpenDonut1 = false;
    this.showWidgetWidthSubmenuDonut1 = false;
  }
  setWidgetWidthDonut1(width: 'auto' | 'small' | 'medium' | 'large') {
    if (width === 'auto') {
      this.widgetWidthDonut1 = 'small';
    } else {
      this.widgetWidthDonut1 = width;
    }
    this.closeWidgetWidthDropdownDonut1();
  }

  openWidgetWidthDropdownCompany() {
    this.widgetWidthDropdownOpenCompany = true;
  }
  closeWidgetWidthDropdownCompany() {
    this.widgetWidthDropdownOpenCompany = false;
    this.showWidgetWidthSubmenuCompany = false;
  }
  setWidgetWidthCompany(width: 'auto' | 'small' | 'medium' | 'large') {
    if (width === 'auto') {
      this.widgetWidthCompany = 'large';
    } else {
      this.widgetWidthCompany = width;
    }
    this.closeWidgetWidthDropdownCompany();
  }

  openWidgetWidthDropdownDonut2() {
    this.widgetWidthDropdownOpenDonut2 = true;
  }
  closeWidgetWidthDropdownDonut2() {
    this.widgetWidthDropdownOpenDonut2 = false;
    this.showWidgetWidthSubmenuDonut2 = false;
  }
  setWidgetWidthDonut2(width: 'auto' | 'small' | 'medium' | 'large') {
    if (width === 'auto') {
      this.widgetWidthDonut2 = 'small';
    } else {
      this.widgetWidthDonut2 = width;
    }

    setTimeout(() => {
      this.refreshDonut2();
    }, 0);
    this.closeWidgetWidthDropdownDonut2();
  }

  openWidgetWidthDropdownColumn1() {
    this.widgetWidthDropdownOpenColumn1 = true;
  }
  closeWidgetWidthDropdownColumn1() {
    this.widgetWidthDropdownOpenColumn1 = false;
    this.showWidgetWidthSubmenuColumn1 = false;
  }
  setWidgetWidthColumn1(width: 'auto' | 'small' | 'medium' | 'large') {
    if (width === 'auto') {
      this.widgetWidthColumn1 = 'small';
    } else {
      this.widgetWidthColumn1 = width;
    }
    this.closeWidgetWidthDropdownColumn1();
  }

  openWidgetWidthDropdownColumn2() {
    this.widgetWidthDropdownOpenColumn2 = true;
  }
  closeWidgetWidthDropdownColumn2() {
    this.widgetWidthDropdownOpenColumn2 = false;
    this.showWidgetWidthSubmenuColumn2 = false;
  }
  setWidgetWidthColumn2(width: 'auto' | 'small' | 'medium' | 'large') {
    if (width === 'auto') {
      this.widgetWidthColumn2 = 'large';
    } else {
      this.widgetWidthColumn2 = width;
    }
    this.closeWidgetWidthDropdownColumn2();
  }

  getWidgetWidthClass(widget: string) {
    let width: 'auto' | 'small' | 'medium' | 'large' = 'auto';

    switch (widget) {
      case 'donut1':
        width = this.widgetWidthDonut1;
        break;
      case 'donut2':
        width = this.widgetWidthDonut2;
        break;
      case 'column1':
        width = this.widgetWidthColumn1;
        break;
      case 'column2':
        width = this.widgetWidthColumn2;
        break;
      case 'company':
        width = this.widgetWidthCompany;
        break;
    }

    switch (width) {
      case 'small':
        return 'widget-width-small';
      case 'medium':
        return 'widget-width-medium';
      case 'large':
        return 'widget-width-large';
      default:
        return 'widget-width-auto';
    }
  }



  getCanvasMinWidth(labels: string[]): string {
    const pxPerLabel = 17;
    return `${labels.length * pxPerLabel}px`;
  }
  getCanvasMinWidthPort(): string {
    const pxPerLabel = 60;
    return `${this.barPortLabels.length * pxPerLabel}px`;
  }
  updateCanvasWidth() {
    const colWidth = document.querySelector('.col-12')?.clientWidth || 600;
    const pxPerLabel = 80;
    const minWidth = Math.max(this.barPortLabels.length * pxPerLabel, colWidth);
    this.canvasWidth = minWidth;
  }

  updateDonut1Data(vehicles = this.vehicles) {
    const atBorder = vehicles.filter(v => v.status === 'at-border');

    this.donut1Data = {
      labels: [`${this.i18nService.instant("DASHBOARD.COMMON.COUNT_VEHICLE_IN_STOCK")}`, `${this.i18nService.instant("DASHBOARD.COMMON.COUNT_VEHICLE_NOT_IN_STOCK")}`],
      datasets: [
        {
          data: [
            atBorder.filter(v => v.hasGoods).length,
            atBorder.filter(v => !v.hasGoods).length
          ],
          backgroundColor: ['#509447', '#e2803c']
        }
      ]
    };
  }

  updateDonut2Data(vehicles = this.vehicles) {
    const onRoad = vehicles.filter(v => v.status === 'on-road');

    this.donut2Data = {
      labels: [`${this.i18nService.instant("DASHBOARD.COMMON.COUNT_VEHICLE_IN_STOCK")}`, `${this.i18nService.instant("DASHBOARD.COMMON.COUNT_VEHICLE_NOT_IN_STOCK")}`],
      datasets: [
        {
          data: [
            onRoad.filter(v => v.hasGoods).length,
            onRoad.filter(v => !v.hasGoods).length
          ],
          backgroundColor: ['#509447', '#e2803c']
        }
      ]
    };
  }


  updateBarPlantData(vehicles = this.vehicles) {
    const plantLabels = Array.from(new Set(
      vehicles.filter(v => v.status === 'at-plant').map(v => v.location)
    ));
    const plantCounts = plantLabels.map(label =>
      vehicles.filter(v => v.status === 'at-plant' && v.location === label).length
    );
    this.barPlantLabels = plantLabels;
    this.barPlantData = {
      labels: plantLabels,
      datasets: [{
        data: plantCounts,
        backgroundColor: '#dc143c',
        label: 'Số phương tiện',
        barPercentage: 0.4,
        categoryPercentage: 0.4
      }]
    };
  }

  updateBarPortData(vehicles = this.vehicles) {
    const portLabels = Array.from(new Set(
      vehicles.filter(v => v.status === 'at-port').map(v => v.location)
    ));
    const portCounts = portLabels.map(label =>
      vehicles.filter(v => v.status === 'at-port' && v.location === label).length
    );
    this.barPortLabels = portLabels;
    this.barPortData = {
      labels: portLabels,
      datasets: [{
        data: portCounts,
        backgroundColor: '#20c997',
        label: 'Số phương tiện',
        barPercentage: 0.4,
        categoryPercentage: 0.4
      }]
    };
  }

  get totalVehicles(): number {
    return this.vehicles.length;
  }

  get totalVehiclesInStock(): number {
    return this.vehicles.filter(v => v.hasGoods === true).length;
  }

  get totalVehiclesNotInStock(): number {
    return this.vehicles.filter(v => v.hasGoods === false).length;
  }

  get percentInStock(): number {
    return this.totalVehicles === 0 ? 0 : Math.round(this.totalVehiclesInStock / this.totalVehicles * 100);
  }

  get percentNotInStock(): number {
    return this.totalVehicles === 0 ? 0 : Math.round(this.totalVehiclesNotInStock / this.totalVehicles * 100);
  }

  updateCompanyStats() {
    return {
      totalVehicles: this.totalVehicles,
      totalVehiclesInStock: this.totalVehiclesInStock,
      totalVehiclesNotInStock: this.totalVehiclesNotInStock,
      percentInStock: this.percentInStock,
      percentNotInStock: this.percentNotInStock
    };
  }

  refreshDonut1() {
    this.updateDonut1Data(this.selectedVehicles.length === 0 ? this.vehicles : this.vehicles.filter(v => this.selectedVehicles.includes(v.id)));
  }

  refreshDonut2() {
    this.updateDonut2Data(this.selectedVehicles.length === 0 ? this.vehicles : this.vehicles.filter(v => this.selectedVehicles.includes(v.id)));
  }

  refreshBarPlant() {
    this.updateBarPlantData(this.selectedVehicles.length === 0 ? this.vehicles : this.vehicles.filter(v => this.selectedVehicles.includes(v.id)));
  }

  refreshBarPort() {
    this.updateBarPortData(this.selectedVehicles.length === 0 ? this.vehicles : this.vehicles.filter(v => this.selectedVehicles.includes(v.id)));
  }

  refreshCompanyStats() {
    this.updateCompanyStats();
  }

  refreshAll() {
    this.selectedVehicles = [];
    this.updateDonut1Data();
    this.updateDonut2Data();
    this.updateBarPlantData();
    this.updateBarPortData();
    this.updateCanvasWidth();
  }

  private positionRules: { [key: string]: ('small' | 'medium' | 'large')[] } = {
    donut1: ['large'],
    donut2: ['medium', 'large'],
    column1: ['small', 'large'],
    column2: ['large'],
    company: ['large']
  };

  getMenu1Position(type: 'donut1' | 'donut2' | 'column1' | 'column2' | 'company') {
    const width =
      type === 'donut1' ? this.widgetWidthDonut1 :
        type === 'donut2' ? this.widgetWidthDonut2 :
          type === 'column1' ? this.widgetWidthColumn1 :
            type === 'column2' ? this.widgetWidthColumn2 :
              this.widgetWidthCompany;
    if (width !== 'auto' && this.positionRules[type].includes(width)) {
      return {
        right: '0',
        left: 'auto',
        top: '10',
        minWidth: '160px',
        position: 'absolute'
      };
    } else {
      return {
        left: '0',
        right: 'auto',
        top: '10',
        minWidth: '160px',
        position: 'absolute'
      };
    }
  }

  getMenu2Position(type: 'company' | 'donut1' | 'donut2' | 'column1' | 'column2') {
    const width =
      type === 'company' ? this.widgetWidthCompany :
        type === 'donut1' ? this.widgetWidthDonut1 :
          type === 'donut2' ? this.widgetWidthDonut2 :
            type === 'column1' ? this.widgetWidthColumn1 :
              this.widgetWidthColumn2;
    if (width !== 'auto' && this.positionRules[type].includes(width)) {
      return {
        right: '100%',
        left: 'auto',
        top: '0',
        minWidth: '140px',
        position: 'absolute'
      };
    } else {
      return {
        left: '100%',
        right: 'auto',
        top: '0',
        minWidth: '140px',
        position: 'absolute'
      };
    }
  }

  ngOnDestroy(): void {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
  }

  private refreshAllWidgets(): void {
    const filteredVehicles = this.selectedVehicles.length === 0
      ? this.vehicles
      : this.vehicles.filter(v => this.selectedVehicles.includes(v.id));

    this.updateDonut1Data(filteredVehicles);
    this.updateDonut2Data(filteredVehicles);
    this.updateBarPlantData(filteredVehicles);
    this.updateBarPortData(filteredVehicles);
    this.updateCompanyStats();

    this.updateCanvasWidth();
  }

  private startAutoRefresh(): void {
    const refreshIntervalMs = 5 * 60 * 1000;
    this.refreshIntervalId = setInterval(() => {
      this.refreshAllWidgets();
    }, refreshIntervalMs);
  }

}
