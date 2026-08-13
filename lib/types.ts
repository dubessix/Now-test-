export type TaxSplit = "cgst-sgst" | "igst";

export type LineItem = {
  id: string;
  name: string;
  hsn: string;
  qty: number;
  rate: number;
};

export type Party = {
  name: string;
  gstin: string;
  phone: string;
  address: string;
  state: string;
};

export type Seller = Party & {
  email: string;
  upi: string;
};

export type Invoice = {
  number: string;
  date: string;
  placeOfSupply: string;
  taxRate: number;
  taxSplit: TaxSplit;
  notes: string;
  seller: Seller;
  buyer: Party;
  items: LineItem[];
};

export type Money = {
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
};
