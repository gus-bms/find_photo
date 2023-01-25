import React from "react";
import style from '../../../styles/Global.module.css'

export default function LoadingSpinner() {
  return (
    <div className={style.spinner__container}>
      <div className={style.loading__spinner}></div>
    </div>
  );
}