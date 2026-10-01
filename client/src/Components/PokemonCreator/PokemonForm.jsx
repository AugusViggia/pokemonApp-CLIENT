
import { useState } from "react";
import { Link } from "react-router-dom";
import style from "./PokemonForm.module.css";
import ValidationError from "./ValidationError";
import FilterLoading from "../FilterLoading/FilterLoading";

const PokemonForm = ({
  onSubmit,
  onChange,
  input,
  error,
  types,
  selectedTypes,
  onCheck,
  isRefreshing = false,
}) => {
  const [imagePreview, setImagePreview] = useState("");
  const [shinyImagePreview, setShinyImagePreview] = useState("");
  const [imageErrors, setImageErrors] = useState({ image: "", shinyImage: "" });

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!/^image\/jpeg$/i.test(file.type) || !/\.(jpg|jpeg)$/i.test(file.name)) {
      setImageErrors((previous) => ({ ...previous, [fieldName]: "Only .jpg or .jpeg images are allowed." }));
      e.target.value = "";
      return;
    }

    setImageErrors((previous) => ({ ...previous, [fieldName]: "" }));
    const reader = new FileReader();
    reader.onload = () => {
      if (fieldName === "image") setImagePreview(reader.result);
      else setShinyImagePreview(reader.result);
      onChange({ target: { name: fieldName, value: reader.result } });
    };
    reader.onerror = () => setImageErrors((previous) => ({
      ...previous,
      [fieldName]: "The image could not be read. Please choose another file.",
    }));
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={style.container}
      style={{
        background:
          "radial-gradient(circle at top right, #fee2e2, transparent 28rem), #f8f5f5",
      }}
    >
      <div className={style.buttonDiv}>
        <Link
          to="/home"
          className={style.buttonBack}
        >
          BACK TO POKEDEX
        </Link>
      </div>
      <div className={style.formWrapper}>
        <form method="POST" onSubmit={onSubmit} className={style.form}>
        <p className={style.title}>PoKéMoN! CREATOR</p>
        <div className={style.formGroup + " " + style.nameGroup}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            maxLength="30"
            value={input.name}
            onChange={onChange}
            className={error.name ? "form-control is-invalid" : "form-control"}
            placeholder="Write a name..."
          />
          {error.types && <ValidationError message={error.types} />}
        </div>
        <div className={style.formGroup + " " + style.previewGroup}>
          <label htmlFor="image" className={style.imagePreview}>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Pokémon preview"
                className={style.imgprev}
              />
            ) : (
              <span className={style.previewPlaceholder}>
                Add Pokémon artwork <small>(required)</small>
              </span>
            )}
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept=".jpg,.jpeg,image/jpeg"
            onChange={(event) => handleImageChange(event, "image")}
            className={style.fileInput}
          />
          {imageErrors.image && <ValidationError message={imageErrors.image} />}

          <label htmlFor="shinyImage" className={`${style.imagePreview} ${style.shinyImagePreview}`}>
            {shinyImagePreview ? (
              <img src={shinyImagePreview} alt="Pokémon shiny preview" className={style.imgprev} />
            ) : (
              <span className={style.previewPlaceholder}>
                Add shiny artwork <small>(optional)</small>
              </span>
            )}
          </label>
          <input
            id="shinyImage"
            name="shinyImage"
            type="file"
            accept=".jpg,.jpeg,image/jpeg"
            onChange={(event) => handleImageChange(event, "shinyImage")}
            className={style.fileInput}
          />
          {imageErrors.shinyImage && <ValidationError message={imageErrors.shinyImage} />}
        </div>
        <div className={style.statsGroup}>
          {[
            ["hp", "Hp"],
            ["height", "Height"],
            ["weight", "Weight"],
            ["attack", "Attack"],
            ["defense", "Defense"],
            ["speed", "Speed"],
          ].map(([field, label]) => (
            <div className={style.formGroup} key={field}>
              <label htmlFor={field}>{label}:</label>
              <input
                type="number"
                id={field}
                name={field}
                min="1"
                max="999"
                value={input[field]}
                onChange={onChange}
                className={
                  error[field] ? "form-control is-invalid" : "form-control"
                }
              />
              {error[field] && <ValidationError message={error[field]} />}
            </div>
          ))}
        </div>
        <div className={style.formGroup + " " + style.typesGroup}>
          <label htmlFor="types" className={style.checkBoxTitle}>
            Types:
          </label>
          <div className={style.checkBoxDiv}>
            {types?.map((type) => {
              return (
                <div key={type.id}>
                  <input
                    type="checkbox"
                    name="types"
                    value={type.id}
                    onChange={onCheck}
                    checked={selectedTypes.some((selected) => String(selected) === String(type.id))}
                  />
                  <label>{type.name}</label>
                </div>
              );
            })}
          </div>
          {error.types && <ValidationError message={error.types} />}
        </div>
        <button className={style.submitButton} type="submit">
          CREATE POKEMON
        </button>
        </form>
        {isRefreshing && <FilterLoading />}
      </div>
      <div className={style.copyright}>
        Copyright&copy; {new Date().getFullYear()} All rights reserved
      </div>
    </div>
  );
};

export default PokemonForm;
