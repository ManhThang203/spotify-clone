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
    // 1) Ẩn component tới khi sẵn sàng
    this.style.visibility = "hidden";

    // 2) Lấy nội dung HTML header
    const html = await this.getHTMLString();

    // 3) Parse để tách <link> ra trước
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const linkEls = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    linkEls.forEach((l) => l.remove()); // bỏ link ra khỏi markup; ta sẽ tự chèn link trước

    // 4) Thêm các <link> vào ShadowRoot và CHỜ load xong
    const waitLink = (href) =>
      new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href; // dùng đúng href người viết trong file, không tự resolve
        link.onload = resolve;
        link.onerror = () => reject(new Error(`CSS failed: ${href}`));
        this.shadowRoot.appendChild(link);
      });

    const hrefs = linkEls.map((l) => l.getAttribute("href")); // lấy nguyên xi
    await Promise.all(hrefs.map(waitLink)); // chờ tất cả CSS sẵn sàng

    // 5) Append phần markup còn lại (KHÔNG innerHTML để khỏi xoá <link>)
    const tpl = document.createElement("template");
    tpl.innerHTML = doc.body ? doc.body.innerHTML : html;
    const frag = tpl.content.cloneNode(true);
    this.shadowRoot.appendChild(frag);

    // 6) (Tuỳ) chờ webfonts để tránh FOIT/FOUT biểu tượng
    if (document.fonts && document.fonts.ready) {
      try {
        await document.fonts.ready;
      } catch {}
    }

    // 7) Hook logic cũ
    this.setListeners();
    await this.hanndleSignUp();

    // 8) Hiện component 1 lần duy nhất (CSS đã sẵn)
    this.style.visibility = "visible";
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
    this.userInfo = this.shadowRoot.querySelector(".user-info");
    this.userDropdown = this.shadowRoot.querySelector("#userDropdown");
    this.btnHome = this.shadowRoot.querySelector("#btn-home");

    this.signupBtn.addEventListener("click", () => this.openSignupModal());
    this.signinBtn.addEventListener("click", () => this.openloginModal());
    this.userBtn.addEventListener("click", () => this.toggleMenu());

    this.userBtn.addEventListener("mouseenter", () => {
      this.userName.classList.add("active");
    });

    this.userBtn.addEventListener("mouseleave", () => {
      this.userName.classList.remove("active");
    });

    document.addEventListener("signUp:success", () => {
      this.hanndleSignUp();
    });
    document.addEventListener("login:success", () => {
      this.hanndleSignUp();
    });
    this.userDropdown.addEventListener("click", (e) => {
      this.hanndleLogOut();
    });
    this.btnHome.addEventListener("click", () => {
      document.dispatchEvent(new CustomEvent("navigateToMyHome"));
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
  // xử lý đăng ký
  async hanndleSignUp() {
    try {
      const { user } = await httpRequest.get("users/me");
      if (user.display_name) {
        this.userName.textContent = user.display_name;
      }
      if (user.avatar_url) {
        this.avatarImg.src = user.avatar_url;
      }
      this.authButtons.classList.remove("show");
      this.userInfo.appendChild(this.userDropdown);
      this.userInfo.append(this.userBtn, this.userName);
    } catch (error) {
      this.authButtons.classList.add("show");
      this.userBtn.remove();
      this.userName.remove();
    }
  }
  // xử lý đang xuất
  async hanndleLogOut() {
    try {
      const { message } = await httpRequest.post("auth/logout");
      console.log(message);
      if (message) {
        localStorage.removeItem("accessToken");
        this.authButtons.classList.add("show");
        this.userBtn.remove();
        this.userName.remove();
        this.userDropdown.remove();
      }
      document.dispatchEvent(new CustomEvent("logout:success"));
    } catch (error) {}
  }
  open() {
    this.style.display = "block";

    if (document.querySelector("my-header")) return;
    document.querySelector(".main-content").prepend(this);
  }
  close() {
    this.style.display = "none";
  }
}

customElements.define("my-header", MyHeader);
