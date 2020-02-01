export interface Location {
  latitude: number;
  longitude: number;
  title: string;
}

export interface User {
  id: string;
  email: string;
  verifiedDriver: boolean;
}
