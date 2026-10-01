import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Filter from "../Filters/Filter";
import SearchBar from "../SearchBar/SearchBar";
import FilterRefreshLoading from "../FilterRefreshLoading/FilterRefreshLoading";
import style from "./NavBar.module.css";

const NavBar = () => {
    const filterRefreshLoading = useSelector((state) => state.filterRefreshLoading);

    return (
        <div className={style.navBarContainer}>
            <div className={style.creatorRow}>
                <Link to={"/form"} className={style.buttonForm}>PokéMoN! CREATOR</Link>
            </div>

            <div className={style.filtersPanel}>
                <div className={style.controlsRow}>
                    <div className={style.filterSection}>
                        <Filter />
                    </div>

                    <div className={style.searchSection}>
                        <SearchBar />
                    </div>
                </div>

                {filterRefreshLoading && <FilterRefreshLoading />}
            </div>
        </div>
    )
};

export default NavBar;
