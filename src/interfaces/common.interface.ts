
export interface TableProps {
  data: Array<{ [key: string]: string | number }>; 
  columns: Array<{ key: string; header: string }>; 
  className?: string;
  searchPlaceholder?: string; 
  itemsPerPage?: number;
}
export interface Counts { customers: number; products: number; suppliers: number; orders: number }
export interface Supplier {
  name: string;
  email: string;
  contact_email?: string;
  contact_phone?: string;
  location?: string;

  address: string;
  phone: string;
  }
  export interface Order {
    id: number;
    date: string;
    status: string;
    total: string;
  }
  export interface Customer {
    name: string;
    email: string;
    address: string;
    phone: string;
  }
  export interface Product {
    name: string;
    price: number;
    dimensions: string;
    weight: string;
  }

  export interface History {
    id: number;
    sender: string;
    message: string;
    timestamp: string;
    subject: string;
  }
  
  export interface Draft {
    subject: string;
    to: string
    cc: string;
    messageContext: string;
  }
  
  export interface Email {
    id: string;
    sender: string;
    subject: string;
    timestamp: string;
    receiver: string;
    message: string;
    to?: string;
    logs?: [string];
    history?: History[];  // Optional conversation history
    draft?: Draft;        // Optional draft details
  }
  
  
  // interfaces/common.interface.ts
export interface EmailDraft {
  id: number;
  recipients: string[];
  cc?: string[];
  subject: string;
  message: string;
  timestamp: string;
  status: string;
  history?: EmailHistory[];
}

export interface EmailHistory {
  id: number;
  recipients: string[];
  subject: string;
  message: string;
  timestamp: string;
  status: string;
}
  

