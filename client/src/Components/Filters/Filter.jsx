import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPokemons } from "../../Redux/Actions/Actions-Functions/actions-pokemons";
import { getTypes } from "../../Redux/Actions/Actions-Functions/actions-pokemonTypes";
import { filterByType, sortByAttack, filterByOrigin, sortByName, resetFilters } from "../../Redux/Actions/Actions-Functions/actions-filter";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import style from './Filter.module.css';

const Filter = () => {
    const types = useSelector((state) => state.types);

    const [selectedType, setSelectedType] = useState("all");
    const [sortBy, setSortBy] = useState("all");
    const [origin, setOrigin] = useState("all");
    const [sortName, setSortName] = useState("all");

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTypes());
    }, [dispatch]);

    const handleFilterByTypes = (event) => {
        const type = event.target.value;
        setSelectedType(type);
        if (type === "all") {
            dispatch(resetFilters());
        } else {
            dispatch(filterByType(type));
        }
    };

    const handleSortByAttack = (event) => {
        const sortValue = event.target.value;
        setSortBy(sortValue);
        dispatch(sortByAttack(sortValue));
    };

    const handleOrigin = (event) => {
        const originValue = event.target.value;
        setOrigin(originValue);
        dispatch(filterByOrigin(originValue));
    };

    const handleSortByName = (event) => {
        const sortValue = event.target.value;
        setSortName(sortValue);
        dispatch(sortByName(sortValue));
    };

    const handleResetFilters = () => {
        dispatch(resetFilters());
        setSelectedType("all");
        setSortBy("all");
        setOrigin("all");
        setSortName("all");

        dispatch(getPokemons());
        dispatch(getTypes());
    };

    return (
        <div className={style.filterContainer}>

            <div>
                <FontAwesomeIcon className={style.refresh} onClick={handleResetFilters} icon={faArrowRotateRight} beat />
            </div>

            <div className={style.filter}>
                <label htmlFor="type" className={style.typeFilter}>Filter by Type: </label>
                <select defaultValue="all" className={style.select} onChange={handleFilterByTypes} disabled={selectedType !== "all"}>
                    <option value="all">--</option>
                    {types.map((type, index) => {
                        return (<option key={index} value={type.name}>{type.name}</option>)
                    })}
                </select>
            </div>

            <div className={style.filter}>
                <label htmlFor="origin" className={style.originFilter}>Filter by Origin: </label>
                <select value={origin} className={style.select} onChange={handleOrigin} disabled={origin !== "all"}>
                    <option value='all' className={style.option}>--</option>
                    <option value='data base' className={style.option}>Created</option>
                    <option value='api' className={style.option}>Existing</option>
                </select>
            </div>

            <div className={style.filter}> 
                <label htmlFor="sort" className={style.orderFilter}>Sort by Name: </label>
                <select value={sortName} className={style.select} onChange={handleSortByName}>
                    <option value="all" className={style.option} disabled={sortName !== "all"}>--</option>
                    <option value="name-asc" className={style.option}>Name ▲</option>
                    <option value="name-desc" className={style.option}>Name ▼</option>
                </select>
            </div>

            <div className={style.filter}>
                <label htmlFor="sort" className={style.attackFilter}>Sort by Attack: </label>
                <select value={sortBy} className={style.select} onChange={handleSortByAttack}>
                    <option value="all" className={style.option} disabled={sortBy !== "all"}>--</option>
                    <option value="attack-asc" className={style.option}>Attack ▲</option>
                    <option value="attack-desc" className={style.option}>Attack ▼</option>
                </select>
            </div>

        </div>
    )
};

export default Filter;