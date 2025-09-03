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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['images'] || changes['selectedImageIndex']) {
      setTimeout(() => {
        this.initializeCarousel();
      }, 0);
    }
  }
  
  ngAfterViewInit() {
    this.initializeCarousel();
  }

  private initializeCarousel() {
    if (this.carousel && this.images.length > 0) {
      // Đảm bảo jQuery đã được tải trước
      const $carousel = $(this.carousel.nativeElement);
  
      // Dừng mọi animation hiện tại để tránh xung đột
      $carousel.carousel('pause');
  
      // Gán lại index và interval cho carousel
      // Đây là bước quan trọng để cập nhật trạng thái
      $carousel.carousel({
        interval: this.autoPlay ? 3000 : false
      });
  
      // Chuyển đến slide hiện tại một cách rõ ràng
      $carousel.carousel(this.selectedImageIndex);
  
      // Bắt đầu chế độ cycle nếu autoPlay được bật
      if (this.autoPlay) {
        $carousel.carousel('cycle');
      }
    }
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

  toggleAutoPlay() {
    this.autoPlay = !this.autoPlay;
    const $carousel = $(this.carousel.nativeElement);
  
    if (this.autoPlay) {
      // Bật tự động chạy
      $carousel.carousel('cycle');
    } else {
      // Tắt tự động chạy
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

  downloadImage() {
    const imageUrl = this.images[this.selectedImageIndex]?.u || 'https://via.placeholder.com/800x600';

    this.http.get(imageUrl, { responseType: 'blob' }).subscribe(blob => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `image_${this.selectedImageIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Giải phóng tài nguyên sau khi tải xong
    });
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }
}