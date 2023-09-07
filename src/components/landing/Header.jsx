import React from 'react';
import logoImg from '../../images/logo_place_header.svg';
import '../../index.css';

export default function Header() {
    return(
        <header className="header">
            <img src={logoImg} alt="лого Место" className="logo" />
        </header>
    )
}
