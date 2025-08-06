import httpRequest from "../../utils/httpRequest.js";
class AuthModal extends HTMLElement {
  modalOverlay;
  signupForm;
  loginForm;
  signupUserName;
  signupEmail;
  signupPassword;
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
    this.signupUserName = this.shadowRoot.querySelector("#signupUserName");
    this.signupEmail = this.shadowRoot.querySelector("#signupEmail");
    this.signupPassword = this.shadowRoot.querySelector("#signupPassword");
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

    // đăng kí
    this.signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      this.close();
      const display_name = this.signupUserName.value;
      const email = this.signupEmail.value;
      const password = this.signupPassword.value;

      const credentials = {
        display_name,
        email,
        password,
      };
      try {
        const { user, access_token } = await httpRequest.post(
          "auth/register",
          credentials
        );
        localStorage.setItem("accessToken", access_token);
      } catch (error) {
        console.dir(error);
        if (error?.response?.error?.code === "VALIDATION_ERROR") {
          const details = error.response.error.details;
          if (details && details.length > 0) {
            console.log(details[0].message);
          } else {
            console.log("Validation failed but no details provided");
          }
        }
      }
    });
  }
}

customElements.define("auth-modal", AuthModal);
