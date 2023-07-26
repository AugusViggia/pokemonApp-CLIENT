import React from "react";
import style from "./Form.module.css";

const ValidationError = ({ message }) => {
    return <span className={style.invalidFeedback}>{message}</span>;
};

export default ValidationError;