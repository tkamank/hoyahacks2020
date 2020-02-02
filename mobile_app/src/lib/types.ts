export interface User {
  id: string;
  email: string;
  verifiedDriver: boolean;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Location {
  id: string;
  latitude: string;
  longitude: string;
  owner: string;
  formatted_address: string;
}

export interface LocationWithDistance {
  distance?: number;
  location: Location;
}