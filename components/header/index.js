class MyHeader extends HTMLElement {
  homeBtn;
  searchForm;
  signupBtn;
  signinBtn;
  userBtn;
  userDropdown;
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
    console.log(this.userDropdown);

    this.signupBtn.addEventListener("click", () => this.openSignupModal());
    this.signinBtn.addEventListener("click", () => this.openloginModal());
    this.userBtn.addEventListener("click", () => this.toggleMenu());
  }

  openSignupModal() {
    document.dispatchEvent(new CustomEvent("open:signupModal"));
  }
  openloginModal() {
    document.dispatchEvent(new CustomEvent("open:loginModal"));
  }
  toggleMenu() {
    this.userDropdown.classList.toggle("show");
  }
}

customElements.define("my-header", MyHeader);
