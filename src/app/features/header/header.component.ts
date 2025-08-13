import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  currentLanguage: string = 'vi';
  isMenuOpen: boolean = false;
  isLangMenuOpen: boolean = false;

  menuItems = [
    { name: 'HEADER.MENU.HOME', url: 'https://bagps.vn/' },
    { name: 'HEADER.MENU.PRODUCTS', url: 'https://bagps.vn/san-pham-va-giai-phap' },
    { name: 'HEADER.MENU.NEWS', url: 'https://bagps.vn/tin-tuc-c10' },
    { name: 'HEADER.MENU.PAYMENT', url: 'https://bagps.vn/huong-dan-dong-phi-dich-vu-ba-gps-d610' },
    { name: 'HEADER.MENU.GUIDE', url: 'https://badoc.bagroup.vn/x/SAGhBg' },
    { name: 'HEADER.MENU.NETWORK', url: 'https://bagps.vn/mang-luoi' },
    { name: 'HEADER.MENU.ABOUT', url: 'https://bagps.vn/gioi-thieu/' }
  ];

  languages = [
    { code: 'vi', name: 'HEADER.LANGUAGES.VI', flag: 'assets/images/img/vi.png' },
    { code: 'en', name: 'HEADER.LANGUAGES.EN', flag: 'assets/images/img/us.png' }
  ];

  constructor(
    private i18nService: TranslateService,
  ) {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
      this.currentLanguage = savedLang;
      this.i18nService.use(savedLang);
    } else {
      this.i18nService.use(this.currentLanguage);
    }
  }

  getCurrentLanguage() {
    return this.languages.find((lang) => lang.code === this.currentLanguage) || this.languages[0]
  }

  changeLanguage(langCode: string) {
    this.currentLanguage = langCode;
    localStorage.setItem('selectedLanguage', langCode);
    this.i18nService.use(langCode);
  }

  toggleLangMenu() {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
