class MyHome extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.getElements();
  }
  getElements() {
    this.contentWrapper = this.shadowRoot.querySelector(".content-wrapper");
    console.log(this.contentWrapper);
  }
  async render() {
    const data = await this.getHTMLString();
    this.shadowRoot.innerHTML = data;
  }

  async getHTMLString() {
    const res = await fetch("./components/main/main.html");
    const data = await res.text();
    return data;
  }
  open() {
    document.querySelector(".content-wrapper").prepend(this);
  }
  close() {
    this.remove(this);
  }
}

customElements.define("my-home", MyHome);
