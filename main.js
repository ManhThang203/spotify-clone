// Import File
import httpRequest from "./utils/httpRequest.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
  // Get DOM elements
  const signupBtn = document.querySelector(".signup-btn");
  const loginBtn = document.querySelector(".login-btn");
  const authModal = document.getElementById("authModal");
  const modalClose = document.getElementById("modalClose");
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const showLoginBtn = document.getElementById("showLogin");
  const showSignupBtn = document.getElementById("showSignup");

  // Function to show signup form
  function showSignupForm() {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
  }

  // Function to show login form
  function showLoginForm() {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  }

  // Function to open modal
  function openModal() {
    authModal.classList.add("show");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }

  // Open modal with Sign Up form when clicking Sign Up button
  signupBtn.addEventListener("click", function () {
    showSignupForm();
    openModal();
  });

  // Open modal with Login form when clicking Login button
  loginBtn.addEventListener("click", function () {
    showLoginForm();
    openModal();
  });

  // Close modal function
  function closeModal() {
    authModal.classList.remove("show");
    document.body.style.overflow = "auto"; // Restore scrolling
  }

  // Close modal when clicking close button
  modalClose.addEventListener("click", closeModal);

  // Close modal when clicking overlay (outside modal container)
  authModal.addEventListener("click", function (e) {
    if (e.target === authModal) {
      closeModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && authModal.classList.contains("show")) {
      closeModal();
    }
  });

  // Switch to Login form
  showLoginBtn.addEventListener("click", function () {
    showLoginForm();
  });

  // Switch to Signup form
  showSignupBtn.addEventListener("click", function () {
    showSignupForm();
  });
});

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
  const userAvatar = document.getElementById("userAvatar");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  // Toggle dropdown when clicking avatar
  userAvatar.addEventListener("click", function (e) {
    e.stopPropagation();
    userDropdown.classList.toggle("show");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", function (e) {
    if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
      userDropdown.classList.remove("show");
    }
  });

  // Close dropdown when pressing Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && userDropdown.classList.contains("show")) {
      userDropdown.classList.remove("show");
    }
  });

  // Handle logout button click
  logoutBtn.addEventListener("click", function () {
    // Close dropdown first
    userDropdown.classList.remove("show");

    console.log("Logout clicked");
    // TODO: Students will implement logout logic here
  });
});

// Other functionality
document.addEventListener("DOMContentLoaded", async () => {
  const libraryContent = document.querySelector(".library-content");
  const artistsGrid = document.querySelector(".artists-grid");
  // TODO: Implement other functionality here
  const { artists, pagination } = await httpRequest.get("artists");
  console.log(artists);
  const likeSongsHtml = `
   <div class="library-item active">
            <div class="item-icon liked-songs">
                <i class="fas fa-heart"></i>
            </div>
            <div class="item-info">
                <div class="item-title">Liked Songs</div>
                <div class="item-subtitle">
                    <i class="fas fa-thumbtack"></i>
                    Playlist • 3 songs
                </div>
            </div>
        </div>
  `;
  const htmlArtist = artists
    .map(
      (aritist) => `
        <div class="library-item">
            <img
                src="${aritist.image_url}"
                alt="${aritist.name}"
                class="item-image"
            />
            <div class="item-info">
                <div class="item-title">${aritist.name}</div>
                <div class="item-subtitle">Artist</div>
            </div>
        </div>
  `
    )
    .join("");
  const htmlArtistsGrid = artists
    .map(
      (aritist) => `
    <div class="artist-card">
        <div class="artist-card-cover">
            <img
                src="${aritist.image_url}"
                alt="${aritist.name}"
            />
            <button class="artist-play-btn">
                <i class="fas fa-play"></i>
            </button>
        </div>
        <div class="artist-card-info">
            <h3 class="artist-card-name">${aritist.name}</h3>
            <p class="artist-card-type">${aritist.bio}</p>
        </div>
    </div>
  `
    )
    .join("");

  libraryContent.innerHTML = likeSongsHtml + htmlArtist;
  artistsGrid.innerHTML = htmlArtistsGrid;
});
//
document.addEventListener("DOMContentLoaded", async () => {
  const hitsGrid = document.querySelector(".hits-grid");
  const playlists = await httpRequest.get("playlists");
  console.log(playlists);
});
// Chức năng mở Tooltip
document.addEventListener("DOMContentLoaded", function () {
  const attachTooltip = (btnSelecter, tooltipSelecter) => {
    const btn = $(btnSelecter);
    const tooltip = $(tooltipSelecter);
    if (btn && tooltip) {
      btn.addEventListener("mouseenter", () => {
        tooltip.classList.add("active");
      });

      btn.addEventListener("mouseleave", () => {
        tooltip.classList.remove("active");
      });

    }
  };
  attachTooltip("#btn-ramdom", "#tooltip-random");
  attachTooltip("#btn-prev", "#tooltip-prev");
  attachTooltip("#btn-pause", "#tooltip-pause");
  attachTooltip("#btn-next", "#tooltip-next");
  attachTooltip("#btn-loop", "#tooltip-loop");
  attachTooltip("#btn-song", "#tooltip-song");
  attachTooltip("#btn-sound", "#tooltip-sound");
  attachTooltip("#btn-full_screen", "#tooltip-full_screen");
  attachTooltip("#btn-like_song", "#tooltip-like_song");
  attachTooltip("#btn-home", "#tooltip-home");
  attachTooltip("#btn-search_library", "#tooltip-search_library");
  attachTooltip("#btn-create", "#tooltip-create");
});
