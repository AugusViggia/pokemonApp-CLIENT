import { useSelector } from "react-redux";
import { useState, useEffect, useRef, useMemo } from "react";
import Page from "../Paginated/Page";
import Card from "../PokemonCards/Cards";
import style from "./CardsContainer.module.css";
import FilterLoading from "../FilterLoading/FilterLoading";

const CardsContainer = ({ initialPage = 1, restoreScrollY = 0 }) => {
  const pokemons = useSelector((state) => state.pokemons || []);
  const filterLoading = useSelector((state) => state.filterLoading);
  const paginationResetKey = useSelector((state) => state.paginationResetKey || 0);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [imagesLoading, setImagesLoading] = useState(true);
  const restoredScroll = useRef(false);
  const charactersPerPage = 15;
  const indexOfLastCharacter = currentPage * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;

  const currentCharacters = useMemo(() => pokemons.slice(
    indexOfFirstCharacter,
    indexOfLastCharacter,
  ), [pokemons, indexOfFirstCharacter, indexOfLastCharacter]);

  const paginated = (pageNumber) => {
    setCurrentPage(pageNumber);
    setImagesLoading(true);
  };

  useEffect(() => {
    if (pokemons.length === 0) return;
    const maxPage = Math.max(1, Math.ceil(pokemons.length / charactersPerPage));
    setCurrentPage(Math.min(Math.max(initialPage, 1), maxPage));
  }, [initialPage, pokemons.length]);

  const previousResetKey = useRef(paginationResetKey);

  useEffect(() => {
    if (previousResetKey.current === paginationResetKey) return;
    previousResetKey.current = paginationResetKey;
    setCurrentPage(1);
    setImagesLoading(true);
  }, [paginationResetKey]);

  // Preload every image for the selected page before displaying the cards.
  // This avoids the page appearing with empty cards while images arrive one by one.
  useEffect(() => {
    if (currentCharacters.length === 0) {
      setImagesLoading(false);
      return undefined;
    }

    let cancelled = false;
    setImagesLoading(true);

    const imagePromises = currentCharacters.map((pokemon) => new Promise((resolve) => {
      if (!pokemon.image) {
        resolve();
        return;
      }

      const image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = pokemon.image;
    }));

    Promise.all(imagePromises).then(() => {
      if (!cancelled) setImagesLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [currentCharacters]);

  useEffect(() => {
    if (restoredScroll.current || !restoreScrollY || pokemons.length === 0 || imagesLoading) return;

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: restoreScrollY, behavior: "auto" });
      restoredScroll.current = true;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [restoreScrollY, currentPage, pokemons.length, imagesLoading]);

  useEffect(() => {
    if (currentCharacters.length === 0 && pokemons.length > 0) {
      setCurrentPage(Math.ceil(pokemons.length / charactersPerPage));
    }
  }, [currentCharacters.length, pokemons.length]);

  const skeletons = Array.from({ length: charactersPerPage }, (_, index) => index);

  return (
    <div className={style.cardsContainer}>
      <div className={style.cardsArea}>
        <div className={style.pageDiv}>
          <Page
            charactersPerPage={charactersPerPage}
            pokemons={pokemons}
            paginated={paginated}
            initialPage={currentPage}
          />
        </div>

        <div className={style.cards}>
          {imagesLoading
            ? skeletons.map((index) => (
                <div key={`skeleton-${index}`} className={style.cardDiv}>
                  <div className={style.cardSkeleton}>
                    <div className={style.imageSkeleton} />
                    <div className={style.textSkeleton} />
                    <div className={style.badgeSkeleton} />
                  </div>
                </div>
              ))
            : currentCharacters.map((pokemon, index) => {
                const capitalizedFirstLetter =
                  pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

                return (
                  <div key={pokemon.id} className={style.cardDiv}>
                    <Card
                      id={pokemon.id}
                      image={pokemon.image}
                      name={capitalizedFirstLetter}
                      types={pokemon.types}
                      attack={pokemon.attack}
                      created={pokemon.created}
                      customNumber={indexOfFirstCharacter + index + 1}
                      page={currentPage}
                    />
                  </div>
                );
              })}
        </div>

        {filterLoading && <FilterLoading />}
      </div>
    </div>
  );
};

export default CardsContainer;
