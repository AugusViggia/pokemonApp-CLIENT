import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Landing from "./Views/Landing Page/Landing";
import Home from "./Views/Home/Home";
import Detail from "./Components/PokemonDetail/Detail";
import CreatePokemon from "./Components/PokemonCreator/CreatePokemon";
import Loading from "./Components/Loading/Loading";
import { getPokemonDetails, getPokemons } from "./Redux/Actions/Actions-Functions/actions-pokemons";
import { getTypes } from "./Redux/Actions/Actions-Functions/actions-pokemonTypes";
import "./App.css";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const ROUTE_LOADING_MS = 800;

const isDataRoute = (pathname) =>
  pathname === "/home" || pathname === "/form" || pathname.startsWith("/detail/");

const detailHasId = (details, id) => {
  const detail = Array.isArray(details) ? details[0] : details;
  return detail?.id != null && String(detail.id) === String(id);
};

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const pokemons = useSelector((state) => state.pokemons);
  const pagination = useSelector((state) => state.pagination);
  const types = useSelector((state) => state.types);
  const details = useSelector((state) => state.details);
  const previousPath = useRef(null);
  const activeLoadingTask = useRef(null);
  const [routeLoading, setRouteLoading] = useState(() => isDataRoute(location.pathname));

  // Make the site installable in browsers that support the native prompt.
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    const appUrl = new URL(process.env.PUBLIC_URL || ".", window.location.href);
    navigator.serviceWorker.register(new URL("service-worker.js", appUrl).toString()).catch(() => {});
  }, []);

  // Load only the data required by the destination, in parallel when possible.
  useLayoutEffect(() => {
    const isInitialRoute = previousPath.current === null;
    const previousPathname = previousPath.current;
    previousPath.current = location.pathname;

    if (!isDataRoute(location.pathname)) {
      activeLoadingTask.current = null;
      setRouteLoading(false);
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
    const requests = [];
    const shouldRefreshHome = location.state?.refreshOnEnter === true || location.state?.triggerHomeLoading === true;

    if (location.pathname === "/home") {
      const page = location.state?.restore?.page || 1;
      const hasRequestedPage = Array.isArray(pokemons) && pokemons.length > 0 && pagination?.page === page;
      if (shouldRefreshHome || !hasRequestedPage) {
        requests.push(dispatch(getPokemons({ page, silent: true, force: shouldRefreshHome })));
      }
      if (!Array.isArray(types) || types.length === 0) requests.push(dispatch(getTypes()));
    } else if (location.pathname.startsWith("/detail/")) {
      const id = location.pathname.slice("/detail/".length);
      if (!detailHasId(details, id)) requests.push(dispatch(getPokemonDetails(id)));
    } else if (location.pathname === "/form" && (!Array.isArray(types) || types.length === 0)) {
      requests.push(dispatch(getTypes()));
    }

    const dataReady = Promise.allSettled(requests);

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
  }, [location.pathname, location.state, dispatch, pokemons, pagination, types, details]);

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
