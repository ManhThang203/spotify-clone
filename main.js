import "./components/header/index.js";
import "./components/authModal/index.js";
import "./components/main/index.js";
import "./components/playlistDetail/index.js";
import "./components/sidebar/sidebar.js";
import "./components/controller/controller.js";
import "./components/toast/toast.js";
import "./components/playlistHeader/playlistHeader.js";

// tạo 1 element là auth-modal
const authModal = document.createElement("auth-modal");
const playList = document.createElement("play-list");
const myPlaylistHeader = document.createElement("my-playlistheader");
const myHeader = document.querySelector("my-header");
const myHome = document.querySelector("my-home");
const myPlaylistheader = document.createElement("my-playlistheader");
// mở form đăng kí
document.addEventListener("open:signupModal", () => {
  authModal.open("signup");
});
// mở form đăng nhập
document.addEventListener("open:loginModal", () => {
  authModal.open("login");
});
document.addEventListener("navigateToPlaylist", (e) => {
  const { id, type } = e.detail;

  playList.setAttribute("data-id", id);
  playList.setAttribute("data-type", type);

  playList.open();
  myHome.close();
});
document.addEventListener("navigateToMyHome", () => {
  myHome.open();
  myHeader.open();
  playList.close();
  myPlaylistHeader.close();
});
document.addEventListener("open:playlistheader", () => {
  myPlaylistHeader.open();
  myHome.close();
  playList.close();
  myHeader.close();
});
