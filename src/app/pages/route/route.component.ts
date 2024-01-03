import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  inject,
} from '@angular/core';
import { RouteService, DrawMapService } from '../../services';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Route } from '../../interfaces/route';

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
  @ViewChild(MatAccordion) accordionSection!: MatAccordion;

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

  openMap(route: Route) {
    if (this.isEditMode()) {
      this.drawMapService.changeMode();
    }
    this.drawMapService.loadCoords(
      route.geo_route.map((route: any) => [route.lng, route.lat])
    );
  }

  onClickChangeMode() {
    if (!this.isEditMode()) {
      this.accordionSection.closeAll();
    }
    this.drawMapService.changeMode();
  }
}
