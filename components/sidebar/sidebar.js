import httpRequest from "../../utils/httpRequest.js";

class sidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  setListeners() {
    this.sortBtn = this.shadowRoot.querySelector("#sort-btn");
    this.sortForm = this.shadowRoot.querySelector("#sort-form");
    this.sortContentDiv = this.shadowRoot.querySelectorAll("#sort-content div");
    this.sortContentIcon = this.shadowRoot.querySelectorAll(
      "#sort-content div i"
    );
    this.buttonForm = this.shadowRoot.querySelectorAll("#content button");
    this.buttonFormIcon = this.shadowRoot.querySelectorAll("#content button i");
    this.libraryContent = this.shadowRoot.querySelector("#library-content");
    this.btnNear = this.shadowRoot.querySelector("#btn-near");
    this.btnHamburger = this.shadowRoot.querySelector("#btn-hamburger");

    this.sortBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggleMenuSort();
    });
    document.addEventListener("click", (e) => {
      const isSortForm = e.composedPath().includes(this.sortForm);
      if (!isSortForm) {
        this.sortForm.classList.remove("show");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.sortForm.classList.remove("show");
      }
    });
    this.sortContentDiv.forEach((item) => {
      item.addEventListener("click", () => {
        this.sortContentDiv.forEach((div) => div.classList.remove("active"));
        item.classList.add("active");
        this.sortContentIcon.forEach((icon) => icon.classList.remove("active"));
        // Thêm class active cho icon trong div được click
        const icon = item.querySelector("i");
        if (icon) {
          icon.classList.add("active");
        }
        const value = item.textContent.trim().toLowerCase();
      });
    });
    this.buttonForm.forEach((item, index) => {
      item.addEventListener("click", () => {
        this.buttonForm.forEach((item) => item.classList.remove("active"));
        item.classList.add("active");
      });
    });
  }
  async render() {
    const data = await this.getHTMLString();
    this.shadowRoot.innerHTML = data;
    this.setListeners();
    this.renderRecent();
  }
  async getHTMLString() {
    const res = await fetch("./components/sidebar/sidebar.html");
    const data = await res.text();
    return data;
  }
  toggleMenuSort() {
    this.sortForm.classList.toggle("show");
  }
  // hàm render khi bấm vào nút gần đây
  async renderRecent() {
    const { artists } = await httpRequest.get("artists");
    const likeSongsHtml = `
     <div class="library-item">
          <div class="item-info">
            <div class="item-title">
            <i class="fas fa-thumbtack"></i>
              <p>bài hát đã thích</p>
            </div>
            <div class="item-subtitle">Danh sách bài hát</div>
          </div>
        </div>
    `;
    const htmlRecent = artists
      .map(
        (item) => `
      <div class="library-item">
          <div class="item-info">
            <div class="item-title">${item.name}</div>
            <div class="item-subtitle">Nghệ sĩ</div>
          </div>
        </div>
    `
      )
      .join("");
    this.libraryContent.innerHTML = likeSongsHtml + htmlRecent;
    // this.artistsGrid.innerHTML = "";
  }
}
customElements.define("my-sidebar", sidebar);
