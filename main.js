// Import File
import httpRequest from "./utils/httpRequest.js";

// Import and initialize components
import { initAuthModal } from "./components/authModal.js";
import { initUserMenu } from "./components/userMenu.js";
import { LibraryPage } from "./components/libraryPage.js";
import { SortModal } from "./components/sortModal.js";
import { TrackMusic } from "./components/trackMusic.js";
import { initTooltip } from "./components/tooltip.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Khởi tạo tất cả components
  initAuthModal();
  initUserMenu();
  initTooltip();

  // Khởi tạo  LibraryPage and SortModal
  const libraryPage = new LibraryPage();
  await libraryPage.render();

  // Khởi tạo TrackMusic
  const trackMusic = new TrackMusic();
  await trackMusic._start();
  
  // Khởi tạo SortModal
  const sortModal = new SortModal();
  sortModal.init();
  
  // Handle playlists (example)
  // const hitsGrid = document.querySelector(".hits-grid");
  // const playlists = await httpRequest.get("playlists");
  // if (hitsGrid && playlists.data) {
  //   // Add your playlist handling logic here if needed
  //   console.log("Playlists:", playlists.data);
  // }
});