import React from 'react';
import logoImg from '../../images/logo_place_header.svg';
import '../../index.css';
import {Link, useLocation} from "react-router-dom";

export default function Header({ loggedIn, email, setLoggedIn }) {
    const location = useLocation();

    function logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        setLoggedIn(false);
    }

    return(
        <header className="header">
            <img src={logoImg} alt="лого Место" className="logo" />
            {loggedIn ?
                <div className="header__auth">
                    <p className="header__auth-email">{email}</p>
                    <Link to="/sign-in" onClick={logout} className="header__auth-logout">Выход</Link>
                </div>
                : (location.pathname === '/sign-in' ?
                    <Link to="/sign-up" className="header__auth">Регистрация</Link>
                    :
                    <Link to="/sign-in" className="header__auth">Войти</Link>
                )
            }
        </header>
    )
}
