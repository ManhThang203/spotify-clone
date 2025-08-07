class Toast extends HTMLElement {
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
    const res = await fetch("./components/Toast/toast.html");
    const data = await res.text();
    return data;
  }
  setListeners() {
    this.toast = this.shadowRoot.querySelector("#toast");
    document.addEventListener("signUp:success", () => {
      this.showToast({
        title: "Thông báo mới",
        message: "Bạn đã đăng kí thành công",
        type: "success",
        duration: 4500,
      });
    });
    document.addEventListener("login:success", () => {
      this.showToast({
        title: "Thông báo mới",
        message: "Bạn đã đăng nhập thành công",
        type: "success",
        duration: 4500,
      });
    });
    document.addEventListener("logout:success", () => {
      this.showToast({
        title: "Thông báo mới",
        message: "Bạn đã đăng xuất thành công",
        type: "success",
        duration: 4500,
      });
    });
  }

  // Hàm hiển thị Toast
  showToast({ title = " ", message = " ", type = "info", duration = 3000 }) {
    if (this.toast) {
      const toast = document.createElement("div");
      toast.classList.add("toast", `toast--${type}`, "active");
      const delay = (duration / 1000).toFixed(2);
      toast.style.animation = `slideInLeft 0.3s ease, fadeOut .6s ease ${delay}s forwards`;
      const icons = {
        success: "fa-regular fa-circle-check",
        info: "fa-solid fa-circle-info",
        warning: "fa-solid fa-circle-exclamation",
        error: "fa-solid fa-triangle-exclamation",
      };
      const icon = icons[type];
      toast.innerHTML = `
        <div class="toast__icon">
          <i class="${icon}"></i>
        </div>
        <div class="toast__body">
          <h3 class="toast__title">${title}</h3>
          <p class="toast__message">${message}</p>
        </div>
        <div class="toast__close">
          <i class="fa-regular fa-circle-xmark"></i>
        </div>
      `;
      this.toast.appendChild(toast);
      const removeToast = duration + 1000;
      const autoRemoveId = setTimeout(() => {
        this.toast.removeChild(toast);
      }, removeToast);
      toast.addEventListener("click", (e) => {
        if (e.target.closest(".toast__close")) {
          this.toast.removeChild(toast);
          clearTimeout(autoRemoveId);
        }
      });
    }
  }
}
customElements.define("my-toast", Toast);
