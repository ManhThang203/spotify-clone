import "./components/header/index.js";
import "./components/authModal/index.js";
import "./components/main/index.js";
import "./components/playlist-detail/index.js";
import "./components/sidebar/sidebar.js";


const authModal = document.createElement("auth-modal");

document.addEventListener("open:signupModal", () => {
  authModal.open("signup");
});


document.addEventListener("open:loginModal", () => {
  authModal.open("login");

});