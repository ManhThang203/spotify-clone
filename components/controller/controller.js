class Controller extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    this.style.visibility = "hidden";
    const html = await this.getHTMLString();
    // tạo 1 đối tượng DOMParser để phần tích html
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const linkEls = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    linkEls.forEach((l) => l.remove());

    const awaitLink = (href) => {
      return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.onload = resolve;
        link.onerror = () => reject(new Error(`Css faile : ${href}`));
        this.shadowRoot.appendChild(link);
      });
    };
    const hrefs = linkEls.map((l) => l.getAttribute("href"));
    await Promise.all(hrefs.map(awaitLink)); // đợi cho tất cả css loader song và gán phần từ vào awaitLink
    // thêm các marup còn thiếu
    const tpl = document.createElement("template");
    tpl.innerHTML = doc.body ? doc.body.innerHTML : html;
    const frag = tpl.content.cloneNode(true);
    this.shadowRoot.appendChild(frag);

    this.initTooltip(); // Gọi sau khi HTML được gán
    this.style.visibility = "visible";
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
