export interface User {
  id: string;
  email: string;
  verifiedDriver: boolean;
}

export interface Location {
  id: string;
  latitude: string;
  longitude: string;
  owner: string;
  formatted_address: string;
}