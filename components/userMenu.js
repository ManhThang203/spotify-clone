const $ = document.querySelector.bind(document);

export function initUserMenu() {
  const userAvatar = $("#userAvatar");
  const userDropdown = $("#userDropdown");
  const logoutBtn = $("#logoutBtn");

  userAvatar?.addEventListener("click", (e) => {
    e.stopPropagation();
    userDropdown?.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!userAvatar?.contains(e.target) && !userDropdown?.contains(e.target)) {
      userDropdown?.classList.remove("show");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && userDropdown?.classList.contains("show")) {
      userDropdown.classList.remove("show");
    }
  });

  logoutBtn?.addEventListener("click", () => {
    userDropdown?.classList.remove("show");
    console.log("Logout clicked");
    // TODO: Implement logout logic
  });
}