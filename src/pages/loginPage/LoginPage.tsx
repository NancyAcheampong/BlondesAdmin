import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { LoginSchema, type LoginFormValues } from "../../types";
import TextInput from "../../components/inputs/textInput/TextInput";
import { Alert, Button } from "../../components/common";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/products", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    try {
      await login(data);
      navigate("/products");
    } catch {
      // Error is handled by the auth context
    }
  };

  // Show loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Admin Login</h1>
        <p className={styles.subtitle}>Sign in to manage your products</p>

        {error && <Alert type="error" message={error} onClose={clearError} />}

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.inputGroup}>
            <TextInput
              label="Email"
              inputProps={{
                ...register("email"),
                type: "email",
                placeholder: "Enter your email",
                autoComplete: "email",
              }}
            />
            {errors.email && (
              <span className={styles.errorText}>{errors.email.message}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <TextInput
              label="Password"
              inputProps={{
                ...register("password"),
                type: "password",
                placeholder: "Enter your password",
                autoComplete: "current-password",
              }}
            />
            {errors.password && (
              <span className={styles.errorText}>
                {errors.password.message}
              </span>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            size="large"
            isLoading={isSubmitting}
            className={styles.submitButton}
          >
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
