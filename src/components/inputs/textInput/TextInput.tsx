import type { ComponentProps } from "react";
import styles from "./TextInput.module.css";

type TextInputProps = {
  label: string;
  inputProps: ComponentProps<"input">
};

const TextInput = ({ label, inputProps }: TextInputProps) => {



  return (
    <div className={styles.mb4}>
      <label htmlFor={inputProps.name} className={styles.label}>
        {label}:
        <input
       {...inputProps}
        />
      </label>
    </div>
  );
};

export default TextInput;