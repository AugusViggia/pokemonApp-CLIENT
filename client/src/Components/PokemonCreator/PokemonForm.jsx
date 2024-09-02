import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../Loading/Loading";
import { setLoading } from "../../Redux/Actions/Actions-Functions/action-loading";
import style from "./PokemonForm.module.css";


const PokemonForm = ({ onSubmit, onChange, input, error, types, selectedTypes, onCheck }) => {
    const [imagePreview, setImagePreview] = useState("");

    const loading = useSelector(state => state.loading);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(true));

        setTimeout(() => {
            dispatch(setLoading(false));
        }, 3000);
    }, [dispatch]);

    const handleImageChange = (e) => {
        const { value } = e.target;
        setImagePreview(value); // Update the image preview
        onChange(e); // Make sure to call onChange to update the input state
    };

    if (loading) {
        return <Loading />;
    };

    return (
      <div className={style.container}>
        <div className={style.buttonDiv}>
          <Link to="/home" className={style.buttonBack}>
            BACK
          </Link>
        </div>
        <form method="POST" onSubmit={onSubmit} className={style.form}>
          <p className={style.title}>PoKéMoN! CREATOR</p>
          <div className={style.formGroup}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={input.name}
              onChange={onChange}
              className={
                error.name ? "form-control is-invalid" : "form-control"
              }
              placeholder="Write a name..."
            />
            {error.types && <ValidationError message={error.types} />}
          </div>
          <div className={style.formGroup}>
            <label htmlFor="image">Image:</label>
            <input
              type="text"
              id="image"
              name="image"
              value={input.image}
              onChange={handleImageChange} // Use handleImageChange instead of onChange
              className={
                error.image ? "form-control is-invalid" : "form-control"
              }
              placeholder="It has to be .png/.jpg"
            />
            {error.types && <ValidationError message={error.types} />}
          </div>
          <div className={style.formGroup}>
            {imagePreview && (
              <div className={style.imagePreview}>
                <img src={imagePreview} alt="Image preview" />
              </div>
            )}
          </div>
          <div className={style.formGroup}>
            <label htmlFor="hp">Hp:</label>
            <input
              type="number"
              id="hp"
              name="hp"
              min="0"
              max="999"
              value={input.hp}
              onChange={onChange}
              className={error.hp ? "form-control is-invalid" : "form-control"}
            />
            {error.types && <ValidationError message={error.types} />}
          </div>
          <div className={style.formGroup}>
            <label htmlFor="height">Height:</label>
            <input
              type="number"
              id="height"
              name="height"
              min="0"
              max="999"
              value={input.height}
              onChange={onChange}
              className={
                error.height ? "form-control is-invalid" : "form-control"
              }
            />
            {error.types && <ValidationError message={error.types} />}
          </div>
          <div className={style.formGroup}>
            <label htmlFor="weight">Weight:</label>
            <input
              type="number"
              id="weight"
              name="weight"
              min="0"
              max="999"
              value={input.weight}
              onChange={onChange}
              className={
                error.weight ? "form-control is-invalid" : "form-control"
              }
            />
            {error.types && <ValidationError message={error.types} />}
          </div>
          <div className={style.formGroup}>
            <label htmlFor="attack">Attack:</label>
            <input
              type="number"
              id="attack"
              name="attack"
              min="0"
              max="999"
              value={input.attack}
              onChange={onChange}
              className={
                error.attack ? "form-control is-invalid" : "form-control"
              }
            />
            {error.types && <ValidationError message={error.types} />}
          </div>
          <div className={style.formGroup}>
            <label htmlFor="defense">Defense:</label>
            <input
              type="number"
              id="defense"
              name="defense"
              min="0"
              max="999"
              value={input.defense}
              onChange={onChange}
              className={
                error.defense ? "form-control is-invalid" : "form-control"
              }
            />
            {error.types && <ValidationError message={error.types} />}
          </div>
          <div className={style.formGroup}>
            <label htmlFor="speed">Speed:</label>
            <input
              type="number"
              id="speed"
              name="speed"
              min="0"
              max="999"
              value={input.speed}
              onChange={onChange}
              className={
                error.speed ? "form-control is-invalid" : "form-control"
              }
            />
            {error.types && <ValidationError message={error.types} />}
          </div>
          <div className="{style.formGroup}">
            <label htmlFor="types" className={style.checkBoxTitle}>
              Types:
            </label>
            <div className={style.checkBoxDiv}>
              {types?.map((type) => {
                return (
                  <div key={type.id}>
                    <label>{type.name}</label>
                    <input
                      type="checkbox"
                      name="types"
                      value={type.id}
                      onChange={onCheck}
                      checked={selectedTypes.includes(type.id)}
                    />
                  </div>
                );
              })}
            </div>
            {error.types && <ValidationError message={error.types} />}
          </div>
          <button type="submit" onClick={onSubmit}>
            CREATE POKEMON
          </button>
        </form>
        <div className={style.copyright}>
          Copyright&copy; {new Date().getFullYear()} All rights reserved
        </div>
      </div>
    );
};

export default PokemonForm;