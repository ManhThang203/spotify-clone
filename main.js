import "./components/header/index.js";
import "./components/authModal/index.js";
import "./components/main/index.js";
import "./components/playlistDetail/index.js";
import "./components/sidebar/sidebar.js";
import "./components/controller/controller.js";
import "./components/toast/toast.js";

// tạo 1 element là auth-modal
const authModal = document.createElement("auth-modal");
const myHome = document.createElement("my-home");
// mở form đăng kí
document.addEventListener("open:signupModal", () => {
  authModal.open("signup");
});
// mở form đăng nhập
document.addEventListener("open:loginModal", () => {
  authModal.open("login");
});

document.addEventListener("logout:success", () => {
  myHome.open();
  myHome.close();
});
