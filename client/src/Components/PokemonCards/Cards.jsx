import { Link } from "react-router-dom";
import style from "./Cards.module.css";
import { getTypeBadgeStyle, getTypeName } from "../../styles/typeColors";

const Card = ({ id, image, name, types, attack, created, customNumber, page }) => {

  return (
    <div
      className={style.card}
      key={id}
      style={{ background: "linear-gradient(145deg, #ffffff, #f9e7e7)" }}
    >
      <div className={style.containerImg}>
        <Link
          to={`/detail/${id}`}
          state={{
            fromHome: {
              page,
              scrollY: window.scrollY,
            },
          }}
          className={style.detail}
        >
          <img src={image} alt={name} className={style.img} loading="eager" decoding="async" />
        </Link>
      </div>
      <div className={style.containerTitle}>
        <p className={style.name}>{name}</p>
        <span
          className={`${style.number} ${created ? style.customNumber : ""}`}
          style={{ color: created ? "#b45309" : "#7f1d1d" }}
        >
          {created
            ? `C${String(customNumber).padStart(3, "0")}`
            : `#${String(id).padStart(3, "0")}`}
        </span>
      </div>
      <div className={style.containerTypes}>
        {types?.map((type, index) => (
          <div
            key={index}
            className={style.type}
            style={getTypeBadgeStyle(type)}
          >
            {getTypeName(type)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Card;
