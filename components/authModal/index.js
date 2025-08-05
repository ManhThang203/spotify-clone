class AuthModal extends HTMLElement {
  modalOverlay;
  signupForm;
  loginForm;
  model = "login";
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  // Được gọi khi  được thêm vào Dom
  connectedCallback() {
    this.render();
  }
  // lấy ra elemnt
  getElements() {
    this.modalOverlay = this.shadowRoot.querySelector(".modal-overlay");
    this.signupForm = this.shadowRoot.querySelector("#signupForm");
    this.loginForm = this.shadowRoot.querySelector("#loginForm");
    this.showSignup = this.shadowRoot.querySelector("#showSignup");
    this.showLogin = this.shadowRoot.querySelector("#showLogin");
  }
  // lấy ra chuỗi html SignIn
  async getHTMLSignIn() {
    const res = await fetch("./components/authModal/authModal.html");
    const data = await res.text();
    return data;
  }

  async render() {
    const data = await this.getHTMLSignIn();
    this.shadowRoot.innerHTML = data;
    this.getElements();
    this.setListeners();
    this.showModal();
  }

  showModal() {
    // mặc định là none
    this.signupForm.style.display = "none";
    this.loginForm.style.display = "none";

    this.showSignup.addEventListener("click", () => {
      this.signupForm.style.display = "block";
      this.loginForm.style.display = "none";
    });
    this.showLogin.addEventListener("click", () => {
      this.loginForm.style.display = "block";
      this.signupForm.style.display = "none";
    });
    if (this.model === "signup") {
      this.signupForm.style.display = "block";
    } else {
      this.loginForm.style.display = "block";
    }
  }

  open(model) {
    this.model = model;
    document.body.appendChild(this);
  }

  close() {
    // this.remove();
    const modalContainer = this.shadowRoot.querySelector(".modal-container");
    if (modalContainer) {
      modalContainer.className = "modal-container hiden";
      // lắng nghe sự kiện animtion sẽ kết thúc
      modalContainer.addEventListener("animationend", () => {
        this.shadowRoot.innerHTML = "";
      });
    }
  }

  setListeners() {
    this.modalOverlay.addEventListener("click", (e) => {
      if (!e.target.closest(".modal-content")) {
        this.close();
      }
    });
  }
}

customElements.define("auth-modal", AuthModal);
