export interface Location {
  latitude: number;
  longitude: number;
  distanceFromUser: number | null;
  title: string;
}

export interface User {
  id: string;
  email: string;
  verifiedDriver: boolean;
}
