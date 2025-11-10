import type { Products } from "../productsForm/ProductForm";
import { useEffect, useState } from "react";


// type ProductListProps = {
//   productList: Products[];
// }

const ProducList = () => {
  const [products, setProducts] = useState<Products[]>([])

  useEffect(() => {
    const fetchproduct = async () => {
      try {
        const res = await fetch("http://localhost:3000/products");
        const data = await res.json();
        setProducts(data)
      } catch (error) {
        console.error("Failed to load products:", error)
      }
    };
    fetchproduct();
  }, [])

  return <div>
    <h2>Product List</h2>
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Product Name</th>
          <th>Price</th>
          <th>Size</th>
          <th>Color</th>
          <th>In Stock</th>
          <th>Liked</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p, index) => (
          <tr key={index}>
            <td>
              <img
                src={p.image}
                alt={p.productName}
                className="product-image"
              />
            </td>
            <td>{p.productName}</td>
            <td>{p.price}</td>
            <td>{p.productSize || "—"}</td>
            <td>{p.productColor}</td>
            <td>{p.inStock}</td>
            <td>{p.isLiked}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
};

export default ProducList;
