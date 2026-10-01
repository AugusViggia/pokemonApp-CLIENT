import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { SEARCH_NAME_INPUT } from "../../Redux/Actions/Actions-Types/action-types";
import { searchName } from "../../Redux/Actions/Actions-Functions/action-searchName";
import { setFilterLoading } from "../../Redux/Actions/Actions-Functions/action-loading";
import FeedbackModal from "../FeedbackModal/FeedbackModal";
import style from './SearchBar.module.css';

const SearchBar = () => {
    const name = useSelector((state) => state.searchTerm || '');
    const dispatch = useDispatch();
    const [searchFeedback, setSearchFeedback] = useState(null);
    const lastSuccessfulSearch = useRef(name);

    const handleInputChange = (event) => {
        dispatch({
            type: SEARCH_NAME_INPUT,
            payload: event.target.value,
        });
    };

    const handleSearch = async (event) => {
        event.preventDefault();

        const searchedValue = name.trim();
        const result = await dispatch(searchName(name));

        if (result === true) {
            if (searchedValue) {
                lastSuccessfulSearch.current = searchedValue;
            }
            return;
        }

        if (result === "not-found") {
            // Restore the last successful search while the error modal is open.
            // This keeps the previous valid result visible to the user and avoids
            // replacing it with the invalid text that caused the failed search.
            dispatch({
                type: SEARCH_NAME_INPUT,
                payload: lastSuccessfulSearch.current,
            });

            setSearchFeedback({
                title: "Pokémon not found",
                message: `No Pokémon matching "${searchedValue}" exists.`,
            });
        }
    };

    const handleClear = async () => {
        await dispatch(searchName(''));
    };

    const handleSearchFeedbackConfirm = () => {
        // Keep the last successful search visible and end the cards loading only
        // after the user confirms the modal. Other filters remain untouched.
        dispatch({
            type: SEARCH_NAME_INPUT,
            payload: lastSuccessfulSearch.current,
        });
        dispatch(setFilterLoading(false));
        setSearchFeedback(null);
    };

    return (
        <>
            <form className={style.searchForm} onSubmit={handleSearch}>
                <div className={style.inputWrapper}>
                    <input
                        className={style.input}
                        onChange={handleInputChange}
                        placeholder="Search by name..."
                        type="text"
                        value={name}
                    />
                    {name && (
                        <button
                            className={style.clearButton}
                            type="button"
                            onClick={handleClear}
                            aria-label="Clear search"
                            title="Clear search"
                        >
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    )}
                </div>
                <button className={style.button} type="submit">SEARCH</button>
            </form>

            {searchFeedback && (
                <FeedbackModal
                    title={searchFeedback.title}
                    message={searchFeedback.message}
                    error
                    onConfirm={handleSearchFeedbackConfirm}
                />
            )}
        </>
    );
};

export default SearchBar;
