export interface PortfolioItem {
  id: string;
  title: string;
  category: "branding" | "print" | "merchandise" | "signage" | "apparel";
  description: string;
  imageUrl: string;
  featured: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  rating: number;
  message: string;
  avatarUrl?: string;
  approved: boolean;
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  details: string;
  budget: string;
  deadline: string;
  status: "new" | "reviewed" | "quoted";
  createdAt: string;
}

export interface Order {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  quantity: number;
  specifications: string;
  deliveryAddress: string;
  total: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  createdAt: string;
}

export type ServiceCategory =
  | "Business Cards"
  | "Banners & Flex"
  | "Branded Merchandise"
  | "Packaging"
  | "Signage"
  | "Apparel Printing"
  | "Logo & Brand Design"
  | "Flyers & Brochures";
