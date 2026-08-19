export interface Item {
  id: string;
  nome: string;
  preco: string;
  validade: string;
}

export interface ItemUpdate {
  nome?: string;
  preco?: string;
  validade?: string;
}

export interface Items {
  nome: string;
  preco: string;
  validade: string;
}
