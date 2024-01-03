import { Component, Inject, OnInit, Signal, computed, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { VehicleService } from '../../../services';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Vehicle } from '../../../interfaces';

@Component({
  selector: 'app-vechicle-modal',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './vehicle-modal.component.html',
  styleUrl: './vehicle-modal.component.scss',
})
export class VehicleModalComponent implements OnInit {
  vehicleService = inject(VehicleService);
  hide = true;
  vehicleForm = new FormGroup({
    plate: new FormControl('bnm789', Validators.required),
    brand: new FormControl('Nissan', Validators.required),
    model: new FormControl('2000'),
    detail: new FormControl('Es color rojo'),
  });

  title!: string;
  constructor(
    public dialogRef: MatDialogRef<VehicleModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = this.data.type == 'new' ? 'Nuevo usuario' : 'Editar usuario';

  }
  ngOnInit(): void { }
  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.vehicleForm.valid) {
      this.vehicleService.postVehicle(this.vehicleForm.value as Vehicle).subscribe({
        next: (data) => {
          console.log(data); this.dialogRef.close();
          // TODO: despues de esto se debe actualizar la lista de usuarios
        },
        error: (error) => console.log(error),
      });
    }
  }
}
