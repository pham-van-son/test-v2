import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Branch } from '../../core/interface/branch.interface';
import { SocialMedia } from '../../core/interface/social-media.interface';
import { AppDownload } from '../../core/interface/app-download.interface';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  @Input() isLoggedIn = false;

  branches: Branch[] = [
    {
      id: 1,
      name: 'FOOTER.BRANCHES.HANOI',
      addresses: [
        'Lô 14 Nguyễn Cảnh Dị, P. Đại Kim,Q. Hoàng Mai, TP. Hà Nội',
      ]
    },
    {
      id: 2,
      name: 'FOOTER.BRANCHES.HAIPHONG',
      addresses: [
        'Căn BH 01- 47 Khu đô thị Vinhomes Imperia, Đ. Bạch Đằng, P. Thượng Lý, Q. Hồng Bàng, TP. Hải Phòng',
      ]
    },
    {
      id: 3,
      name: 'FOOTER.BRANCHES.CENTRAL',
      addresses: [
        'Số 85-15, ngõ 26, Đ. Nguyễn Thái Học, TP. Vinh, Nghệ An',
        'Số 402, Đ. Trần Phú, X. Thạch Trung, TP. Hà Tĩnh, Hà Tĩnh',
      ]
    },
    {
      id: 4,
      name: 'FOOTER.BRANCHES.DANANG',
      addresses: [
        'Lô 1 Khu B2-19, KĐT Biệt thự sinh thái, Công Viên Văn Hóa Làng Quê và Quần thể Du lịch sông nước, P. Hòa Quý, Ngũ Hành Sơn, TP.Đà Nẵng'
      ]
    },
    {
      id: 5,
      name: 'FOOTER.BRANCHES.HCMC',
      addresses: [
        'Số 9, Đường 37, KĐT Vạn Phúc, P. Hiệp Bình Phước, TP. Thủ Đức, TP. Hồ Chí Minh'
      ]
    }
  ];

  socialMedia: SocialMedia[] = [
    {
      name: 'Facebook',
      image: 'assets/images/img/social/facebook.png',
      url: 'https://www.facebook.com/giamsathanhtrinhbinhanh/'
    },
    {
      name: 'Zalo',
      image: 'assets/images/img/social/zalo.png',
      url: 'https://zalo.me/1958838581480438876'
    },
    {
      name: 'YouTube',
      image: 'assets/images/img/social/youtobe.png',
      url: 'https://www.youtube.com/@BAGPS'
    }
  ];

  appDownload: AppDownload[] = [
    {
      url: 'https://play.google.com/store/apps/details?id=vn.bagps.gpsmobile',
      image: 'assets/images/img/app-download/android.png',
      alt: 'Get it on Google Play',
    },
    {
      url: 'https://itunes.apple.com/us/app/ba-gps/id1466206178?ls=1&mt=8',
      image: 'assets/images/img/app-download/ios.png',
      alt: 'Download on the App Store',
    },
  ];

  constructor(
    private i18nService: TranslateService
  ) {}

}
