class MyHeader extends HTMLElement {
  homeBtn;
  searchForm;
  signupBtn;
  signinBtn;
  userBtn;

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
    this.signinBtn = this.shadowRoot.querySelector(".login-btn")
    this.userBtn =   this.shadowRoot.querySelector("#userAvatar");
 
    this.signupBtn.addEventListener("click", () => this.openSignupModal());
    this.signinBtn.addEventListener("click", () => this.openloginModal());
    this.userBtn.addEventListener("click", () => this.openUserMenu());
  }

  openSignupModal() {
    document.dispatchEvent(new CustomEvent("open:signupModal"));
  }
   openloginModal() {
    document.dispatchEvent(new CustomEvent("open:loginModal"));
  }
  openUserMenu(){
    document.dispatchEvent(new CustomEvent("open:userMenu"))
  }
}

customElements.define("my-header", MyHeader);
