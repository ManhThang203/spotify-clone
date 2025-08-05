class Menu extends HTMLElement {
  userMenu;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  getElements() {
    this.userMenu = this.shadowRoot.querySelector("#userDropdown");
    console.log(this.userMenu);
  }
  open() {
    // this.userMenu.classList.add("show");
    document.body.appendChild(this);
  }
  setListeners() {}
  async render() {
    const data = await this.getHTMLString();
    this.shadowRoot.innerHTML = data;
    this.getElements();
    this.setListeners();
  }
  async getHTMLString() {
    const res = await fetch("./components/userMenu/userMenu.html");
    const data = await res.text();
    return data;
  }
}

customElements.define("user-menu", Menu);
