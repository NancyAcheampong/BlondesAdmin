import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../services/api";
import { ProductsSchema, type ProductFormValues } from "../../types";
import TextInput from "../../components/inputs/textInput/TextInput";
import SelectInput from "../../components/inputs/selectInput/SelectInput";
import { Alert, Button } from "../../components/common";
import styles from "./ProductForm.module.css";

const ProductForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { logout } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductsSchema),
    defaultValues: {
      productName: "",
      price: 0,
      productColor: "",
      productSize: "medium",
      image: "",
      inStock: true,
      isLiked: false,
    },
  });

  const createProductMutation = useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/products");
    },
    onError: (error) => {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to create product"
      );
    },
  });

  const onSubmit: SubmitHandler<ProductFormValues> = (data) => {
    setSubmitError(null);
    createProductMutation.mutate(data);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <Link to="/products" className={styles.backLink}>
            &larr; Back to Products
          </Link>
          <h1 className={styles.title}>Add New Product</h1>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          Log Out
        </Button>
      </header>

      <div className={styles.formWrapper}>
        {submitError && (
          <Alert
            type="error"
            message={submitError}
            onClose={() => setSubmitError(null)}
          />
        )}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.inputGroup}>
              <TextInput
                label="Product Name"
                inputProps={{
                  ...register("productName"),
                  placeholder: "Enter product name",
                }}
              />
              {errors.productName && (
                <span className={styles.errorText}>
                  {errors.productName.message}
                </span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <TextInput
                label="Price"
                inputProps={{
                  ...register("price", { valueAsNumber: true }),
                  type: "number",
                  step: "0.01",
                  min: "0",
                  placeholder: "0.00",
                }}
              />
              {errors.price && (
                <span className={styles.errorText}>{errors.price.message}</span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <TextInput
                label="Color"
                inputProps={{
                  ...register("productColor"),
                  placeholder: "Enter color",
                }}
              />
              {errors.productColor && (
                <span className={styles.errorText}>
                  {errors.productColor.message}
                </span>
              )}
            </div>

            <div className={styles.inputGroup}>
              <SelectInput
                label="Size"
                options={[
                  { value: "small", label: "Small" },
                  { value: "medium", label: "Medium" },
                  { value: "large", label: "Large" },
                ]}
                selectInputProps={register("productSize")}
              />
            </div>

            <div className={styles.inputGroupFull}>
              <TextInput
                label="Image URL"
                inputProps={{
                  ...register("image"),
                  placeholder: "Enter image URL",
                }}
              />
              {errors.image && (
                <span className={styles.errorText}>{errors.image.message}</span>
              )}
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register("inStock")} />
                <span>In Stock</span>
              </label>

              <label className={styles.checkboxLabel}>
                <input type="checkbox" {...register("isLiked")} />
                <span>Featured/Liked</span>
              </label>
            </div>
          </div>

          <div className={styles.formActions}>
            <Link to="/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              isLoading={createProductMutation.isPending}
            >
              Create Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
