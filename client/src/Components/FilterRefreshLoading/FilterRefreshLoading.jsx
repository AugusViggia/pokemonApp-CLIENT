import React from "react";
import style from "./FilterRefreshLoading.module.css";

const FilterRefreshLoading = () => {
  return (
    <div className={style.overlay} role="status" aria-live="polite">
      <div className={style.spinner} aria-hidden="true" />
      <p className={style.text}>Refreshing filters...</p>
    </div>
  );
};

export default FilterRefreshLoading;
