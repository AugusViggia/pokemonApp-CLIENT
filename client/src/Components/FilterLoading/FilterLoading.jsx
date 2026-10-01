import React from "react";
import style from "./FilterLoading.module.css";

const FilterLoading = () => {
  return (
    <div className={style.overlay} role="status" aria-live="polite">
      <div className={style.spinner} aria-hidden="true" />
      <p className={style.text}>Loading...</p>
    </div>
  );
};

export default FilterLoading;
