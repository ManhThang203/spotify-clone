import "./components/header/index.js";
import "./components/authModal/index.js";
import "./components/main/index.js";
import "./components/playlist-detail/index.js";
import "./components/sidebar/sidebar.js";
import "./components/controller/controller.js";
import "./components/userMenu/userMenu.js";

// tạo 1 element là auth-modal
const authModal = document.createElement("auth-modal");
const userMenu = document.createElement("user-menu");

// mở form đăng kí
document.addEventListener("open:signupModal", () => {
  authModal.open("signup");
});
// mở form đăng nhập
document.addEventListener("open:loginModal", () => {
  authModal.open("login");
});
// mở User Menu
document.addEventListener("open:userMenu", () => {
 userMenu.open();
 console.log(123);
})