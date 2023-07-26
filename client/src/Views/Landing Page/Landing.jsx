import style from './Landing.module.css';
import { Link } from 'react-router-dom';

const Landing = () => {

    return (
        <div className={style.container}>
            <div className={style.title}>
                <p>PokéDeX APP</p>
            </div>
            <div className={style.linkList}>
                <Link className={style.button} to='/home'>POWER</Link>
            </div>
        </div>
    )
};

export default Landing;