import { Component, Inject, OnInit, Signal, computed, inject, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AssignedRouteService, RouteService } from '../../../services';
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
import { AssignedRoute, Route } from '../../../interfaces';

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
  private routeService = inject(RouteService);
  routes: Signal<Route[]> = computed(() => this.routeService.routesSignals());
  userId: any;
  assignedRouteService = inject(AssignedRouteService);
  route: Signal<AssignedRoute[]> = computed(() => this.assignedRouteService.assignedRouteSignal());
  hide = true;
  assignedRouteForm: FormGroup;

  title!: string;
  constructor(
    public dialogRef: MatDialogRef<AddRouteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = this.data.type == 'new' ? 'Asignar ruta' : 'Editar asignacion';
    this.assignedRouteService.getAssignedRoutes().subscribe();
    const user = this.data.user;
    const userFullName = user.first_name + " " + user.last_name || user.username;
    this.userId = user.id;
    this.assignedRouteForm = new FormGroup({
      user: new FormControl(userFullName),
      route: new FormControl('', Validators.required),
      assigned_detail: new FormControl(''),
    });
    this.routeService.getRoutesUnassigned().subscribe();
  }

  ngOnInit(): void { }
  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.assignedRouteForm.value.user = this.userId;
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
