import httpRequest from "../../utils/httpRequest.js";

class PlayListHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  getElements() {
    this.info = this.shadowRoot.querySelector("#info");
    this.playlistAuthor = this.shadowRoot.querySelector("#playlist-author");
    this.playlistTitle = this.shadowRoot.querySelector("#playlist-title");
    this.modal = this.shadowRoot.querySelector("#modal");
    this.modalContent = this.shadowRoot.querySelector("#modal-content");
    this.closeModal = this.shadowRoot.querySelector("#close-modal");
    this.cover = this.shadowRoot.querySelector("#cover");
    this.coverChoose = this.shadowRoot.querySelector("#cover-choose");
    this.coverIcon = this.shadowRoot.querySelector(".cover .fa-music");
    this.mainCover = this.shadowRoot.querySelector("#main-cover");
    this.mainCoverIcon = this.shadowRoot.querySelector(".main-cover .fa-music");
    this.modalChoose = this.shadowRoot.querySelector(".modal-choose");
  }

  setListeners() {
    this.playlistTitle.addEventListener("click", (e) => {
      e.stopPropagation();
      this.modal.classList.add("show");
    });
    document.addEventListener("click", (e) => {
      const isModal = e.composedPath().includes(this.modalContent);
      if (!isModal) {
        this.modal.classList.remove("show");
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.modal.classList.remove("show");
      }
    });
    this.cover.addEventListener("click", (e) => {
      e.stopPropagation();
      this.modal.classList.add("show");
    });
    this.closeModal.addEventListener("click", () => {
      this.modal.classList.remove("show");
    });
    this.cover.addEventListener("mouseenter", () => {
      this.coverChoose.classList.add("show");
      this.coverIcon.classList.add("hidden");
    });
    this.cover.addEventListener("mouseleave", () => {
      this.coverChoose.classList.remove("show");
      this.coverIcon.classList.remove("hidden");
    });

    this.mainCover.addEventListener("mouseenter", () => {
      this.modalChoose.classList.add("show");
      this.mainCoverIcon.classList.add("hidden");
    });
    this.mainCover.addEventListener("mouseleave", () => {
      this.modalChoose.classList.remove("show");
      this.mainCoverIcon.classList.remove("hidden");
    });
  }

  async render() {
    this.style.visibility = "hidden";
    const html = await this.getHTMLString();
    // tạo ra đôi tượng để phan tích html
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const linkEls = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    linkEls.forEach((l) => l.remove());
    // lấy ra các link và gán vào dom
    const awaitLink = (href) => {
      return new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.onload = resolve;
        link.onerror = () => reject(new Error(`Css Faile :${href}`));
        this.shadowRoot.appendChild(link);
      });
    };
    const hrefs = linkEls.map((l) => l.getAttribute("href")); // lấy ra các link
    await Promise.all(hrefs.map(awaitLink)); // đợi tất cả các link cùng bắt đầu
    // lấy ra các marup còn lại và gán vào dom
    const tpl = document.createElement("template");
    tpl.innerHTML = doc.body ? doc.body.innerHTML : html;
    const frag = tpl.content.cloneNode(true);
    this.shadowRoot.appendChild(frag);
    // các hook
    this.getElements();
    this.setListeners();
    this.handleHeaderPlaylist(await this.fetchPlaylistData());
    this.style.visibility = "visible";
  }

  async getHTMLString() {
    const res = await fetch("./components/playlistHeader/playlistHeader.html");
    return await res.text();
  }

  async fetchPlaylistData() {
    try {
      const { playlists } = await httpRequest.get(
        "playlists?limit=20&offset=0"
      );

      console.log(playlists[0]);
      return playlists[0];
    } catch (error) {
      console.error("Failed to fetch playlist data:", error);
    }
  }

  async handleHeaderPlaylist(playlist = {}) {
    try {
      const { user } = await httpRequest.get("users/me");
      if (this.playlistAuthor) {
        this.playlistAuthor.textContent = user.display_name;
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
    const { name } = playlist;
    if (this.playlistTitle && name) {
      this.playlistTitle.textContent = name;
    }
  }

  open() {
    this.style.display = "block";
    // this.shadowRoot.innerHTML = "";
    if (document.querySelector("my-playlistheader")) return;
    document.querySelector(".content-wrapper").appendChild(this);
  }

  close() {
    this.style.display = "none";
  }
}

customElements.define("my-playlistheader", PlayListHeader);
