export interface User {
  id: string;
  email: string;
  verifiedDriver: boolean;
}

export interface RegisterAsNewDriverRequestBody {
  image?: string;
}
