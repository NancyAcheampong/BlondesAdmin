import type { Product } from "../productsForm/ProductForm";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";


// type ProductListProps = {
//   productList: Products[];
// }


const ProducList = () => {
  // const [products, setProducts] = useState<Products[]>([])

  const { error, data: product, isFetching } = useQuery({
    queryKey: ['repoData'],
    queryFn: async () => {
      const response = await fetch(
        'http://localhost:3000/products',
      )
      return await response.json() as Product[]
    },
  })

  if (error) return 'An error has occurred: ' + error.message

  // useEffect(() => {
  //   const fetchproduct = async () => {
  //     try {
  //       const res = await fetch("http://localhost:3000/products");
  //       const data = await res.json();
  //       setProducts(data)
  //     } catch (error) {
  //       console.error("Failed to load products:", error)
  //     }
  //   };
  //   fetchproduct();
  // }, [])

  const handleLogout = () => {
    localStorage.removeItem("accessToken"); // remove token
    // navigate("/login"); // send user back to login page
    window.location.href = '/login'
  };


  return <div>
    <h2>Product List</h2>
    <button onClick={handleLogout}>Log Out</button>
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
        {product?.map((p, index) => (
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
    <div>{isFetching ? 'Updating...' : ''}</div>
  </div>
};

export default ProducList;
