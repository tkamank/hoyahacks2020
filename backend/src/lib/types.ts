export interface User {
  id: string;
  email: string;
  verifiedDriver: boolean;
}

export interface RegisterAsNewDriverRequestBody {
  image?: string;
}

export interface GetLocationNameFromCoordinatesQuery {
  latitude?: string;
  longitude?: string;
}
