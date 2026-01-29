import styles from "./Alert.module.css";

type AlertType = "error" | "success" | "warning" | "info";

type AlertProps = {
  type: AlertType;
  message: string;
  onClose?: () => void;
};

const Alert = ({ type, message, onClose }: AlertProps) => {
  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <span className={styles.message}>{message}</span>
      {onClose && (
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
