import React from "react";
import styles from "./Input.module.css";
const Input = (props) => {
  return (
    <div>
      {props.error && <label className={styles.error}>{props.error}</label>}
      <input
        className={styles.form_input}
        type={props.type}
        value={props.value}
        onChange={props.handleInputChange}
        placeholder={props.placeholder}
        name={props.name}
      />
    </div>
  );
};

export default Input;
