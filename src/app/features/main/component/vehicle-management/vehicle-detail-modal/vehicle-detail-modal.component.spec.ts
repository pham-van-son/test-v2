import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VehicleDetailModalComponent } from './vehicle-detail-modal.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

describe('VehicleDetailModalComponent', () => {
  let component: VehicleDetailModalComponent;
  let fixture: ComponentFixture<VehicleDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        VehicleDetailModalComponent,
        CommonModule,
        TranslateModule.forRoot()
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VehicleDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
