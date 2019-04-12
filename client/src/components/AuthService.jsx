import decode from 'jwt-decode';

export default class AuthService {
    constructor(domain) {
        this.domain = domain || 'http://localhost:8081';
        this.fetch = this.fetch.bind(this);
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
        this.verify = this.verify.bind(this);
    }

    login(username, password) {
        return this.fetch(`${this.domain}/get_token`, {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            })
        }).then(res => {
            this.setToken(res.token);
            return Promise.resolve(res);
        })
    }

    verify() {
        return this.fetch(`${this.domain}/verify_token`, {
            method: 'POST',
            body: JSON.stringify({
                token: this.getToken()
            })
        }).then(res => {
            return Promise.resolve(res);
        })
    }

    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            return decoded.exp < Date.now() / 1000;
        }
        catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        localStorage.setItem('id_token', idToken)
    }

    getToken() {
        return localStorage.getItem('id_token')
    }

    logout() {
        localStorage.removeItem('id_token');
    }

    getProfile() {
        return decode(this.getToken());
    }


    fetch(url, options) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (this.loggedIn()) {
            headers['Authorization'] = 'Bearer ' + this.getToken()
        }

        return fetch(url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
            return response
        } else {
            const error = new Error(response.statusText);
            error.response = response;
            throw error
        }
    }
}
