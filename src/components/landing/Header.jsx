import React, {useState} from 'react';
import logoImg from '../../images/logo_place_header.svg';
import '../../index.css';
import { Link, Routes, Route } from "react-router-dom";

export default function Header({ email, setLoggedIn }) {
    function logout() {
        localStorage.removeItem('token');
        setLoggedIn(false);
    }

    return(
        <Routes>
            <Route path="/"
            element={
                <header className="header">
                    <img src={logoImg} alt="лого Место" className="logo" />
                    <div className="header__auth">
                        <p className="header__auth-email">{email}</p>
                        <Link to="/sign-in" onClick={logout} className="header__auth-logout">Выход</Link>
                    </div>
                </header>
            }/>
            <Route path="/sign-in"
                   element={
                       <header className="header">
                           <img src={logoImg} alt="лого Место" className="logo" />
                           <Link to="/sign-up" className="header__auth">Регистрация</Link>
                       </header>
                   }/>
            <Route path="/sign-up"
                   element={
                       <header className="header">
                           <img src={logoImg} alt="лого Место" className="logo" />
                           <Link to="/sign-in" className="header__auth">Войти</Link>
                        </header>
            }/>
        </Routes>
    )
}
