import React from "react";
import style from "./Page.module.css";

const Page = ({ currentPage = 1, totalPages = 0, paginated, disabled = false }) => {
    const pageNumbers = Array.from({ length: Math.max(0, totalPages) }, (_, index) => index + 1);
    const maxPagesToShow = 5;
    const firstPageToShow = currentPage <= maxPagesToShow ? 1 : currentPage - maxPagesToShow + 1;
    const lastPageToShow = Math.min(firstPageToShow + maxPagesToShow - 1, totalPages);
    const visiblePages = pageNumbers.slice(firstPageToShow - 1, lastPageToShow);
    const hasPages = totalPages > 0;
    const goToPage = (page) => {
        const safePage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
        if (!disabled && safePage !== currentPage) paginated(safePage);
    };

    const renderLink = (label, page, isDisabled) => (
        <a
            aria-disabled={isDisabled || disabled}
            className={isDisabled || disabled ? style.disabled : undefined}
            onClick={() => !isDisabled && goToPage(page)}
        >
            {label}
        </a>
    );

    return (
        <nav aria-label="Paginación">
            <ul className={style.paginado}>
                <li className={style.navSlot}>{hasPages ? renderLink("First", 1, currentPage === 1) : <span />}</li>
                <li className={style.navSlot}>{hasPages ? renderLink("Prev", currentPage - 1, currentPage === 1) : <span />}</li>
                {visiblePages.map((number) => (
                    <li key={number} className={currentPage === number ? style.currentPage : undefined}>
                        <a aria-current={currentPage === number ? "page" : undefined} onClick={() => goToPage(number)}>{number}</a>
                    </li>
                ))}
                <li className={style.navSlot}>{hasPages ? renderLink("Next", currentPage + 1, currentPage === totalPages) : <span />}</li>
                <li className={style.navSlot}>{hasPages ? renderLink("Last", totalPages, currentPage === totalPages) : <span />}</li>
            </ul>
        </nav>
    );
};

export default Page;
