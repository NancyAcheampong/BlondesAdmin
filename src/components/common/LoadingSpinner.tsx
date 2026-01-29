import styles from "./LoadingSpinner.module.css";

type LoadingSpinnerProps = {
  size?: "small" | "medium" | "large";
  message?: string;
};

const LoadingSpinner = ({ size = "medium", message }: LoadingSpinnerProps) => {
  return (
    <div className={styles.container}>
      <div className={`${styles.spinner} ${styles[size]}`} />
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
