import httpRequest from "../../utils/httpRequest.js";

class MyHeader extends HTMLElement {
  homeBtn;
  searchForm;
  signupBtn;
  signinBtn;
  userBtn;
  userDropdown;
  authButtons;
  userName;
  headerAactions;
  isOpenMenu = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    const data = await this.getHTMLString();
    this.shadowRoot.innerHTML = data;
    this.setListeners();
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
    }
    this.hanndleSignUp();
    // document.addEventListener("signUp:success", () => {});
    this.hanndleSignUp();
  }

  async getHTMLString() {
    const res = await fetch("./components/header/header.html", {
      headers: {
        "Content-Type": "text/plain",
      },
    });
    const data = await res.text();
    return data;
  }

  setListeners() {
    this.signupBtn = this.shadowRoot.querySelector(".signup-btn");
    this.signinBtn = this.shadowRoot.querySelector(".login-btn");
    this.userBtn = this.shadowRoot.querySelector("#userAvatar");
    this.userDropdown = this.shadowRoot.querySelector("#userDropdown");
    this.userMenu = this.shadowRoot.querySelector(".user-menu");
    this.authButtons = this.shadowRoot.querySelector(".auth-buttons");
    this.userName = this.shadowRoot.querySelector(".user-name");
    this.avatarImg = this.userBtn.querySelector("img");

    this.signupBtn.addEventListener("click", () => this.openSignupModal());
    this.signinBtn.addEventListener("click", () => this.openloginModal());
    this.userBtn.addEventListener("click", () => this.toggleMenu());

    this.userBtn.addEventListener("mouseenter", () => {
      this.userName.classList.add("active");
    });

    this.userBtn.addEventListener("mouseleave", () => {
      this.userName.classList.remove("active");
    });
  }

  openSignupModal() {
    document.dispatchEvent(new CustomEvent("open:signupModal"));
  }
  openloginModal() {
    document.dispatchEvent(new CustomEvent("open:loginModal"));
  }
  toggleMenu() {
    this.userDropdown.classList.toggle("show");

    document.addEventListener("click", (e) => {
      // composedPath sẽ trả về 1 mảng chứa tất cả các phàn từ đã đi quá
      const isUserMenu = e.composedPath().includes(this.userMenu);
      if (!isUserMenu) {
        this.userDropdown.classList.remove("show");
      }
    });
  }
  // xử lý đăng nhập
  async hanndleSignUp() {
    try {
      const { user } = await httpRequest.get("users/me");
      console.log(user);
      if (user.display_name) {
        this.userName.textContent = user.display_name;
      }
      if (user.avatar_url) {
        this.avatarImg.src = user.avatar_url;
      }
    } catch (error) {
      this.authButtons.classList.add("show");
      this.userBtn.remove();
      this.userName.remove();
    }
  }
}

customElements.define("my-header", MyHeader);
