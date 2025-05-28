import Cookies from 'js-cookie';

class CookiesHelper {

    static getRefreshToken() {
        return Cookies.get(process.env.REACT_APP_REFRESH_TOKEN_NAME);
    }
    static setRefreshToken(token) {
        Cookies.set(process.env.REACT_APP_REFRESH_TOKEN_NAME, token, { expires: Number(process.env.REACT_APP_REFRESH_TOKEN_EXPIRE_TIME) }); // Set cookie for 9 hours
    }

    static removeRefreshToken() {
        Cookies.remove(process.env.REACT_APP_REFRESH_TOKEN_NAME);
    }
    static setCookie(name, value, options = {}) {
        Cookies.set(name, value, options);
    }

    static getCookie(name) {
        return Cookies.get(name);
    }

    static removeCookie(name) {
        Cookies.remove(name);
    }
}
export default CookiesHelper;