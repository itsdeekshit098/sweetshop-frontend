export interface SweetDto {
  id?: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface PurchaseRequest {
  quantity: number;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}
