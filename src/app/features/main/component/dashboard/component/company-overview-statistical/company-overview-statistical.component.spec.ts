import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyOverviewStatisticalComponent } from './company-overview-statistical.component';

describe('CompanyOverviewStatisticalComponent', () => {
  let component: CompanyOverviewStatisticalComponent;
  let fixture: ComponentFixture<CompanyOverviewStatisticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyOverviewStatisticalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyOverviewStatisticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
