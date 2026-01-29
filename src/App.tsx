import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/loginPage/LoginPage";
import ProductList from "./pages/productList/ProductList";
import ProductForm from "./pages/productsForm/ProductForm";
import ProtectedRoute from "./pages/protectedRoute/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/products" element={<ProductList />} />
        <Route path="/form" element={<ProductForm />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="*" element={<Navigate to="/products" replace />} />
    </Routes>
  );
}

export default App;
