import { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import { getPokemonDetails } from "../../Redux/Actions/Actions-Functions/actions-pokemons";
import { setLoading } from "../../Redux/Actions/Actions-Functions/action-loading";
import style from './Detail.module.css';

const Detail = () => {
    const pokemonDetails = useSelector((state) => state.details);
    const loading = useSelector(state => state.loading);
    const { id } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPokemonDetails(id));
    }, [dispatch, id]);

    const pokemonDetailsArray = Array.isArray(pokemonDetails) ? pokemonDetails : [pokemonDetails];

    const capitalizedName = pokemonDetailsArray[0]?.name ? pokemonDetailsArray[0]?.name.charAt(0).toUpperCase() + pokemonDetailsArray[0]?.name.slice(1) : '';

        useEffect(() => {
        dispatch(setLoading(true));

        setTimeout(() => {
            dispatch(setLoading(false));
        }, 3000);
    }, [dispatch]);

    if (loading) {
        return <Loading />;
    };

    return (
      <div className={style.container}>
        <>
          <div className={style.buttonDiv}>
            <Link to="/home" className={style.button}>
              BACK
            </Link>
          </div>
          <div className={style.wrapper}>
            <div className={style.nameDiv}>
              <p className={style.name}>{capitalizedName}</p>
            </div>
            <div className={style.infoDiv}>
              <div className={style.imageDiv}>
                <img
                  src={pokemonDetailsArray[0]?.image}
                  alt=""
                  className={style.image}
                />
              </div>
              <div className={style.details}>
                <div className={style.grid}>
                  <div className={style.detail}>
                    <p className={style.label}>HP</p>
                    <p className={style.value}>{pokemonDetailsArray[0]?.hp}</p>
                  </div>
                  <div className={style.detail}>
                    <p className={style.label}>HEIGHT</p>
                    <p className={style.value}>
                      {pokemonDetailsArray[0]?.height}
                    </p>
                  </div>
                  <div className={style.detail}>
                    <p className={style.label}>WEIGHT</p>
                    <p className={style.value}>
                      {pokemonDetailsArray[0]?.weight}
                    </p>
                  </div>
                  <div className={style.detail}>
                    <p className={style.label}>ATTACK</p>
                    <p className={style.value}>
                      {pokemonDetailsArray[0]?.attack}
                    </p>
                  </div>
                  <div className={style.detail}>
                    <p className={style.label}>DEFENSE</p>
                    <p className={style.value}>
                      {pokemonDetailsArray[0]?.defense}
                    </p>
                  </div>
                  <div className={style.detail}>
                    <p className={style.label}>SPEED</p>
                    <p className={style.value}>
                      {pokemonDetailsArray[0]?.speed}
                    </p>
                  </div>
                </div>
                <div className={style.types}>
                  <p className={style.label}>TYPES</p>
                  <div className={style.typeList}>
                    {pokemonDetailsArray[0]?.types.map((type, index) => {
                      return (
                        <div className={style.type} key={index}>
                          {typeof type === "object" ? type.name : type}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
        <div className={style.copyright}>
          Copyright&copy; {new Date().getFullYear()} All rights reserved
        </div>
      </div>
    );
};

export default Detail;