import { Route, Routes } from 'react-router-dom';
import Landing from './Views/Landing Page/Landing';
import  Home  from './Views/Home/Home';
import Detail from './Components/PokemonDetail/Detail';
import CreatePokemon from './Components/PokemonCreator/CreatePokemon';
import './App.css';

function App() {
  return (
    <div className="App">
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/home" element={<Home />} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/form" element={<CreatePokemon />} />
        </Routes>
    </div>
  );
};

export default App;