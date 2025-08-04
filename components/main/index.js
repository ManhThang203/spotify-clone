class MyHome extends HTMLElement {
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
  }
  
  async getHTMLString() {
    const res = await fetch("./components/main/main.html");
    console.log(res);
    const data = await res.text();
    console.log(data);
    return data;
  }

}

customElements.define("my-home", MyHome);
