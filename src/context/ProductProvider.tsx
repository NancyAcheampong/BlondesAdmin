import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { Product } from "../types";

interface ProductProviderProps {
  children?: ReactNode;
}

export type ProductsContextType = {
  products: Product[];
  dispatch: React.Dispatch<AppAction>;
  addProduct: (newProduct: Product) => void;
  deleteProduct: (id: number) => void;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useProductsProvider = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

export type AppAction =
  | { type: "ADD_PRODUCT"; payload: Product }
  | { type: "DELETE_PRODUCT"; payload: number };

const PRODUCT_STORAGE_KEY = "productsReducer";

const saveProductsToLocalStorage = (products: Product[]): void => {
  try {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Error saving products to localStorage:", error);
  }
};

const loadProductsFromLocalStorage = (): Product[] => {
  try {
    const storedProducts = localStorage.getItem(PRODUCT_STORAGE_KEY);
    return storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error("Error loading products from localStorage:", error);
    return [];
  }
};

function productsReducer(state: Product[], action: AppAction): Product[] {
  switch (action.type) {
    case "ADD_PRODUCT":
      saveProductsToLocalStorage([...state, action.payload]);
      return [...state, action.payload];
    case "DELETE_PRODUCT":
      saveProductsToLocalStorage(
        state.filter((product) => product.id !== action.payload)
      );
      return state.filter((product) => product.id !== action.payload);
    default:
      return state;
  }
}

const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, dispatch] = useReducer(
    productsReducer,
    loadProductsFromLocalStorage()
  );

  const addProduct = (newProduct: Product) => {
    dispatch({ type: "ADD_PRODUCT", payload: newProduct });
  };

  const deleteProduct = (id: number) => {
    dispatch({ type: "DELETE_PRODUCT", payload: id });
  };

  return (
    <ProductsContext.Provider
      value={{ products, dispatch, addProduct, deleteProduct }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export default ProductProvider;
