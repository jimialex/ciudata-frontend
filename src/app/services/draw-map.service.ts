import { HttpClient } from '@angular/common/http';
import {
  Inject,
  Injectable,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { ConfigService } from './config.service';
import { enviroment } from '../../assets/config/config';
import { JwtService } from './jwt.service';
import { Geometry } from 'geojson';
import { map, of, tap } from 'rxjs';
import { RouteService } from './route.service';

@Injectable({
  providedIn: 'root',
})
export class DrawMapService {
  map!: Map;
  isEditableMode: WritableSignal<boolean> = signal(false);
  coordsSaved: WritableSignal<LngLatLike[]> = signal([]);
  distanceSaved: WritableSignal<number> = signal(0);

  draw: MapboxDraw;

  mark1?: Marker;
  mark2?: Marker;

  popupIni?: Popup;
  popupFin?: Popup;

  httpClient = inject(HttpClient);
  configService = inject(ConfigService);
  jwtService = inject(JwtService);
  routeService = inject(RouteService);

  constructor() {
    this.draw = new MapboxDraw({
      // Instead of showing all the draw tools, show only the line string and delete tools.
      displayControlsDefault: false,
      controls: {
        line_string: true,

        trash: true,
      },
      // Set the draw mode to draw LineStrings by default.
      defaultMode: 'draw_line_string',
      styles: [
        // Set the line style for the user-input coordinates.
        {
          id: 'gl-draw-line',
          type: 'line',
          filter: [
            'all',
            ['==', '$type', 'LineString'],
            ['!=', 'mode', 'static'],
          ],
          layout: {
            'line-cap': 'round',
            'line-join': 'round',
          },
          paint: {
            'line-color': '#438EE4',
            'line-dasharray': [0.2, 2],
            'line-width': 4,
            'line-opacity': 0.7,
          },
        },
        // Style the vertex point halos.
        {
          id: 'gl-draw-polygon-and-line-vertex-halo-active',
          type: 'circle',
          filter: [
            'all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static'],
          ],
          paint: {
            'circle-radius': 12,
            'circle-color': '#FFF',
          },
        },
        // Style the vertex points.
        {
          id: 'gl-draw-polygon-and-line-vertex-active',
          type: 'circle',
          filter: [
            'all',
            ['==', 'meta', 'vertex'],
            ['==', '$type', 'Point'],
            ['!=', 'mode', 'static'],
          ],
          paint: {
            'circle-radius': 8,
            'circle-color': '#438EE4',
          },
        },
      ],
    });
  }

  buildMap(element: any) {
    return new Promise((resolve, reject) => {
      try {
        this.map = new Map({
          container: element,
          style: 'mapbox://styles/mapbox/streets-v12', // style URL
          center: [-68.12460801485163, -16.499381437724754], // starting position [lng, lat]
          zoom: 9, // starting zoom
        });
        resolve(this.map);
      } catch (error) {
        reject(error);
      }
    });
  }

  loadCoords(coords: LngLatLike[]): void {
    this.map.fitBounds([coords[0], coords[coords.length - 1]], {
      padding: 100,
    });

    // Check if the source existsout
    if (this.map.getSource('route')) {
      this.remove();
    }

    this.mark1 = new Marker({ color: 'red' })
      .setLngLat(coords[0])
      .addTo(this.map);
    this.popupIni = new Popup({ closeOnClick: false })
      .setLngLat(coords[0])
      .setHTML('<h3>Incio de ruta</h3>')
      .addTo(this.map);

    this.mark2 = new Marker({ color: 'green' })
      .setLngLat(coords[coords.length - 1])
      .addTo(this.map);
    this.popupFin = new Popup({ closeOnClick: false })
      .setLngLat(coords[coords.length - 1])
      .setHTML('<h3>Fin de la Ruta</h3>')
      .addTo(this.map);

    this.map.addSource('route', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coords as any,
        },
      },
    });
    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#438EE4',
        'line-dasharray': [0.2, 2],
        'line-width': 4,
        'line-opacity': 0.8,
      },
    });
  }

  changeMode(): void {
    if (!this.isEditableMode()) {
      // Check if the source exists
      if (this.map.getSource('route')) {
        this.remove();
      }
      this.map.addControl(this.draw);
      this.map.on('draw.create', (event) => {
        const coords: LngLatLike[] = event.features[0].geometry
          .coordinates as LngLatLike[];
        this.getMatch(coords);
      });
      this.map.on('draw.delete', (event) => {
        this.remove();
        this.coordsSaved.set([]);
      });
    } else {
      this.map.removeControl(this.draw);
    }
    this.isEditableMode.update((value: boolean) => !value);
  }

  private remove(): void {
    this.map.removeLayer('route');
    this.map.removeSource('route');
    this.mark1?.remove();
    this.mark2?.remove();
    this.popupIni?.remove();
    this.popupFin?.remove();
  }

  getMatch(coords: LngLatLike[]) {
    const profile = 'driving';
    const newCoords = coords.join(';');
    const radius = coords.map(() => 25).join(';');

    const url = [
      `https://api.mapbox.com/matching/v5/mapbox/${profile}/${newCoords}`,
      `?geometries=geojson&radiuses=${radius}&steps=true`,
      `&access_token=${enviroment.mapBoxKey}`,
    ].join('');
    this.httpClient.get(url).subscribe((response: any) => {
      const geometry = response.matchings[0].geometry;
      this.coordsSaved.set(
        geometry.coordinates.map((d: any) => {
          return { lng: d[0], lat: d[1] };
        })
      );
      this.addRoute(geometry);
      this.distanceSaved.set(response.matchings[0].distance);
    });
  }

  addRoute(geometry: Geometry) {
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }

    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: geometry,
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#03AA46',
        'line-width': 8,
        'line-opacity': 0.8,
      },
    });
  }

  saveNewRoute(name: string, area: number) {
    const url = `${this.configService.getApiUrl()}/routes/`;
    return this.httpClient
      .post(
        url,
        {
          name,
          area,
          metadata: { distance: this.distanceSaved() },
          geo_route: this.coordsSaved(),
        },
        {
          headers: {
            Authorization: `Bearer ${this.jwtService.getAccessToken()}`,
          },
        }
      )
      .pipe(
        tap((response: any) => {
          return this.routeService.addRouteSignals({
            id: response.id,
            name: response.name,
            slug: response.slug,
            area: {
              id: 1,
              name: 'Area 1',
              slug: '',
              geofence: null,
            },
            geo_route: response.geo_route,
          });
        })
      );
  }
}
