import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Landing from "./Views/Landing Page/Landing";
import Home from "./Views/Home/Home";
import Detail from "./Components/PokemonDetail/Detail";
import CreatePokemon from "./Components/PokemonCreator/CreatePokemon";
import Loading from "./Components/Loading/Loading";
import { getPokemons } from "./Redux/Actions/Actions-Functions/actions-pokemons";
import { getTypes } from "./Redux/Actions/Actions-Functions/actions-pokemonTypes";
import "./App.css";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const ROUTE_LOADING_MS = 800;

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const previousPath = useRef(null);
  const activeLoadingTask = useRef(null);
  const [routeLoading, setRouteLoading] = useState(location.pathname === "/home");

  // Make the site installable in browsers that support the native prompt.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const appUrl = new URL(process.env.PUBLIC_URL || ".", window.location.href);
    navigator.serviceWorker.register(new URL("service-worker.js", appUrl).toString()).catch(() => {});
  }, []);

  // Keep the existing catalog prefetch on the landing page. When Home is
  // entered, wait for both requests it needs before ending the route loader.
  useEffect(() => {
    const isInitialRoute = previousPath.current === null;
    const previousPathname = previousPath.current;
    previousPath.current = location.pathname;

    const enteringHome =
      location.pathname === "/home" &&
      (isInitialRoute || previousPathname !== location.pathname);

    if (isInitialRoute && !enteringHome) {
      dispatch(getPokemons({ silent: true })).catch(() => {});
      return undefined;
    }

    if (!isInitialRoute && previousPathname === location.pathname) {
      // React StrictMode replays effects in development. Reuse the same
      // pending task after its cleanup instead of starting duplicate requests.
      const pendingTask = activeLoadingTask.current;
      if (pendingTask?.pathname === location.pathname && pendingTask.cancelled) {
        pendingTask.cancelled = false;
        return () => {
          pendingTask.cancelled = true;
        };
      }
      return undefined;
    }

    const loadingTask = { pathname: location.pathname, cancelled: false };
    activeLoadingTask.current = loadingTask;
    setRouteLoading(true);

    const minDuration = new Promise((resolve) => {
      window.setTimeout(resolve, ROUTE_LOADING_MS);
    });
    const dataReady = enteringHome
      ? Promise.allSettled([
          dispatch(getPokemons({
            silent: true,
            force: location.state?.refreshOnEnter === true,
          })),
          dispatch(getTypes()),
        ])
      : Promise.resolve();

    Promise.all([minDuration, dataReady]).then(() => {
      if (!loadingTask.cancelled) {
        setRouteLoading(false);
        if (activeLoadingTask.current === loadingTask) {
          activeLoadingTask.current = null;
        }
      }
    });

    return () => {
      loadingTask.cancelled = true;
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
