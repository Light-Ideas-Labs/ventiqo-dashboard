import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-client";

interface Subcategory {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  category: Partial<Category>;
}

interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  subcategories: Subcategory[];
}

// ── Query keys ──────────────────────────────────────────────────────────
export const categoryKeys = {
  all: ["categories"] as const,
  subcategories: ["subcategories"] as const,
};

// ── Fetchers ────────────────────────────────────────────────────────────
export const fetchCategories = async (): Promise<Category[]> => {
  const data = await apiFetch<any>("/categories/all/categories", { auth: false });

  return data.paginatedCategories.data.map((category: Category) => ({
    _id: category._id,
    name: category.name,
    description: category.description,
    isActive: category.isActive,
    subcategories: category.subcategories || [],
  }));
};

export const fetchSubcategories = async (): Promise<Subcategory[]> => {
  const data = await apiFetch<any>("/subcategories/all/subcategories", { auth: false });
  return data.subCategories;
};

// ── Query hooks ─────────────────────────────────────────────────────────
export const useCategories = () =>
  useQuery({ queryKey: categoryKeys.all, queryFn: fetchCategories });

export const useSubcategories = () =>
  useQuery({ queryKey: categoryKeys.subcategories, queryFn: fetchSubcategories });
