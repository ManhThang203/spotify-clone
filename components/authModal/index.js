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
    this.formGroup = this.signupForm.querySelectorAll(".form-group");
    this.loginForm = this.shadowRoot.querySelector("#loginForm");
    this.loginEmail = this.shadowRoot.querySelector("#loginEmail");
    this.loginPassword = this.shadowRoot.querySelector("#loginPassword");
    this.formInfo = this.shadowRoot.querySelector(".form-info");
    this.signupEyeIcon = this.shadowRoot.querySelector("#signupEyeIcon");
    this.loginEyeIcon = this.shadowRoot.querySelector("#loginEyeIcon");

    this.signupUserName.addEventListener("input", () => {
      const isHollow = this.signupUserName.value.trim() !== "";
      if (isHollow) {
        this.signupUserName.closest(".form-group").classList.remove("invalid");
      } else {
        this.signupUserName.closest(".form-group").classList.add("invalid");
      }
    });
    this.signupEmail.addEventListener("input", () => {
      //  /^[^\s@]+@[^\s@]+\.[^\s@]+$/ định dạnh email
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.signupEmail.value);
      if (isEmail) {
        this.signupEmail.closest(".form-group").classList.remove("invalid");
      } else {
        this.signupEmail.closest(".form-group").classList.add("invalid");
      }
    });
    this.signupPassword.addEventListener("input", () => {
      const isPassword = this.signupPassword.value.length > 6;
      if (isPassword) {
        this.signupPassword.closest(".form-group").classList.remove("invalid");
      } else {
        this.signupPassword.closest(".form-group").classList.add("invalid");
      }
    });

    this.loginEmail.addEventListener("input", () => {
      //  /^[^\s@]+@[^\s@]+\.[^\s@]+$/ định dạnh email
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.loginEmail.value);
      if (isEmail) {
        this.loginEmail.closest(".form-group").classList.remove("invalid");
      } else {
        this.loginEmail.closest(".form-group").classList.add("invalid");
      }
    });
    this.loginPassword.addEventListener("input", () => {
      const isPassword = this.loginPassword.value.length > 6;
      if (isPassword) {
        this.loginPassword.closest(".form-group").classList.remove("invalid");
      } else {
        this.loginPassword.closest(".form-group").classList.add("invalid");
      }
    });
    this.signupEyeIcon.addEventListener("click", () => {
      this.togglPasword(this.signupPassword, this.signupEyeIcon);
    });
    this.loginEyeIcon.addEventListener("click", () => {
      this.togglPasword(this.loginPassword, this.loginEyeIcon);
    });
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
    // this.handleSignup();
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

    // khi bấm vào nút submit đăng kí
    this.signupForm.addEventListener("submit", (e) => {
      this.handleSignup(e);
    });
    // khi bấm vào nút submit đăng nhập
    this.loginForm.addEventListener("submit", (e) => {
      this.handleLogin(e);
    });
  }
  // hàm xử lý đăng kí
  handleSignup = async (e) => {
    e.preventDefault();
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
      // khi đanh ksi thành công
      document.dispatchEvent(new CustomEvent("signUp:success"));
      this.close();
    } catch (error) {
      console.dir(error);
      if (error?.response?.error?.code === "VALIDATION_ERROR") {
        const details = error.response.error.details;
        if (details) {
          details.forEach((d) => {
            const { field, message } = d;
            let inputElement;
            switch (field) {
              case "display_name":
                inputElement = this.signupUserName;
                break;
              case "email":
                inputElement = this.signupEmail;
                break;
              case "password":
                inputElement = this.signupPassword;
                break;
              default:
                break;
            }
            if (inputElement) {
              const group = inputElement.closest(".form-group");
              group.classList.add("invalid");
              const errorMessengerSpan = group.querySelector("span");
              errorMessengerSpan.textContent = message;
            }
          });
        }
      } else if (error?.response?.error?.code === "EMAIL_EXISTS") {
        const message = error.response.error.message;
        const group = this.signupEmail.closest(".form-group");
        group.classList.add("invalid");
        const errorEmailSpan = group.querySelector("span");
        errorEmailSpan.textContent = message;
      }
    }
  };
  // hàm sử lý đăng nhập
  handleLogin = async (e) => {
    e.preventDefault();
    const email = this.loginEmail.value;
    const password = this.loginPassword.value;
    const credentials = {
      email,
      password,
    };
    try {
      const { user, access_token } = await httpRequest.post(
        "auth/login",
        credentials
      );
      localStorage.setItem("accessToken", access_token);
      // khi đanh ksi thành công
      document.dispatchEvent(new CustomEvent("login:success"));
      this.close();
    } catch (error) {
      console.dir(error);
      if (error?.response?.error?.code === "VALIDATION_ERROR") {
        const details = error.response.error.details;
        if (details) {
          details.forEach((d) => {
            const { field, message } = d;
            let inputElement;
            switch (field) {
              case "email":
                inputElement = this.loginEmail;
                break;
              case "password":
                inputElement = this.loginPassword;
                break;
              default:
                break;
            }
            if (inputElement) {
              const group = inputElement.closest(".form-group");
              group.classList.add("invalid");
              const errorMessengerSpan = group.querySelector("span");
              errorMessengerSpan.textContent = message;
            }
          });
        }
      }
    }
  };
  // xử lý bấm hiện mật khẩu
  togglPasword(paswordInput, eyesicon) {
    const isHiddenPassword = paswordInput.type === "password";
    paswordInput.type = isHiddenPassword ? "text" : "password";
    eyesicon.className = isHiddenPassword
      ? "fa-regular fa-eye eye-icon"
      : "fa-regular fa-eye-slash eye-icon";
  }
}

customElements.define("auth-modal", AuthModal);
