import { useDispatch, useSelector } from "react-redux";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Page from "../Paginated/Page";
import Card from "../PokemonCards/Cards";
import style from "./CardsContainer.module.css";
import FilterLoading from "../FilterLoading/FilterLoading";
import { DEFAULT_POKEMON_PAGE_SIZE, getPokemons } from "../../Redux/Actions/Actions-Functions/actions-pokemons";

const CardsContainer = ({ initialPage = 1, restoreScrollY = 0 }) => {
  const dispatch = useDispatch();
  const pokemons = useSelector((state) => state.pokemons || []);
  const pagination = useSelector((state) => state.pagination || {});
  const pokemonPageLoading = useSelector((state) => state.pokemonPageLoading);
  const filterLoading = useSelector((state) => state.filterLoading);

  const [imagesLoading, setImagesLoading] = useState(true);
  const restoredScroll = useRef(false);
  const charactersPerPage = pagination.limit || DEFAULT_POKEMON_PAGE_SIZE;
  const currentPage = pagination.page || initialPage || 1;
  const currentCharacters = pokemons;
  const pageIsLoading = pokemonPageLoading || filterLoading;

  const paginated = (pageNumber) => {
    if (pageIsLoading || pageNumber === currentPage) return;
    setImagesLoading(true);
    dispatch(getPokemons({
      page: pageNumber,
      limit: charactersPerPage,
      silent: true,
    }));
  };

  useLayoutEffect(() => {
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
    if (restoredScroll.current || !restoreScrollY || pokemons.length === 0 || imagesLoading || pageIsLoading) return;

    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: restoreScrollY, behavior: "auto" });
      restoredScroll.current = true;
    });

    return () => window.cancelAnimationFrame(frame);
  }, [restoreScrollY, currentPage, pokemons.length, imagesLoading, pageIsLoading]);

  const skeletons = Array.from({ length: charactersPerPage }, (_, index) => index);

  return (
    <div className={style.cardsContainer}>
      <div className={style.cardsArea}>
        <div className={style.pageDiv}>
          <Page
            currentPage={currentPage}
            totalPages={pagination.totalPages || 0}
            paginated={paginated}
            disabled={pageIsLoading}
          />
        </div>

        <div className={style.cards}>
          {imagesLoading || pageIsLoading
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
                      customNumber={(currentPage - 1) * charactersPerPage + index + 1}
                      page={currentPage}
                    />
                  </div>
                );
              })}
        </div>

        {pageIsLoading && <FilterLoading />}
      </div>
    </div>
  );
};

export default CardsContainer;
