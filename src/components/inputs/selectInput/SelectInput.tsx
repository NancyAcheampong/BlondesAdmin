import type { ComponentProps } from 'react';
import styles from './SelectInput.module.css'


type Option = {
  label: string
  value: string
}

type InputProps = {
  label: string;
  options: Option[]
  selectInputProps?: ComponentProps<"select">
};

const SelectInput = ({
  label,
  options,
  selectInputProps,
}: InputProps) => {
  return (
    <div className={styles.label}>
      <label htmlFor={selectInputProps?.name} className={styles.labels}>
        {label}:
        <select
      {...selectInputProps}
          className={styles.inputField}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default SelectInput;