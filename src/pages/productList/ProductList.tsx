import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import type { Product } from "../../types";
import { LoadingSpinner, Alert, Button } from "../../components/common";
import styles from "./ProductList.module.css";

const ProductList = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

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

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setProductToDelete(null);
    },
    onError: (error) => {
      setDeleteError(
        error instanceof Error ? error.message : "Failed to delete product"
      );
      setProductToDelete(null);
    },
  });

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteError(null);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteMutation.mutate(productToDelete.id);
    }
  };

  const cancelDelete = () => {
    setProductToDelete(null);
  };

  // Helper to safely check boolean values
  // Handles: boolean, string "true"/"false", numbers 1/0, string "1"/"0"
  const parseBooleanValue = (value: boolean | string | number | undefined | null, defaultValue: boolean): boolean => {
    if (value === undefined || value === null) return defaultValue;
    if (typeof value === "boolean") return value;
    if (typeof value === "number") return value !== 0;
    if (typeof value === "string") {
      const lower = value.toLowerCase().trim();
      if (lower === "true" || lower === "1") return true;
      if (lower === "false" || lower === "0" || lower === "") return false;
      return defaultValue;
    }
    return defaultValue;
  };

  // Stock defaults to true (in stock)
  const isInStock = (value: boolean | string | number | undefined | null): boolean => {
    return parseBooleanValue(value, true);
  };

  // Featured defaults to false (not featured)
  const isFeatured = (value: boolean | string | number | undefined | null): boolean => {
    return parseBooleanValue(value, false);
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner size="large" message="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <Alert
            type="error"
            message={
              error instanceof Error ? error.message : "Failed to load products"
            }
          />
          <Button onClick={() => refetch()} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Delete Product</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete "{productToDelete.productName}"?
              This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <Button variant="outline" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                isLoading={deleteMutation.isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Products</h1>
          <p className={styles.subtitle}>Manage your product catalog</p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/form">
            <Button variant="primary" size="medium">
              + Add Product
            </Button>
          </Link>
          <Button variant="outline" size="medium" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      </header>

      {deleteError && (
        <Alert
          type="error"
          message={deleteError}
          onClose={() => setDeleteError(null)}
        />
      )}

      {isFetching && !isLoading && (
        <div className={styles.fetchingIndicator}>
          <span className={styles.fetchingDot}></span>
          Refreshing...
        </div>
      )}

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>{products?.length || 0}</span>
          <span className={styles.statLabel}>Total Products</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {products?.filter((p) => isInStock(p.inStock)).length || 0}
          </span>
          <span className={styles.statLabel}>In Stock</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {products?.filter((p) => !isInStock(p.inStock)).length || 0}
          </span>
          <span className={styles.statLabel}>Out of Stock</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statNumber}>
            {products?.filter((p) => isFeatured(p.isLiked)).length || 0}
          </span>
          <span className={styles.statLabel}>Featured</span>
        </div>
      </div>

      {products && products.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📦</div>
          <h2 className={styles.emptyTitle}>No products yet</h2>
          <p className={styles.emptyText}>
            Get started by adding your first product to the catalog.
          </p>
          <Link to="/form">
            <Button variant="primary" size="large">
              Add Your First Product
            </Button>
          </Link>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Size</th>
                <th>Color</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.productCell}>
                      <img
                        src={product.image}
                        alt={product.productName}
                        className={styles.productImage}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://via.placeholder.com/60x60?text=No+Image";
                        }}
                      />
                      <span className={styles.productName}>
                        {product.productName}
                      </span>
                    </div>
                  </td>
                  <td className={styles.priceCell}>
                    ${Number(product.price).toFixed(2)}
                  </td>
                  <td>
                    <span className={styles.sizeTag}>
                      {product.productSize || "—"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.colorCell}>
                      <span
                        className={styles.colorDot}
                        style={{
                          backgroundColor: product.productColor?.toLowerCase(),
                        }}
                      ></span>
                      {product.productColor}
                    </div>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        isInStock(product.inStock)
                          ? styles.badgeSuccess
                          : styles.badgeDanger
                      }`}
                    >
                      {isInStock(product.inStock) ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`${styles.badge} ${
                        isFeatured(product.isLiked)
                          ? styles.badgeFeatured
                          : styles.badgeNeutral
                      }`}
                    >
                      {isFeatured(product.isLiked) ? "★ Featured" : "Standard"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionButtons}>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteClick(product)}
                        title="Delete product"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProductList;
