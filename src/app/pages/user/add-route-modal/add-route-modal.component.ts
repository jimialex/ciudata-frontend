import { Component, Inject, OnInit, Signal, computed, inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AssignedRouteService } from '../../../services';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
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
import { AssignedRoute } from '../../../interfaces';

@Component({
  selector: 'app-user-add-route',
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
    TextFieldModule,
  ],
  templateUrl: './add-route-modal.component.html',
  styleUrl: './add-route-modal.component.scss',
})
export class AddRouteModalComponent implements OnInit {
  assignedRouteService = inject(AssignedRouteService);
  route: Signal<AssignedRoute[]> = computed(() => this.assignedRouteService.assignedRouteSignal());
  hide = true;

  assignedRouteForm = new FormGroup({
    user: new FormControl('', Validators.required),
    route: new FormControl('', Validators.required),
    assigned_detail: new FormControl(''),
  });

  title!: string;
  constructor(
    public dialogRef: MatDialogRef<AddRouteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = this.data.type == 'new' ? 'Asignar ruta' : 'Editar asignacion';
    this.assignedRouteService.getAssignedRoutes().subscribe();

  }
  ngOnInit(): void { }
  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.assignedRouteForm.valid) {
      this.assignedRouteService.postAssignedRoute(this.assignedRouteForm.value as AssignedRoute).subscribe({
        next: (data) => {
          console.log(data); this.dialogRef.close();
          // TODO: despues de esto se debe actualizar la lista de usuarios
        },
        error: (error) => console.log(error),
      });
    }
  }
}
