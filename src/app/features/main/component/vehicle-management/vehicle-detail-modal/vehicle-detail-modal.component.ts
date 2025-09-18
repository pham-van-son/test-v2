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

  // props
  @Input() showModal: boolean = false;
  @Input() images: any[] = [];
  @Input() selectedImageIndex: number = 0;
  @Input() selectedVehicle: any = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() goToPreviousImage = new EventEmitter<void>();
  @Output() goToNextImage = new EventEmitter<void>();

  private http = inject(HttpClient);

  autoPlay: boolean = false;
  autoPlayInterval: any;

  // constructor
  constructor() { }

  // ngOnInit
  ngOnInit() {

  }

  // ngOnChanges
  ngOnChanges(changes: SimpleChanges) {

  }

  // ngAfterViewInit
  ngAfterViewInit() {

  }

  // ngOnDestroy
  ngOnDestroy() {
    this.stopAutoPlay();
  }

  // public methods

  /**
   * Đóng modal và dừng auto-play
   */
  closeModalHandler() {
    this.closeModal.emit();
    this.stopAutoPlay();
  }

  /**
   * Chuyển đến ảnh trước đó
   */
  previousImage() {
    this.goToPreviousImage.emit();
  }

  /**
   * Chuyển đến ảnh tiếp theo
   */
  nextImage() {
    this.goToNextImage.emit();
  }

  /**
   * Bật/tắt chế độ tự động chuyển ảnh
   */
  toggleAutoPlay() {
    this.autoPlay = !this.autoPlay;

    if (this.autoPlay) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  }

  /**
   * Tải ảnh hiện tại về máy
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

  // private methods

  /**
   * Bắt đầu chế độ tự động chuyển ảnh
   */
  private startAutoPlay() {
    this.stopAutoPlay();
    this.autoPlayInterval = setInterval(() => {
      this.nextImage();
    }, 3000);
  }

  /**
   * Dừng chế độ tự động chuyển ảnh
   */
  private stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  /**
   * Bắt đầu auto-play nếu đã được kích hoạt
   */
  private startAutoPlayIfEnabled() {
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }
}