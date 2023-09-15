import React from 'react';
import Header from './landing/Header.jsx';
import Main from './landing/Main.jsx';
import Footer from './landing/Footer.jsx';
import '../index.css';
import PopupWithForm from "./landing/PopupWithForm";
import ImagePopup from "./landing/ImagePopup";
import { api } from "../utils/Api";
import { auth } from "../utils/Auth";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditProfilePopup from "./landing/EditProfilePopup";
import EditAvatarPopup from "./landing/EditAvatarPopup";
import AddCardPopup from "./landing/AddCardPopup";
import {Route, Routes, useNavigate} from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import imgAuthYes from '../images/auth_yes.png';
import imgAuthNo from '../images/auth_no.png';

function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
    const [isAddCardPopupOpen, setIsAddCardPopupOpen] = React.useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
    const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = React.useState({isOpen : false, card: {}});
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
    const [selectedCard, setSelectedCard] = React.useState({});
    const [currentUser, setCurrentUser] = React.useState("");
    const [cards, setCards] = React.useState([]);
    const [loggedIn, setLoggedIn] = React.useState(!!localStorage.getItem('token')); //содержит статус пользователя — вошёл он в систему или нет
    const [informationInfoTooltip, setInformationInfoTooltip] = React.useState({ img: null, msg: null });
    const navigate = useNavigate();

    //загрузка информации о пользователе и карточек с сервера
    React.useEffect(() => {
        Promise.all([api.getUserInfo(), api.getCardList()])
            .then(( [resultUser, resultCard] ) => {
                    setCurrentUser(resultUser)
                    setCards(resultCard)
            })
            .catch(err => console.log(`Ошибка загрузки с сервера: ${err}`))
    }, [])

    //загрузка новой информации о пользователе на сервер
    function handleUpdateUser({ name, about }) {
        api.patchUserInfo({ name, about })
            .then(resultUser => setCurrentUser(resultUser))
            .then(() => closeAllPopups())
            .catch(err => console.log(`Ошибка отправки данных о пользователе на сервер: ${err}`))
    }

    //загрузка нового аватара на сервер
    function handleUpdateAvatar({ avatar }) {
        api.updateUserAvatar({ avatar })
            .then(avatar => setCurrentUser(avatar))
            .then(() => closeAllPopups())
            .catch(err => console.log(`Ошибка обновления аватара: ${err}`))
    }

    //запрос на лайк/дизлайк карточки и получение обновленных данных карточки
    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        api.changeLikeCardStatus(card._id, !isLiked)
            .then(newCard => setCards(state => state.map(c => c._id === card._id ? newCard : c)))
            .catch(err => console.log(`Ошибка поддержки лайков/дизлайков: ${err}`))
    }

    //запрос на удаление карточки
    function handleCardDelete() {
        api.deleteCard(isDeleteCardPopupOpen.card._id)
            .then(() => setCards(cards => cards.filter(c => c._id !== isDeleteCardPopupOpen.card._id)))
            .then(() => closeAllPopups())
            .catch(err => console.log(`Ошибка удаления карточки: ${err}`))
    }

    //запрос на добавление новой карточки на сервер
    function handleAddCardSubmit({ name, link }) {
        api.addCard({ name, link })
            .then(newCard => setCards([newCard, ...cards]))
            .then(() => closeAllPopups())
            .catch(err => console.log(`Ошибка добавления новой карточки на сервер: ${err}`))
    }

    //регистрация
    function handleRegistration( email, password ) {
        auth.register( email, password )
            .then(res => {
                if (res) {
                    handleInformationInfoTooltip(imgAuthYes, 'Вы успешно зарегистрировались!')
                    handleInfoTooltipClick();
                    navigate('sign-in');
                } else {
                    handleInformationInfoTooltip(imgAuthNo, 'Что-то пошло не так! Попробуйте ещё раз.')
                    handleInfoTooltipClick();
                }
            })
            .catch(err => console.error(`Ошибка регистрации: ${err}`))
    }

    //авторизация
    function handleAuthorization( email, password ) {
        auth.authorize( email, password )
            .then(res => {
                if(res) {
                    setLoggedIn(true);
                    navigate('/');
                } else {
                    handleInformationInfoTooltip(imgAuthNo, 'Что-то пошло не так! Попробуйте ещё раз.')
                    handleInfoTooltipClick();
                }
            })
            .catch(err => {
                console.error(`Ошибка авторизации: ${err}`);
            })
    }

    function handleTokenCheck() {
        const token = localStorage.getItem('token');
        if(token) {
            return auth.checkToken(token)
                .then(status => status)
                .catch(err => console.log(`Ошибка запроса проверки токена: ${err}`))
        }
        return false;
    }

    //изменение картинки и сообщения в попапе InfoTooltip при регистрации и авторизации
    function handleInformationInfoTooltip(img, msg){
        setInformationInfoTooltip({ img: img, msg: msg })
    }

    //открытие popup InfoTooltip
    function handleInfoTooltipClick() {
        setIsInfoTooltipOpen(true)
    }

    //открытие popup edit avatar
    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true)
    }

    //открытие popup edit profile
    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true)
    }

    //открытие popup add card
    function handleAddCardClick() {
        setIsAddCardPopupOpen(true)
    }

    //открытие popup confirm delete card
    function handleConfirmDeleteCardClick(currentCard) {
        setIsDeleteCardPopupOpen({ isOpen: true, card: currentCard })
    }

    //открытие popup image
    function handleCardOpenClick(card) {
        setSelectedCard(card)
    }

    function closeAllPopups() {
        setIsEditProfilePopupOpen(false)
        setIsAddCardPopupOpen(false)
        setIsEditAvatarPopupOpen(false)
        setIsDeleteCardPopupOpen({isOpen: false, card: {}})
        setIsInfoTooltipOpen(false)
        setSelectedCard({})
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="page">
                <Header
                    loggedIn={loggedIn}
                    email={localStorage.getItem('email')}
                    setLoggedIn={setLoggedIn}
                />
                <Routes>
                    <Route
                        path='/'
                        element={ <ProtectedRoute
                            element={Main}
                            onEditProfile={handleEditProfileClick}
                            onAddCard={handleAddCardClick}
                            onEditAvatar={handleEditAvatarClick}
                            onCardOpenClick={handleCardOpenClick}
                            onConfirmDeleteCard={handleConfirmDeleteCardClick}
                            onCardLike={handleCardLike}
                            cards={cards}
                            loggedIn={loggedIn}
                            onCheckToken={handleTokenCheck}
                        />
                        }
                    />
                    <Route
                        path='/sign-in'
                        element={
                            <Login
                                onAuthorization={handleAuthorization}
                            />
                        }
                    />
                    <Route
                        path='/sign-up'
                        element={
                            <Register
                                onRegister={handleRegistration}
                            />
                        }
                    />
                </Routes>

                <Footer />

                <InfoTooltip
                    img={informationInfoTooltip.img}
                    title={informationInfoTooltip.msg}
                    isOpen={isInfoTooltipOpen}
                    onClose={closeAllPopups}
                />

                <PopupWithForm
                    title="Вы уверены?"
                    name="delete"
                    isOpen={isDeleteCardPopupOpen.isOpen}
                    onClose={closeAllPopups}
                    onSubmit={handleCardDelete}
                    buttonText='Да'
                    buttonTextLoading='Удаление...'
                />

                <EditProfilePopup
                    isOpen={isEditProfilePopupOpen}
                    onClose={closeAllPopups}
                    onUpdateUser={handleUpdateUser}
                />

                <EditAvatarPopup
                    isOpen={isEditAvatarPopupOpen}
                    onClose={closeAllPopups}
                    onUpdateAvatar={handleUpdateAvatar}
                />

                <AddCardPopup
                    isOpen={isAddCardPopupOpen}
                    onClose={closeAllPopups}
                    onAddCard={handleAddCardSubmit}
                />

                <ImagePopup
                    card={selectedCard}
                    isOpen={!!selectedCard.name}
                    onClose={closeAllPopups}
                />
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
