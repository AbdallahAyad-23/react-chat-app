import React from "react";
import styles from "./HamburgerIcon.module.css";
const HamburgerIcon = ({ onClick }) => {
  return (
    <div className={styles.ham} onClick={onClick}>
      <div className={styles.line}></div>
      <div className={styles.line}></div>
      <div className={styles.line}></div>
    </div>
  );
};

export default HamburgerIcon;
