import { VentiqoBackendAPI } from "@/constants/ventiqo-backend-api";

// Interface for Subcategory
interface Subcategory {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  category: Partial<Category>; // Use Partial to prevent full Category object requirement
}
  
  // Interface for Category
  interface Category {
    _id: string;
    name: string;
    description: string;
    isActive: boolean;
    subcategories: Subcategory[]; // Define that categories have subcategories
  }
  

// Fetch categories with correct typing
export const fetchCategories = async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${VentiqoBackendAPI}/categories/all/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(
        "Response from fetchCategories: ",
        response
      )
  
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
  
      const data = await response.json();
  
      // Return categories with subcategories
      return data.paginatedCategories.data.map((category: Category) => ({
        _id: category._id,
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        subcategories: category.subcategories || [] // Ensure subcategories are present
      }));
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  };
  

// Fetch subcategories with correct typing
export const fetchSubcategories = async (): Promise<Subcategory[]> => {
  try {
    const response = await fetch(`${VentiqoBackendAPI}/subcategories/all/subcategories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch subcategories");
    }

    const data = await response.json();
    console.error("Fetching subcategories:", data.subCategories.data);
    return data.subCategories.data; // Correctly accessing subCategories
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    throw error;
  }
};

  
  
