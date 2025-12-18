// import { useState } from 'react'

import LoginPage from "./pages/loginPage/LoginPage";
import ProducList from "./pages/productList/ProductList";
import ProductForm from "./pages/productsForm/ProductForm";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./pages/protectedRoute/ProtectedRoute";

// const productsList = [
//   {
//     id: 20,
//     productName: "Leave In Conditioner",
//     price: 20,
//     image: "leaveIn.png",
//     productSize: "large",
//     productColor: "black",
//     inStock: true,
//     isLiked: false,
//   },
// ];

function App() {
  // const [count, setCount] = useState(0)

  return (
    <div>
      
      <Routes>
        <Route 
        path="/login"
        element={<LoginPage />}
        />
        <Route element={<ProtectedRoute />} >
        <Route path="/form" element={<ProductForm />} />

        <Route
          path="/products"
          element={<ProducList />}
        />
        </Route >
      </Routes>
    </div>
  );
}

export default App;
