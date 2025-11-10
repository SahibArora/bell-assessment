export interface CartItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
}
  
export interface CartContext {
  id: string;
  items: CartItem[];
  expiresAt: number;
}

export interface SalesforceCartContext {
  id: string;
  expiresAt: number;
  data: any;
}
  