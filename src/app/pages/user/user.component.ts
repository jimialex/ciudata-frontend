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
import { AddRouteModalComponent } from './add-route-modal/add-route-modal.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
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
    MatTabsModule,
    MatListModule
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
    'email',
    'assigned_route',
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
    dialogRef.afterClosed().subscribe((result) => {
      //console.log(result);
      this.ngOnInit();
    });
  }

  onOpenDialogEdit(user: any) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.data = { type: 'edit', user };
    matDialogConfig.width = '500px';

    const dialogRef = this.dialog.open(UserMountComponent, matDialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      //console.log(result);
      this.ngOnInit();
    });
  }

  onOpenDialogAddRoute(user: any) {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.data = { type: 'new', user };
    matDialogConfig.width = '500px';

    const dialogRef = this.dialog.open(AddRouteModalComponent, matDialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      //console.log("result: ", result);
      this.ngOnInit();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
