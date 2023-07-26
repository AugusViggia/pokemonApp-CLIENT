import { Link } from "react-router-dom";
import Filter from "../Filters/Filter";
import SearchBar from "../SearchBar/SearchBar";
import style from "./NavBar.module.css";

const NavBar = () => {
    return (
        <div className={style.navBarContainer}>
            <div className={style.formLinkDiv}>
                <Link to={"/form"} className={style.buttonForm}>PokéMoN! CREATOR</Link>
                <SearchBar />
            </div>
            <div>
                <Filter />
            </div>
        </div>
    )
};

export default NavBar;