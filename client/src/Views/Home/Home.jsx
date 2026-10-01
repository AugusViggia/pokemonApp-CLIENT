import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import CardsContainer from "../../Components/CardsContainer/CardsContainer";
import NavBar from "../../Components/NavBar/NavBar";
import style from './Home.module.css';

const Home = () => {
    const location = useLocation();
    const restoreState = location.state?.restore || null;
    const [installPrompt, setInstallPrompt] = useState(null);
    const [installHelp, setInstallHelp] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);

    useEffect(() => {
      const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
      setIsInstalled(Boolean(standalone));
      const capturePrompt = (event) => {
        event.preventDefault();
        setInstallPrompt(event);
      };
      const installed = () => {
        setIsInstalled(true);
        setInstallPrompt(null);
        setInstallHelp(false);
      };
      window.addEventListener("beforeinstallprompt", capturePrompt);
      window.addEventListener("appinstalled", installed);
      return () => {
        window.removeEventListener("beforeinstallprompt", capturePrompt);
        window.removeEventListener("appinstalled", installed);
      };
    }, []);

    const installApp = async () => {
      if (!installPrompt) {
        setInstallHelp((visible) => !visible);
        return;
      }
      await installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === "accepted") setIsInstalled(true);
      setInstallPrompt(null);
    };

    return (
      <div className={style.home}>
        <header className={style.header}>
          <div>
            <p className={style.eyebrow}>Pokémon database</p>
            <h1 className={style.pokedex}>PokéDex</h1>
          </div>
          <div className={style.headerActions}>
            <p className={style.subtitle}>Discover, compare, and create your favorites.</p>
            {!isInstalled && <button type="button" className={style.installButton} onClick={installApp}>
              Instalar app
            </button>}
            {installHelp && <p className={style.installHelp} role="status">
              {/iphone|ipad|ipod/i.test(window.navigator.userAgent)
                ? "En Safari, toca Compartir y luego “Añadir a pantalla de inicio”."
                : "Abre el menú del navegador y elige “Instalar app” o “Añadir a pantalla de inicio”."}
            </p>}
          </div>
        </header>
        <div className={style.navBar}>
          <NavBar />
        </div>
        <CardsContainer
          initialPage={restoreState?.page || 1}
          restoreScrollY={restoreState?.scrollY || 0}
        />
        <div className={style.copyright}>
          Copyright&copy; {new Date().getFullYear()} All rights reserved
        </div>
      </div>
    );
};

export default Home;
