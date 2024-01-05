import { Component, Inject, Signal, computed, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
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
export class UserMountComponent {
  userService = inject(UserService);
  groupService = inject(GroupService);
  groups: Signal<Group[]> = computed(() => this.groupService.groups());
  hide = true;
  userData: any;
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
    this.userData = this.data.user;

    if (this.data.type != 'new') {
      this.userForm = new FormGroup({
        username: new FormControl(this.userData.username, Validators.required),
        email: new FormControl(this.userData.email, Validators.required),
        first_name: new FormControl(this.userData.first_name),
        last_name: new FormControl(this.userData.last_name),
        password: new FormControl(''),
        groups: new FormControl(this.userData.groups[0].id, Validators.required),
      });
    }

  }
  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (this.data.type == 'new') {  // for  create new user
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
    else {
      if (this.userForm.valid) {  // for edit user exists
        this.userService.putUser(this.userForm.value as User, this.userData.username).subscribe({
          next: (data) => {
            console.log("RESPONSE", data); this.dialogRef.close();
            // TODO: despues de esto se debe actualizar la lista de usuarios
          },
          error: (error) => console.log(error),
        });
      }
    }
  }
}
