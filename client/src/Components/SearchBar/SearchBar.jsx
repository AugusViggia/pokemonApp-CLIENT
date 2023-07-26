import { useState } from "react";
import { useDispatch } from "react-redux";
import { searchName } from "../../Redux/Actions/Actions-Functions/action-searchName";
import style from './SearchBar.module.css';

const SearchBar = () => {
    const [name, setName] = useState('');

    const dispatch = useDispatch();

    const handleInputChange = (event) => {
        setName(event.target.value);
    };

    const handleSearch = () => {
        dispatch(searchName(name));
        setName('');
    };

    return (
        <form className={style.searchForm}>
            <input className={style.input} onChange={handleInputChange} placeholder="Search by name..." type="text" value={name}></input>
            <button className={style.button} type="button" onClick={handleSearch}>SEARCH</button>
        </form>
    )
};

export default SearchBar;