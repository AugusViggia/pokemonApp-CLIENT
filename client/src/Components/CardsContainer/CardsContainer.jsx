import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import Page from '../Paginated/Page';
import Card from '../PokemonCards/Cards';
import style from './CardsContainer.module.css';

const CardsContainer = () => {
  const pokemons = useSelector(state => state.pokemons);

  const [currentPage, setCurrentPage] = useState(1);
  const charactersPerPage = 12;
  const indexOfLastCharacter = currentPage * charactersPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - charactersPerPage;
  
  const paginated = (pageNumber) => {
    setCurrentPage(pageNumber)
  };

  const currentCharacters = pokemons.slice(indexOfFirstCharacter, indexOfLastCharacter);

  useEffect(() => {
    if (currentCharacters.length === 0 && pokemons.length > 0) {
      const newPage = Math.ceil(pokemons.length / charactersPerPage);
      setCurrentPage(newPage);
    }
  }, [currentCharacters, pokemons, charactersPerPage]);

  return (
    <div className={style.cardsContainer}>
      <div className={style.pageDiv}>
        <Page
          charactersPerPage={charactersPerPage}
          pokemons={pokemons}
          paginated={paginated}
        />
      </div>
      <div className={style.cards}>
        {currentCharacters?.map(pokemon => {
          const capitalizedFirstLetter = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

          return (
            <div key={pokemon.id} className={style.cardDiv}>
              <Card
                key={pokemon.id}
                id={pokemon.id}
                image={pokemon.image}
                name={capitalizedFirstLetter}
                types={pokemon.types}
                attack={pokemon.attack}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
};

export default CardsContainer;