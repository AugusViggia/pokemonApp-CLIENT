import React from "react";
import style from './Page.module.css';
import { useState, useEffect } from "react";

const Page = ({ charactersPerPage, pokemons, paginated, initialPage = 1 }) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const pageNumbers = [];

    for (let i = 0; i < Math.ceil(pokemons.length / charactersPerPage); i++) {
        pageNumbers.push(i + 1);
    }

    useEffect(() => {
        const maxPage = Math.max(1, Math.ceil(pokemons.length / charactersPerPage));
        const safePage = Math.min(Math.max(initialPage, 1), maxPage);
        setCurrentPage(safePage);
    }, [initialPage, pokemons.length, charactersPerPage]);

    const paginatedHandler = (page) => {
        const safePage = Math.min(Math.max(page, 1), Math.max(pageNumbers.length, 1));
        setCurrentPage(safePage);
        paginated(safePage);
    };

    const maxPagesToShow = 5;

    const renderPageNumbers = () => {
        const firstPageToShow = currentPage <= maxPagesToShow ? 1 : currentPage - maxPagesToShow + 1;
        const lastPageToShow = Math.min(firstPageToShow + maxPagesToShow - 1, pageNumbers.length);

        return pageNumbers
            .slice(firstPageToShow - 1, lastPageToShow)
            .map((number) => (
                <li key={number} className={currentPage === number ? style.currentPage : undefined}>
                    <a onClick={() => paginatedHandler(number)}>{number}</a>
                </li>
            ));
    };

    const firstPage = 1;
    const lastPage = pageNumbers.length;
    const hasPages = lastPage > 0;

    return (
        <nav>
            <ul className={style.paginado}>
                <li className={style.navSlot}>
                    {hasPages ? (
                        <a
                            className={currentPage === firstPage ? style.disabled : undefined}
                            onClick={() => currentPage > firstPage && paginatedHandler(firstPage)}
                        >
                            First
                        </a>
                    ) : (
                        <span aria-hidden="true" />
                    )}
                </li>

                <li className={style.navSlot}>
                    {hasPages ? (
                        <a
                            className={currentPage === firstPage ? style.disabled : undefined}
                            onClick={() => currentPage > firstPage && paginatedHandler(currentPage - 1)}
                        >
                            Prev
                        </a>
                    ) : (
                        <span aria-hidden="true" />
                    )}
                </li>

                {renderPageNumbers()}

                <li className={style.navSlot}>
                    {hasPages ? (
                        <a
                            className={currentPage === lastPage ? style.disabled : undefined}
                            onClick={() => currentPage < lastPage && paginatedHandler(currentPage + 1)}
                        >
                            Next
                        </a>
                    ) : (
                        <span aria-hidden="true" />
                    )}
                </li>

                <li className={style.navSlot}>
                    {hasPages ? (
                        <a
                            className={currentPage === lastPage ? style.disabled : undefined}
                            onClick={() => currentPage < lastPage && paginatedHandler(lastPage)}
                        >
                            Last
                        </a>
                    ) : (
                        <span aria-hidden="true" />
                    )}
                </li>
            </ul>
        </nav>
    )
};

export default Page;
