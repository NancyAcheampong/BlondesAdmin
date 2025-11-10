import { createContext, useContext, useReducer, type ReactNode } from "react";
import type { Products } from "../pages/productsForm/ProductForm";

// import { useNavigate } from "react-router-dom";
interface ProductProviderProps {
  children?: ReactNode;
}

export type ProductsContextType = {
  credentials?: null;
  profileImageUrl?: string;
  task: Products[];
  dispatch: React.Dispatch<AppAction>;
  addProduct: (newProducts: Products) => void;
  deleteProduct: (id: number) => void;
};

const ProductsContext = createContext<ProductsContextType | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useProductsProvider = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within an ProductsProvider");
  }
  return context;
};

export type AppAction =
  | { type: "ADD_PRODUCT"; payload: Products }
  | { type: "DELETE_PRODUCT"; payload: number };

const PRODUCT_STORAGE_KEY = "productsReducer";

const saveProductsToLocalStorage = (products: Products[]): void => {
  try {
    localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
  } catch (error) {
    console.error("Error saving products to localStorage:", error);
  }
};

const loadProductsFromLocalStorage = (): Products[] => {
  try {
    const storedProducts = localStorage.getItem(PRODUCT_STORAGE_KEY);
    return storedProducts ? JSON.parse(storedProducts) : [];
  } catch (error) {
    console.error("Error loading Products from localStorage:", error);
    return [];
  }
};

function productsReducer(state: Products[], action: AppAction): Products[] {
  switch (action.type) {
    case "ADD_PRODUCT":
      saveProductsToLocalStorage([...state, action.payload]);
      return [...state, action.payload];
    case "DELETE_PRODUCT":
      saveProductsToLocalStorage(
        state.filter((products) => products.id !== action.payload)
      );
      return state.filter((products) => products.id !== action.payload);
    default:
      return state;
  }
}

const ProductProvider = ({ children }: ProductProviderProps) => {
  const [task, dispatch] = useReducer(
    productsReducer,
    loadProductsFromLocalStorage()
  );

  const addProduct = (newProduct: Products) => {
    dispatch({ type: "ADD_PRODUCT", payload: newProduct });
  };

  const deleteProduct = (id: number) => {
    dispatch({ type: "DELETE_PRODUCT", payload: id });
  };

  return (
    <>
      <ProductsContext.Provider value={{ task, dispatch, addProduct, deleteProduct }}>
        {children}
      </ProductsContext.Provider>
    </>
  );
};

export default ProductProvider;