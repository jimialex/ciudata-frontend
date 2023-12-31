import { Component, Inject, OnInit, Signal, computed, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UserService, GroupService } from '../../../services';
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
import { User, Group } from '../../../interfaces';

@Component({
  selector: 'app-user-mount',
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
  templateUrl: './user-mount.component.html',
  styleUrl: './user-mount.component.scss',
})
export class UserMountComponent implements OnInit {
  userService = inject(UserService);
  groupService = inject(GroupService);
  groups: Signal<Group[]> = computed(() => this.groupService.groups());
  hide = true;
  userForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    first_name: new FormControl(''),
    last_name: new FormControl(''),
    password: new FormControl(''),
    groups: new FormControl('', Validators.required),
  });

  title!: string;
  constructor(
    public dialogRef: MatDialogRef<UserMountComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.title = this.data.type == 'new' ? 'Nuevo usuario' : 'Editar usuario';
    this.groupService.getGroups().subscribe();

  }
  ngOnInit(): void { }
  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.userForm.valid) {
      this.userService.postUser(this.userForm.value as User).subscribe({
        next: (data) => {
          console.log(data); this.dialogRef.close();
          // TODO: despues de esto se debe actualizar la lista de usuarios
        },
        error: (error) => console.log(error),
      });
    }
  }
}
