import { Component, Signal, computed, inject, OnInit, } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UserMountComponent } from './user-mount/user-mount.component';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../services';
import { User } from '../../interfaces';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    MatTabsModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit {
  userService = inject(UserService);
  users = this.userService.users;
  displayedColumns: string[] = [
    'id',
    'first_name',
    'last_name',
    'username',
    'email',
    'actions',
  ];
  dataSource: MatTableDataSource<User>;

  constructor(public dialog: MatDialog) {
    this.userService.getUsers().subscribe();
    this.dataSource = new MatTableDataSource<User>();
  }

  ngOnInit() {
    this.userService.getUsers().subscribe((users) => {
      this.dataSource.data = users.results; // Assign users to dataSource
    });
  }

  onOpenDialog() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.data = { type: 'new' };
    matDialogConfig.width = '500px';

    const dialogRef = this.dialog.open(UserMountComponent, matDialogConfig);
    dialogRef.afterClosed().subscribe((result) => console.log(result));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
