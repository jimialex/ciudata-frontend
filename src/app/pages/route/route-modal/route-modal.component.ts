import { Component, Inject, inject } from '@angular/core';
import { DrawMapService } from '../../../services';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-route-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './route-modal.component.html',
  styleUrl: './route-modal.component.scss',
})
export class RouteModalComponent {
  drawMapService = inject(DrawMapService);

  RouteModalForm = new FormGroup({
    name: new FormControl('', Validators.required),
    area: new FormControl(0, Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<RouteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onSave() {
    console.log(this.RouteModalForm.valid);
    if (this.RouteModalForm.valid) {
      this.drawMapService
        .saveNewRoute(
          this.RouteModalForm.value.name!,
          this.RouteModalForm.value.area!
        )
        .subscribe((data) => {
          this.dialogRef.close();
        });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
