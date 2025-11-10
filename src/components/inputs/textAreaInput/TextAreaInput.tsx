import type { ComponentProps } from 'react';
import styles from './TextAreaInput.module.css'

type TextAreaProps = {
  label: string,
  textAreaProps : ComponentProps<"textarea">
  }
  


const TextAreaInput = ({label, textAreaProps}: TextAreaProps) => {
    return (  <div className={styles.mb4}>
          <label htmlFor={textAreaProps.name} className={styles.label}>
            {label}:
            <textarea
              {...textAreaProps}
            ></textarea>
          </label>
        </div> );
}
 
export default TextAreaInput ;