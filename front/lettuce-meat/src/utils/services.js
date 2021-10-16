import sha512 from "js-sha512";

export function isLogin() {
  let auth = window.sessionStorage.getItem("au_co");
  let uname = window.sessionStorage.getItem("login");
  let now = sha512(new Date().toISOString().slice(0, 10).toString());

  if (uname && auth === now) {
    return true;
  } else {
    return false;
  }
}

export function adjustCardNum(len) {
  if (window.innerWidth < 711) {
    if (len % 3 === 0) {
      return [3, Math.floor(len / 3)];
    } else {
      return [3, Math.ceil(len / 3)];
    }
  } else if (window.innerWidth < 1023) {
    if (len % 6 === 0) {
      return [6, Math.floor(len / 6)];
    } else {
      return [6, Math.ceil(len / 6)];
    }
  } else if (window.innerWidth < 1300) {
    if (len % 9 === 0) {
      return [9, Math.floor(len / 9)];
    } else {
      return [9, Math.ceil(len / 9)];
    }
  } else if (window.innerWidth < 1595) {
    if (len % 12 === 0) {
      return [12, Math.floor(len / 12)];
    } else {
      return [12, Math.ceil(len / 12)];
    }
  } else if (window.innerWidth < 1891) {
    if (len % 15 === 0) {
      return [15, Math.floor(len / 15)];
    } else {
      return [15, Math.ceil(len / 15)];
    }
  } else if (window.innerWidth < 2186) {
    if (len % 18 === 0) {
      return [18, Math.floor(len / 18)];
    } else {
      return [18, Math.ceil(len / 18)];
    }
  } else if (window.innerWidth < 2500) {
    if (len % 21 === 0) {
      return [21, Math.floor(len / 21)];
    } else {
      return [21, Math.ceil(len / 21)];
    }
  } else {
    if (len % 24 === 0) {
      return [24, Math.floor(len / 24)];
    } else {
      return [24, Math.ceil(len / 24)];
    }
  }
}
