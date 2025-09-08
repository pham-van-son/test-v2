declare var $: any;

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ElementRef, OnChanges, SimpleChanges, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-vehicle-detail-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './vehicle-detail-modal.component.html',
  styleUrls: ['./vehicle-detail-modal.component.scss']
})
export class VehicleDetailModalComponent implements OnInit, AfterViewInit, OnChanges {
  /**
   *@Input(): Khai báo truyền dữ liệu cha vào
   *@Output(): Khai báo gửi sự kiện ngược lại cho component cha
   *@ViewChild(): Trỏ vào DOM để sử lý carousel
   */
  @Input() showModal: boolean = false;
  @Input() images: any[] = [];
  @Input() selectedImageIndex: number = 0;
  @Input() selectedVehicle: any = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() goToPreviousImage = new EventEmitter<void>();
  @Output() goToNextImage = new EventEmitter<void>();

  @ViewChild('imageCarousel') carousel!: ElementRef;

  private http = inject(HttpClient);

  autoPlay: boolean = false;
  autoPlayInterval: any;

  ngOnInit() {
    this.startAutoPlayIfEnabled();
  }

  /**
   * nếu autoPlay đang bật thì chạy ngay.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['images'] || changes['selectedImageIndex']) {
      setTimeout(() => {
        this.initializeCarousel();
      }, 0);
    }
  }
  
  /**
   * Thay đổi danh sách ảnh thì khởi tạo lại carousel
   */
  ngAfterViewInit() {
    this.initializeCarousel();
  }

  closeModalHandler() {
    this.closeModal.emit();
    this.stopAutoPlay();
  }

  previousImage() {
    this.goToPreviousImage.emit();
  }

  nextImage() {
    this.goToNextImage.emit();
  }

  /**
   * Tự động chạy carousel
   */
  toggleAutoPlay() {
    this.autoPlay = !this.autoPlay;
    const $carousel = $(this.carousel.nativeElement);
  
    if (this.autoPlay) {
      $carousel.carousel('cycle');
    } else {
      $carousel.carousel('pause');
    }
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextImage();
    }, 3000);
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  startAutoPlayIfEnabled() {
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  /**
   * Tải ảnh về máy
   */
  downloadImage() {
    const imageUrl = this.images[this.selectedImageIndex]?.u || 'https://via.placeholder.com/800x600';

    this.http.get(imageUrl, { responseType: 'blob' }).subscribe(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `image_${this.selectedImageIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    });
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  /**
   * Cấu hình carousel
   */
  private initializeCarousel() {
    if (this.carousel && this.images.length > 0) {
      const $carousel = $(this.carousel.nativeElement);
      $carousel.carousel('pause');
  
      $carousel.carousel({
        interval: this.autoPlay ? 3000 : false
      });
  
      $carousel.carousel(this.selectedImageIndex);
  
      if (this.autoPlay) {
        $carousel.carousel('cycle');
      }
    }
  }
}