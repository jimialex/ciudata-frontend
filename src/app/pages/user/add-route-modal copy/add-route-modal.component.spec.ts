import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMountComponent } from './add-route-modal.component';

describe('UserMountComponent', () => {
  let component: UserMountComponent;
  let fixture: ComponentFixture<UserMountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMountComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UserMountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
