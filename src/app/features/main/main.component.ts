import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Banner } from '../../core/interface/banner.interface';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  currentSlide = 0;
  autoSlideInterval: any;
  isHovered = false;

  newsItems: Banner[] = [
    {
      id: 1,
      title: 'GIẢI PHÁP ĐIỀU HÀNH VẬN TẢI',
      shortContents: 'Camera giám sát ghi hình trong xe ô tô của BA GPS mang đến nhiều lợi ích cho doanh nghiệp vận tải. An toàn trên mọi nẻo đường mang lại an tâm cho khách hàng khi sử dung sản phẩm. Chúng tôi cam kết rằng sẽ luôn chăm sóc phục vụ tân tình với khách hàng.',
      image: 'assets/images/img/banner/banner1.jpg',
      link: 'https://bagps.vn/tin-tuc-c10'
    },
    {
      id: 2,
      title: 'HỆ THỐNG QUẢN LÝ ĐỘI XE',
      shortContents: 'Giải pháp quản lý đội xe thông minh với công nghệ GPS tiên tiến, giúp tối ưu hóa chi phí vận tải.',
      image: 'assets/images/img/banner/banner2.jpg',
      link: 'https://bagps.vn/tin-tuc-c10'
    },
    {
      id: 3,
      title: 'CÔNG NGHỆ THEO DÕI THỜI GIAN THỰC',
      shortContents: 'Theo dõi vị trí xe và hành trình di chuyển theo thời gian thực với độ chính xác cao.',
      image: 'assets/images/img/banner/banner3.jpg',
      link: 'https://bagps.vn/tin-tuc-c10'
    },
    {
      id: 4,
      title: 'GIẢI PHÁP ĐIỀU HÀNH VẬN TẢI',
      shortContents: 'Camera giám sát ghi hình trong xe ô tô của BA GPS mang đến nhiều lợi ích cho doanh nghiệp vận tải. An toàn trên mọi nẻo đường mang lại an tâm cho khách hàng khi sử dung sản phẩm. Chúng tôi cam kết rằng sẽ luôn chăm sóc phục vụ tân tình với khách hàng.',
      image: 'assets/images/img/banner/banner1.jpg',
      link: 'https://bagps.vn/tin-tuc-c10'
    },
    {
      id: 5,
      title: 'HỆ THỐNG QUẢN LÝ ĐỘI XE',
      shortContents: 'Giải pháp quản lý đội xe thông minh với công nghệ GPS tiên tiến, giúp tối ưu hóa chi phí vận tải.',
      image: 'assets/images/img/banner/banner2.jpg',
      link: 'https://bagps.vn/tin-tuc-c10'
    },
    {
      id: 6,
      title: 'CÔNG NGHỆ THEO DÕI THỜI GIAN THỰC',
      shortContents: 'Theo dõi vị trí xe và hành trình di chuyển theo thời gian thực với độ chính xác cao.',
      image: 'assets/images/img/banner/banner3.jpg',
      link: 'https://bagps.vn/tin-tuc-c10'
    },
  ];

  displayNewsItems: Banner[] = [];

  defaultBanner: Banner = {
    id: 0,
    title: '',
    shortContents: '',
    image: 'assets/images/img/banner/banner1.jpg',
    link: ''
  };

  username = '';
  password = '';
  rememberMe = true;
  showPassword = false;

  usernameError = '';
  passwordError = '';
  loginError = '';

  constructor(
    private in18nService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.displayNewsItems = this.newsItems.slice(0, 5);
    this.checkAutoLogin();
    this.startAutoSlide();
  }

  get totalSlides(): number {
    return this.displayNewsItems.length;
  }

  nextSlide(): void {
    if (this.totalSlides > 1) {
      this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    }
  }

  prevSlide(): void {
    if (this.totalSlides > 1) {
      this.currentSlide = this.currentSlide === 0 ?
        this.totalSlides - 1 : this.currentSlide - 1;
    }
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  onSliderLeave(): void {
    if (!this.autoSlideInterval && this.totalSlides > 1) {
      this.startAutoSlide();
    }
  }

  shouldShowSlider(): boolean {
    return this.totalSlides > 1;
  }

  validateUsername(): boolean {
    this.usernameError = '';
    if (!this.username.trim()) {
      this.usernameError = this.in18nService.instant('MAIN.ERRORS.USERNAME_REQUIRED');
      return false;
    }
    if (this.username.length > 50) {
      this.usernameError = this.in18nService.instant('MAIN.ERRORS.USERNAME_MAX_LENGTH');
      return false;
    }
    if (!/^[a-zA-Z0-9]+$/.test(this.username)) {
      this.usernameError = this.in18nService.instant('MAIN.ERRORS.USERNAME_INVALID');
      return false;
    }
    return true;
  }

  validatePassword(): boolean {
    this.passwordError = '';
    if (!this.password.trim()) {
      this.passwordError = this.in18nService.instant('MAIN.ERRORS.PASSWORD_REQUIRED');
      return false;
    }
    if (this.password.length > 200) {
      this.passwordError = this.in18nService.instant('MAIN.ERRORS.PASSWORD_MAX_LENGTH');
      return false;
    }
    return true;
  }

  onLogin(): void {
    this.loginError = '';

    if (!this.validateUsername() || !this.validatePassword()) {
      return;
    }

    const serverAvailable = true;
  
    if (this.username === 'admin' && this.password === 'admin@123') {
      if (!serverAvailable) {
        this.loginError = this.in18nService.instant('MAIN.ERRORS.LOGIN_UNAVAILABLE');
        return;
      }
      this.handleSuccessfulLogin();
    } else {
      this.loginError = this.in18nService.instant('MAIN.ERRORS.LOGIN_INVALID');
    }
  }

  private stopAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  private startAutoSlide(): void {
    this.stopAutoSlide();

    if (this.totalSlides > 1) {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, 5000);
    }
  }

  private autoLogin(username: string): void {
    this.username = username;
    window.open('/user-management');
  }

  private checkAutoLogin(): void {
    const rememberMe = localStorage.getItem('rememberMe');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const savedUsername = localStorage.getItem('username');

    if (rememberMe === 'true' && isLoggedIn === 'true' && savedUsername) {
      this.autoLogin(savedUsername);
      return;
    }

    const sessionIsLoggedIn = sessionStorage.getItem('isLoggedIn');
    const sessionUsername = sessionStorage.getItem('username');

    if (sessionIsLoggedIn === 'true' && sessionUsername) {
      this.autoLogin(sessionUsername);
      return;
    }
  }

  private handleSuccessfulLogin(): void {
    if (this.rememberMe) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('username', this.username);
      localStorage.setItem('isLoggedIn', 'true');

      sessionStorage.removeItem('isLoggedIn');
      sessionStorage.removeItem('username');
    } else {
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', this.username);

      localStorage.removeItem('rememberMe');
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('username');
    }

    window.open('/user-management', '_blank');
  }
}
