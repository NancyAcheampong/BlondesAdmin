// import TextInput from "./components/textInput/TextInput";
// import { useForm, type SubmitHandler } from "react-hook-form";
// import { useProductsProvider } from "../../context/ProductProvider";
import * as z from "zod";
import TextInput from "../../components/inputs/textInput/TextInput";
import SelectInput from "../../components/inputs/selectInput/SelectInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// import { zodResolver } from "@hookform/resolvers/zod";

export type Product = {
  id: number;
  price: number;
  productSize?: string;
  productColor: string;
  productName: string;
  image: string;
  inStock: boolean;
  isLiked: boolean;
};

export const ProductsSchema = z.object({
  productName: z.string().min(1, "required"),
  price: z.number().min(0, "Price must be a positive number"),
  image: z.string().min(1, "Image is required"),
  productSize: z.enum(["small", "medium", "large"]).optional(),
  productColor: z.string().min(1, "required"),
  inStock: z.boolean(),
  isLiked: z.boolean(),
});

export type ProductFormValues = z.infer<typeof ProductsSchema>;

const ProductForm = () => {
  const navigate = useNavigate();
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductsSchema),
  });

  const onSubmit: SubmitHandler<ProductFormValues> = (productFormValues) => {
    const newProduct: Product = {
      id: Date.now(),
      ...productFormValues,
    };
    console.log(newProduct);

    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify(
    newProduct
);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
//   redirect: 'follow'
};

fetch("http://localhost:3000/products", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

    reset({
      productName: "",
      price: 0,
      productColor: "",
      productSize: "small",
      image: "",
      isLiked: false,
      inStock: true,
    });

    navigate("/products");
  };
  console.log(errors);
  
  const handleLogout = () => {
  localStorage.removeItem("accessToken"); // remove token
  navigate("/login"); // send user back to login page
};

  return (
    <div>
      <button onClick = {handleLogout}>Log Out</button>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextInput
          label={"Product Name"}
          inputProps={register("productName")}
        />
        {errors.productName?.message}
        <TextInput
          label={"price"}
          inputProps={register("price", { valueAsNumber: true })}
        />
        {errors.price?.message}
        <TextInput label={"color"} inputProps={register("productColor")} />
        {errors.productColor?.message}
        <SelectInput
          label={"size"}
          options={[
            { value: "small", label: "small" },
            { value: "medium", label: "medium" },
            { value: "large", label: "large" },
          ]}
          selectInputProps={register("productSize")}
        />
        <TextInput label={"image"} inputProps={register("image")} />
        <div>
          <label>In stock</label>

          <input type="checkbox" {...register("inStock")} />
        </div>
        <div>
          <label>Is liked</label>

          <input type="checkbox" {...register("isLiked")} />
        </div>
        <button type="submit">Submit Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
