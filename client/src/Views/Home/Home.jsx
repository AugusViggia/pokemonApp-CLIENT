import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardsContainer from "../../Components/CardsContainer/CardsContainer";
import NavBar from "../../Components/NavBar/NavBar";
import Loading from "../../Components/Loading/Loading";
import { getPokemons } from "../../Redux/Actions/Actions-Functions/actions-pokemons";
import { setLoading } from "../../Redux/Actions/Actions-Functions/action-loading";
import style from './Home.module.css';

const Home = () => {
    const loading = useSelector(state => state.loading);
    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPokemons());
    }, [dispatch]);

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
      <div className={style.home}>
        <h2 className={style.pokedex}>PokeDeX!</h2>
        <div className={style.navBar}>
          <NavBar />
        </div>
        <CardsContainer />
        <div className={style.copyright}>
          Copyright&copy; {new Date().getFullYear()} All rights reserved
        </div>
      </div>
    );
};

export default Home;