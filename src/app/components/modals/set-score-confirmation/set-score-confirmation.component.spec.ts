import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetScoreConfirmationComponent } from './set-score-confirmation.component';

describe('SetScoreConfirmationComponent', () => {
  let component: SetScoreConfirmationComponent;
  let fixture: ComponentFixture<SetScoreConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetScoreConfirmationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SetScoreConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
