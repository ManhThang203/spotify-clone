class Controller extends HTMLElement {
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
    this.initTooltip(); // Gọi sau khi HTML được gán
  }

  async getHTMLString() {
    const res = await fetch("./components/controller/controller.html");
    const data = await res.text();
    return data;
  }

  // Gắn tooltip cho các nút trong shadowRoot
  initTooltip() {
    const attachTooltip = (btnSelector, tooltipSelector) => {
      const btn = this.shadowRoot.querySelector(btnSelector);
      const tooltip = this.shadowRoot.querySelector(tooltipSelector);
      if (btn && tooltip) {
        btn.addEventListener("mouseenter", () => {
          tooltip.classList.add("active");
        });
        btn.addEventListener("mouseleave", () => {
          tooltip.classList.remove("active");
        });
      }
    };

    attachTooltip(".btn-Shuffle", ".tooltip-Shuffle");
    attachTooltip(".btn-prev", ".tooltip-prev");
    attachTooltip(".play-btn", ".tooltip-play");
    attachTooltip(".btn-next", ".tooltip-next");
    attachTooltip(".btn-loop", ".tooltip-loop");
    attachTooltip(".btn-voice", ".tooltip-voice");
    attachTooltip(".btn-noice", ".tooltip-noice");
    attachTooltip(".btn-screen", ".tooltip-screen");
    attachTooltip(".add-btn", ".tooltip-add");
  }
}

customElements.define("my-controller", Controller);
