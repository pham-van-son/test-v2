import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
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
  @Input() isLoggedIn = false;
  @Output() logOutClick = new EventEmitter<void>();

  currentLanguage: string = 'vi';
  isMenuOpen: boolean = false;
  isLangMenuOpen: boolean = false;

  publicMenuItems = [
    { name: 'HEADER.MENU_PUBLIC.HOME', url: 'https://bagps.vn/' },
    { name: 'HEADER.MENU_PUBLIC.PRODUCTS', url: 'https://bagps.vn/san-pham-va-giai-phap' },
    { name: 'HEADER.MENU_PUBLIC.NEWS', url: 'https://bagps.vn/tin-tuc-c10' },
    { name: 'HEADER.MENU_PUBLIC.PAYMENT', url: 'https://bagps.vn/huong-dan-dong-phi-dich-vu-ba-gps-d610' },
    { name: 'HEADER.MENU_PUBLIC.GUIDE', url: 'https://badoc.bagroup.vn/x/SAGhBg' },
    { name: 'HEADER.MENU_PUBLIC.NETWORK', url: 'https://bagps.vn/mang-luoi' },
    { name: 'HEADER.MENU_PUBLIC.ABOUT', url: 'https://bagps.vn/gioi-thieu/' }
  ];

  privateMenuItem = [
    { name: 'HEADER.MENU_PRIVATE.DASHBOARD', url: '/dashboard' },
    { name: 'HEADER.MENU_PRIVATE.USER', url: '/user-management' },
    { name: 'HEADER.MENU_PRIVATE.NOTI', url: '/vehicle-management' },
    { name: 'HEADER.MENU_PRIVATE.VEHICLE', url: '/vehicle-management' }
  ];

  languages = [
    { code: 'vi', name: 'HEADER.LANGUAGES.VI', flag: 'assets/images/img/vi.png' },
    { code: 'en', name: 'HEADER.LANGUAGES.EN', flag: 'assets/images/img/us.png' }
  ];

  constructor(
    private i18nService: TranslateService,
    private router: Router,
  ) {
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
      this.currentLanguage = savedLang;
      this.i18nService.use(savedLang);
    } else {
      this.i18nService.use(this.currentLanguage);
    }
  }

  get menuItems() {
    return this.isLoggedIn ? this.privateMenuItem : this.publicMenuItems;
  }

  getCurrentLanguage() {
    return this.languages.find((lang) => lang.code === this.currentLanguage) || this.languages[0]
  }

  changeLanguage(langCode: string) {
    this.currentLanguage = langCode;
    localStorage.setItem('selectedLanguage', langCode);
    this.i18nService.use(langCode);

    this.isLangMenuOpen = false;
  }

  toggleLangMenu() {
    this.isLangMenuOpen = !this.isLangMenuOpen;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  logout() {
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('username');
    localStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('isLoggedIn');

    this.logOutClick.emit();
    this.router.navigate(['/']);
  }
}
