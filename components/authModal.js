const $ = document.querySelector.bind(document);

export function initAuthModal() {
  const signupBtn = $(".signup-btn");
  const loginBtn = $(".login-btn");
  const authModal = $("#authModal");
  const modalClose = $("#modalClose");
  const signupForm = $("#signupForm");
  const loginForm = $("#loginForm");
  const showLoginBtn = $("#showLogin");
  const showSignupBtn = $("#showSignup");

  function showSignupForm() {
    signupForm.style.display = "block";
    loginForm.style.display = "none";
  }

  function showLoginForm() {
    signupForm.style.display = "none";
    loginForm.style.display = "block";
  }

  function openModal() {
    authModal.classList.add("show");
    document.body.style.overflow = "hidden";
  }

  signupBtn?.addEventListener("click", () => {
    showSignupForm();
    openModal();
  });

  loginBtn?.addEventListener("click", () => {
    showLoginForm();
    openModal();
  });

  function closeModal() {
    authModal.classList.remove("show");
    document.body.style.overflow = "auto";
  }

  modalClose?.addEventListener("click", closeModal);
  authModal?.addEventListener("click", (e) => {
    if (e.target === authModal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && authModal?.classList.contains("show")) closeModal();
  });

  showLoginBtn?.addEventListener("click", showLoginForm);
  showSignupBtn?.addEventListener("click", showSignupForm);
}