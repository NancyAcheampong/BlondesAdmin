import * as z from "zod";
// import { useNavigate } from "react-router-dom";
import TextInput from "../../components/inputs/textInput/TextInput";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Navigate, useNavigate } from "react-router-dom";

export type UserDetails = {
    email: string;
    password: string;
}

export const LoginSchema = z.object({
    email: z.string().min(1, "required"),
    password: z.string().min(1, "Please fill in your password"),
});

export type LoginPageValues = z.infer<typeof LoginSchema>;




const LoginPage = () => {

    const isAuthenticated = localStorage.getItem("accessToken");

    if (isAuthenticated) {
        return <Navigate to="/products" replace />;
    }



    const navigate = useNavigate();
    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginPageValues>({
        resolver: zodResolver(LoginSchema),
    });

    const onSubmit: SubmitHandler<LoginPageValues> = (loginPageValues) => {
        const newUser: UserDetails = {
            ...loginPageValues,
        };
        console.log(newUser);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(
            newUser
        );

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,

        };

        fetch("http://localhost:3000/api/admin/login", requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.accessToken) {
                    localStorage.setItem("accessToken", result.accessToken)
                    navigate("/products")
                } else {
                    alert(result.message || "Error Occured")
                }
                console.log(result)
            })
            .catch(error => {
                alert(error.message)
                console.log('error', error)
            });


        reset({
            email: "",
            password: ""
        })
    }

    // const navigate = useNavigate();
    // const {
    //     register,
    //     reset,
    //     handleSubmit,
    //     formState: { errors },
    // } = useForm<LoginPageValues>({
    //     resolver: zodResolver(LoginSchema),
    // });

    // reset();
    return <div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <TextInput
                label={"email"} inputProps={register("email")} />
            {errors.email?.message}
            <TextInput
                label={"password"} inputProps={register("password")} />
            {errors.password?.message}
            <button type="submit">Log In</button>
        </form>

    </div>
}

export default LoginPage;