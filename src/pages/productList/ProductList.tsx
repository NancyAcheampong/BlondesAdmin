import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { LoadingSpinner, Alert, Button } from "../../components/common";
import styles from "./ProductList.module.css";

const ProductList = () => {
  const { logout } = useAuth();

  const {
    data: products,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: api.getProducts,
  });

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingSpinner size="large" message="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <Alert
          type="error"
          message={error instanceof Error ? error.message : "Failed to load products"}
        />
        <Button onClick={() => refetch()} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Product Management</h1>
        <div className={styles.headerActions}>
          <Link to="/form">
            <Button variant="primary">Add Product</Button>
          </Link>
          <Button variant="outline" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </header>

      {isFetching && !isLoading && (
        <div className={styles.fetchingIndicator}>Refreshing...</div>
      )}

      {products && products.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No products found.</p>
          <Link to="/form">
            <Button variant="primary">Add Your First Product</Button>
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
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
              {products?.map((product) => (
                <tr key={product.id}>
                  <td>
                    <img
                      src={product.image}
                      alt={product.productName}
                      className={styles.productImage}
                    />
                  </td>
                  <td className={styles.productName}>{product.productName}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.productSize || "—"}</td>
                  <td>{product.productColor}</td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        product.inStock ? styles.badgeSuccess : styles.badgeDanger
                      }`}
                    >
                      {product.inStock ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        product.isLiked ? styles.badgeSuccess : styles.badgeNeutral
                      }`}
                    >
                      {product.isLiked ? "Yes" : "No"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.summary}>
        Total Products: {products?.length || 0}
      </div>
    </div>
  );
};

export default ProductList;
