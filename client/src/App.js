import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Landing from "./Views/Landing Page/Landing";
import Home from "./Views/Home/Home";
import Detail from "./Components/PokemonDetail/Detail";
import CreatePokemon from "./Components/PokemonCreator/CreatePokemon";
import Loading from "./Components/Loading/Loading";
import { getPokemons } from "./Redux/Actions/Actions-Functions/actions-pokemons";
import "./App.css";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const ROUTE_LOADING_MS = 800;

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const previousPath = useRef(location.pathname);
  const [routeLoading, setRouteLoading] = useState(false);

  // Make the site installable in browsers that support the native prompt.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const appUrl = new URL(process.env.PUBLIC_URL || ".", window.location.href);
    navigator.serviceWorker.register(new URL("service-worker.js", appUrl).toString()).catch(() => {});
  }, []);

  // Start the Pokémon catalog request as soon as the app mounts. Landing is
  // normally the first screen, so this loads while the user is there.
  useEffect(() => {
    dispatch(getPokemons({ silent: true })).catch(() => {});
  }, [dispatch]);

  // One place owns route-transition loading. It never waits on the route's
  // children, images, filters, or Redux loading state. Home refreshes only
  // when the route explicitly asks for a refresh.
  useEffect(() => {
    if (previousPath.current === location.pathname) return undefined;

    previousPath.current = location.pathname;
    let cancelled = false;
    setRouteLoading(true);

    const minDelay = new Promise((resolve) => {
      window.setTimeout(resolve, ROUTE_LOADING_MS);
    });

    const refreshOnEnter = location.state?.refreshOnEnter === true;
    const dataReady =
      location.pathname === "/home" && refreshOnEnter
        ? dispatch(getPokemons({ silent: true, force: true })).catch(() => null)
        : Promise.resolve();

    Promise.allSettled([minDelay, dataReady]).then(() => {
      if (!cancelled) setRouteLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [location.pathname, dispatch]);

  if (routeLoading) {
    return <Loading />;
  }

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
}

function App() {
  return <AppContent />;
}

export default App;
