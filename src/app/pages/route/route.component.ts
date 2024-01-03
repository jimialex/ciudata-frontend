import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { RouteService, DrawMapService } from '../../services';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { Coordinates, Route } from '../../interfaces/route';

@Component({
  selector: 'app-route',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatTableModule,
    MatInputModule,
    MatTabsModule,
  ],
  templateUrl: './route.component.html',
  styleUrl: './route.component.scss',
})
export class RouteComponent implements AfterViewInit {
  private routeService = inject(RouteService);
  displayedColumns: string[] = ['id', 'slug', 'name', 'area', 'actions'];
  dataSource: MatTableDataSource<Route> = new MatTableDataSource<Route>();
  private drawMapService = inject(DrawMapService);

  isEditMode = this.drawMapService.isEditableMode;

  @ViewChild('mapSection') mapSection!: ElementRef;

  public routesSignal = this.routeService.routesSignals;

  constructor() {
    this.routeService
      .getRoutes()
      .subscribe((response) => (this.dataSource.data = response));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    this.drawMapService.buildMap(this.mapSection.nativeElement).then();
  }

  openMap(route: any) {
    this.drawMapService.loadCoords(
      route.geo_route.map((route: { lat: number; lng: number }) => [
        route.lng,
        route.lat,
      ])
    );
  }

  onClickChangeMode() {
    this.drawMapService.changeMode();
  }
}
