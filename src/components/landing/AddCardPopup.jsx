import React from "react";
import PopupWithForm from "./PopupWithForm";

export default function AddCardPopup({ isOpen, onClose, onAddCard }) {
    const [name, setName] = React.useState('');
    const [link, setLink] = React.useState('');

    React.useEffect(() => {
        setName(name);
        setLink(link)
    })

    function cleanInputs() {
        setName('')
        setLink('')
    }

    function handleSubmit() {
        onAddCard({
            name,
            link
        })
        cleanInputs()
    }

    function handleChangeName(e) {
        setName(e.target.value)
    }

    function handleChangeLink(e) {
        setLink(e.target.value)
    }

    function closeAddPopup() {
        onClose();
        cleanInputs();
    }

    return(
        <PopupWithForm
            title="Новое место"
            name="add"
            isOpen={isOpen}
            onClose={closeAddPopup}
            onSubmit={handleSubmit}
            buttonText='Создать'
            buttonTextLoading='Сохранение...'
        >
            <input id="title" className="popup__input popup__input_value_title" type="text" placeholder="Название"
                   name="name" minLength="2" maxLength="30" required value={name} onChange={handleChangeName} />
            <span id="title-error" className="popup__input-error" />
            <input id="link" className="popup__input popup__input_value_link" type="url"
                   placeholder="Ссылка на картинку" name="link" required value={link} onChange={handleChangeLink} />
            <span id="link-error" className="popup__input-error" />
        </PopupWithForm>
    )
}
