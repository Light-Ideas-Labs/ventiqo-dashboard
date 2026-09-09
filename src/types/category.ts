export interface Subcategory {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  category: Partial<Category>;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  subcategories: Subcategory[];
}

export interface CategoryResponse {
  success: boolean;
  message?: string;
  data?: Category[];
}
