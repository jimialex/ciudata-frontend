import { Component, OnInit, Signal, computed, inject } from '@angular/core';
import { VehicleService } from '../../services';
import { Vehicle } from '../../interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { VehicleModalComponent } from './vehicle-modal/vehicle-modal.component';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatTooltipModule,
    MatTableModule,
    MatTabsModule,
  ],
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
})
export class VehicleComponent {
  private vehicleService = inject(VehicleService);
  displayedColumns: string[] = ['id', 'slug', 'plate', 'brand', 'actions'];
  dataSource: MatTableDataSource<Vehicle> = new MatTableDataSource<Vehicle>();
  vehiclesSignals = this.vehicleService.vehicleSignal;

  constructor(public dialog: MatDialog) {
    this.vehicleService
      .getVehicles()
      .subscribe((response) => this.dataSource.data = response);
    this.dataSource = new MatTableDataSource<Vehicle>();

  }

  onOpenDialog() {
    const matDialogConfig = new MatDialogConfig();
    matDialogConfig.data = { type: 'new' };
    matDialogConfig.width = '500px';

    const dialogRef = this.dialog.open(VehicleModalComponent, matDialogConfig);
    dialogRef.afterClosed().subscribe((result) => console.log(result));

    //throw new Error('Method not implemented.');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
