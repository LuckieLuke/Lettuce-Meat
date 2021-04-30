import sha512 from 'js-sha512'

export function isLogin() {
    let auth = window.localStorage.getItem('au_co')
    let uname = window.localStorage.getItem('login')
    let now = sha512((new Date().toISOString().slice(0, 10)).toString())

    if (uname && auth === now) {
        return true
    } else {
        return false
    }
}