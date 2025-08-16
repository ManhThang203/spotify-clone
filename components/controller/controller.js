import { attachTooltip } from "../../utils/helpers.js";
class Controller extends HTMLElement {
  isSongPlaying = true;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  setListner() {
    document.addEventListener("logout:success", () => {
      this.playerLeft.style.visibility = "hidden";
    });
    document.addEventListener("login:success", () => {
      this.playerLeft.style.visibility = "visible";
    });
    document.addEventListener("signUp:success", () => {
      this.playerLeft.style.visibility = "visible";
    });
    // lắng nghe bài hát của nghệ sĩ đó
    document.addEventListener("song-artist", (e) => {
      this.playerLeft.style.visibility = "visible";

      const { song } = e.detail;
      this.songs = song;
      this.currentIndex = 0;
      this.togglePlayBtn.addEventListener("click", () => {
        this._togglePlay();

        this.audio.onplay = () => {
          this.playIcon.classList.add("fa-pause");
          this.playIcon.classList.remove("fa-play");
        };
        this.audio.onpause = () => {
          this.playIcon.classList.remove("fa-pause");
          this.playIcon.classList.add("fa-play");
        };
      });
      this._loadCurrenSong();
    });
  }
  _getCurrentSong() {
    return this.songs[this.currentIndex];
  }
  _loadCurrenSong() {
    const currentSong = this._getCurrentSong();
    this.playerImage.src = currentSong.image_url;
    this.playerTitle.textContent = currentSong.title;
    this.playerArtist.textContent = currentSong.artist_name;
    this.audio.src = currentSong.audio_url;
    document.dispatchEvent(
      new CustomEvent("curren-song", {
        detail: { currentIndex: this.currentIndex },
      })
    );

    if (currentSong) return;
  }
  _togglePlay() {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  getElement() {
    this.togglePlayBtn = this.shadowRoot.querySelector("#play-btn");
    this.playerLeft = this.shadowRoot.querySelector("#player-left");
    this.playerImage = this.shadowRoot.querySelector("#player-image");
    this.playerTitle = this.shadowRoot.querySelector("#player-title");
    this.playerArtist = this.shadowRoot.querySelector("#player-artist");
    this.audio = this.shadowRoot.querySelector("#audio");
    this.playIcon = this.shadowRoot.querySelector("#play-icon");
    this.playerLeft.style.visibility = "hidden";
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

    // các Hook
    this.initTooltip(); // Gọi sau khi HTML được gán
    this.setListner();
    this.getElement();

    this.style.visibility = "visible";
  }
  async getHTMLString() {
    const res = await fetch("./components/controller/controller.html");
    const data = await res.text();
    return data;
  }

  // Gắn tooltip cho các nút trong shadowRoot
  initTooltip() {
    attachTooltip(this.shadowRoot, ".btn-Shuffle", ".tooltip-Shuffle");
    attachTooltip(this.shadowRoot, ".btn-prev", ".tooltip-prev");
    attachTooltip(this.shadowRoot, ".play-btn", ".tooltip-play");
    attachTooltip(this.shadowRoot, ".btn-next", ".tooltip-next");
    attachTooltip(this.shadowRoot, ".btn-loop", ".tooltip-loop");
    attachTooltip(this.shadowRoot, ".btn-voice", ".tooltip-voice");
    attachTooltip(this.shadowRoot, ".btn-noice", ".tooltip-noice");
    attachTooltip(this.shadowRoot, ".btn-screen", ".tooltip-screen");
    attachTooltip(this.shadowRoot, ".add-btn", ".tooltip-add");
  }
}

customElements.define("my-controller", Controller);
