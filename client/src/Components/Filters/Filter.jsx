import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTypes } from "../../Redux/Actions/Actions-Functions/actions-pokemonTypes";
import { filterByType, sortByAttack, filterByOrigin, sortByName, resetFilters } from "../../Redux/Actions/Actions-Functions/actions-filter";
import { setFilterLoading, setFilterRefreshLoading } from "../../Redux/Actions/Actions-Functions/action-loading";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight, faXmark } from '@fortawesome/free-solid-svg-icons';
import { getTypeBadgeStyle, getTypeName } from "../../styles/typeColors";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import style from './Filter.module.css';

const capitalizeType = (type) => {
    const value = getTypeName(type);
    return value.charAt(0).toUpperCase() + value.slice(1);
};

const Filter = () => {
    const types = useSelector((state) => state.types);
    const searchTerm = useSelector((state) => state.searchTerm || "");
    const filterRefreshLoading = useSelector((state) => state.filterRefreshLoading);
    const selectedTypes = useSelector((state) => state.selectedTypes || []);
    const sortBy = useSelector((state) => state.sortAttack || "all");
    const origin = useSelector((state) => state.originFilter || "all");
    const sortName = useSelector((state) => state.sortName || "all");

    const [originFeedback, setOriginFeedback] = useState(null);

    const dispatch = useDispatch();

    const runFilterAction = async (action) => {
        const startedAt = Date.now();
        dispatch(setFilterLoading(true));

        try {
            return await dispatch(action);
        } finally {
            const elapsed = Date.now() - startedAt;
            const remaining = Math.max(0, 500 - elapsed);

            if (remaining > 0) {
                await new Promise((resolve) => setTimeout(resolve, remaining));
            }

            dispatch(setFilterLoading(false));
        }
    };

    useEffect(() => {
        dispatch(getTypes());
    }, [dispatch]);

    const handleFilterByTypes = async (event) => {
        const type = event.target.value;

        if (type === "all") {
            await runFilterAction(filterByType([]));
            return;
        }

        if (selectedTypes.includes(type) || selectedTypes.length >= 2) {
            return;
        }

        const nextTypes = [...selectedTypes, type];
        await runFilterAction(filterByType(nextTypes));
    };

    const handleRemoveType = async (typeToRemove) => {
        const nextTypes = selectedTypes.filter((type) => type !== typeToRemove);
        await runFilterAction(filterByType(nextTypes));
    };

    const handleSortByAttack = async (event) => {
        const sortValue = event.target.value;
        await runFilterAction(sortByAttack(sortValue));
    };

    const handleOrigin = async (event) => {
        const originValue = event.target.value;
        const filtered = await runFilterAction(filterByOrigin(originValue));

        if (filtered === false) {
            const isCreated = originValue === "data base";
            setOriginFeedback({
                title: isCreated ? "No created Pokémon" : "No existing Pokémon",
                message: isCreated
                    ? "There are no created Pokémon in the database."
                    : "There are no existing Pokémon available.",
            });
            return;
        }

        // Origin is stored in Redux so it survives navigation back to Home.
    };

    const handleOriginFeedbackConfirm = () => {
        setOriginFeedback(null);
    };

    const handleSortByName = async (event) => {
        const sortValue = event.target.value;
        await runFilterAction(sortByName(sortValue));
    };

    const handleResetFilters = async () => {
        const hasActiveFilter =
            selectedTypes.length > 0 ||
            sortBy !== "all" ||
            origin !== "all" ||
            sortName !== "all" ||
            searchTerm.trim() !== "";

        if (!hasActiveFilter || filterRefreshLoading) {
            return;
        }

        const startedAt = Date.now();
        const MIN_REFRESH_TIME = 600;

        dispatch(setFilterRefreshLoading(true));
        dispatch(setFilterLoading(true));

        try {
            dispatch(resetFilters());
            // The reset action clears the filter state in Redux.
            setOriginFeedback(null);

            await dispatch(getTypes());
        } finally {
            const elapsed = Date.now() - startedAt;
            const remaining = Math.max(0, MIN_REFRESH_TIME - elapsed);

            if (remaining > 0) {
                await new Promise((resolve) => setTimeout(resolve, remaining));
            }

            dispatch(setFilterRefreshLoading(false));
            dispatch(setFilterLoading(false));
        }
    };

    return (
        <>
            <div className={style.filterContainer}>
                <div className={style.refreshWrap}>
                    <FontAwesomeIcon className={style.refresh} onClick={handleResetFilters} icon={faArrowRotateRight} beat />
                </div>

                <div className={`${style.filter} ${style.typeFilterBlock}`}>
                    <label htmlFor="type" className={style.typeFilter}>Filter by Type: </label>
                    <div className={style.typeFilterContent}>
                        <select value="all" className={style.select} onChange={handleFilterByTypes}>
                        <option value="all">All</option>
                        {types
                            .filter((type) => {
                                const typeName = getTypeName(type.name);
                                return typeName !== "unknown" && typeName !== "shadow";
                            })
                            .map((type, index) => {
                                const typeName = getTypeName(type.name);
                                const alreadySelected = selectedTypes.includes(typeName);
                                const blockedByLimit = selectedTypes.length >= 2 && !alreadySelected;

                                return (
                                    <option key={index} value={typeName} disabled={blockedByLimit || alreadySelected}>
                                        {capitalizeType(typeName)}
                                    </option>
                                );
                            })}
                    </select>

                    <div className={style.selectedTypes} aria-label="Selected Pokémon types">
                        {selectedTypes.map((type) => (
                            <div
                                key={type}
                                className={style.typeCard}
                                style={getTypeBadgeStyle(type)}
                            >
                                <span>{capitalizeType(type)}</span>
                                <button
                                    type="button"
                                    className={style.typeRemove}
                                    onClick={() => handleRemoveType(type)}
                                    aria-label={`Remove ${getTypeName(type)} filter`}
                                    title={`Remove ${getTypeName(type)}`}
                                >
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                <div className={style.filter}>
                    <label htmlFor="origin" className={style.originFilter}>Filter by Origin: </label>
                    <select value={origin} className={style.select} onChange={handleOrigin}>
                        <option value='all' className={style.option}>All</option>
                        <option value='data base' className={style.option}>Created</option>
                        <option value='api' className={style.option}>Existing</option>
                    </select>
                </div>

                <div className={style.filter}>
                    <label htmlFor="sort" className={style.orderFilter}>Sort by Name: </label>
                    <select value={sortName} className={style.select} onChange={handleSortByName}>
                        <option value="all" className={style.option}>All</option>
                        <option value="name-asc" className={style.option}>Name ▲</option>
                        <option value="name-desc" className={style.option}>Name ▼</option>
                    </select>
                </div>

                <div className={style.filter}>
                    <label htmlFor="sort" className={style.attackFilter}>Sort by Attack: </label>
                    <select value={sortBy} className={style.select} onChange={handleSortByAttack}>
                        <option value="all" className={style.option}>All</option>
                        <option value="attack-asc" className={style.option}>Attack ▲</option>
                        <option value="attack-desc" className={style.option}>Attack ▼</option>
                    </select>
                </div>
            </div>

            {originFeedback && (
                <FeedbackModal
                    title={originFeedback.title}
                    message={originFeedback.message}
                    error
                    onConfirm={handleOriginFeedbackConfirm}
                />
            )}
        </>
    )
};

export default Filter;
