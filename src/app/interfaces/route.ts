export interface Route {
  id: number;
  slug: string;
  name: string;
  area: Area;
  geo_route: Coordinates[];
}

export interface Area {
  id: number;
  slug: string;
  name: string;
  geofence: Coordinates;
}

export interface Coordinates {
  lat: number;
  lng: number;
}
