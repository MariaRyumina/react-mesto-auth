class Auth {
    constructor({ baseUrl }) {
        this._baseUrl = baseUrl;
    }

    register( email, password ) {
        return fetch(`${this._baseUrl}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "email": email, "password": password })
        })
        .then(res => res.ok ? res.json() : null)
    }

    authorize( email, password ) {
        return fetch(`${this._baseUrl}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "email": email, "password": password })
        })
            .then(res => res.ok ? res.json() : null)
            .then((data) => {
                if (data != null && data.token) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('email', email);
                    return true;
                }
            })
    }

    //запрос для проверки валидности токена и получения email для вставки в шапку сайта
    checkToken(token) {
        return fetch(`${this._baseUrl}/users/me`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization" : `Bearer ${token}`
            }
        })
            .then(res => res.ok)
    }
}

export const auth = new Auth ({
    baseUrl: 'https://auth.nomoreparties.co'
})
