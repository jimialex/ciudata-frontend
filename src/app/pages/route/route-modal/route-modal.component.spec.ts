import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteModalComponent } from './route-modal.component';

describe('RouteModalComponent', () => {
  let component: RouteModalComponent;
  let fixture: ComponentFixture<RouteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouteModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RouteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
