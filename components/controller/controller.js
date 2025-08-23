import { attachTooltip, formatTime } from "../../utils/helpers.js";
class Controller extends HTMLElement {
  NEXT = 1;
  PREV = -1;
  playingSongs;
  playingSong;
  isPlaying;
  isLoop = localStorage.getItem("loop") === "true";
  isRandom = localStorage.getItem("random") === "true";
  isPlaying;
  playingTrack;
  playingTracks;

  // Run
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  async render() {
    this.style.visibility = "hidden";

    // Get HTML string
    const html = await this.getHTMLString();
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
    const tpl = document.createElement("template");
    tpl.innerHTML = doc.body ? doc.body.innerHTML : html;
    const frag = tpl.content.cloneNode(true);
    this.shadowRoot.appendChild(frag);

    // Run hook
    this.getData();
    this.getElements();
    this.initTooltip();
    this.renderControls();
    this.setListners();
    this._restoreLoopState();
    this._resRamdomLoopState();

    this.style.visibility = "visible";
  }

  getLocal() {
    this.isPlaying =
      JSON.parse(
        localStorage.getItem("isPlaying") === "undefined" ||
          localStorage.getItem("isPlaying") === undefined
          ? null
          : localStorage.getItem("isPlaying")
      ) || false;
    this.playingTrack =
      JSON.parse(
        localStorage.getItem("playingTrack") === "undefined" ||
          localStorage.getItem("playingTrack") === undefined
          ? null
          : localStorage.getItem("playingTrack")
      ) || null;
    this.playingTracks =
      JSON.parse(
        localStorage.getItem("playingTracks") === "undefined" ||
          localStorage.getItem("playingTracks") === undefined
          ? null
          : localStorage.getItem("playingTracks")
      ) || [];
  }

  getData() {
    this.getLocal();
    this.currentIndex = this.playingTracks.findIndex(
      (i) => i.id === this.playingTrack?.id
    );
  }

  // Define
  getElements() {
    this.togglePlayBtn = this.shadowRoot.querySelector("#play-btn");
    this.playerLeft = this.shadowRoot.querySelector("#player-left");
    this.playerImage = this.shadowRoot.querySelector("#player-image");
    this.playerTitle = this.shadowRoot.querySelector("#player-title");
    this.playerArtist = this.shadowRoot.querySelector("#player-artist");
    this.audio = this.shadowRoot.querySelector("#audio");
    this.playIcon = this.shadowRoot.querySelector("#play-icon");
    this.btnNext = this.shadowRoot.querySelector("#btn-next");
    this.btnPrev = this.shadowRoot.querySelector("#btn-prev");
    this.progressFill = this.shadowRoot.querySelector("#progress-fill");
    this.progressHandle = this.shadowRoot.querySelector("#progress-handle");
    this.progressBar = this.shadowRoot.querySelector("#progress-bar");
    this.currentTime = this.shadowRoot.querySelector("#current-time");
    this.durationTime = this.shadowRoot.querySelector("#duration-time");
    this.btnLoop = this.shadowRoot.querySelector("#btn-loop");
    this.btnRandom = this.shadowRoot.querySelector("#btn-random");
    if (!this.playingTrack) {
      this.playerLeft.style.visibility = "hidden";
    }
  }

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

  renderControls() {
    if (this.playingTrack) {
      this.playerLeft.style.visibility = "visible";
      this.playerImage.src = this.playingTrack.image_url;
      this.playerTitle.textContent = this.playingTrack.title;
      this.playerArtist.textContent = this.playingTrack.artist_name;
      this.audio.src = this.playingTrack.audio_url;
    }
  }

  setListners() {
    document.addEventListener("logout:success", () => {
      this.playerLeft.style.visibility = "hidden";
      localStorage.setItem("isPlaying", "false");
      localStorage.setItem("playingTrack", "null");
      localStorage.setItem("playingTracks", "[]");
      this.audio.pause();
      this.audio = null;
    });
    document.addEventListener("login:success", () => {
      this.playerLeft.style.visibility = "visible";
    });
    document.addEventListener("signUp:success", () => {
      this.playerLeft.style.visibility = "visible";
    });

    // click vào nút Next
    this.btnNext.addEventListener("click", () => {
      this._handleNextOrPrev(this.NEXT);
    });
    // Click bào nút Prev
    this.btnPrev.addEventListener("click", () => {
      this._handleNextOrPrev(this.PREV);
    });

    // Click vào nút Play
    this.togglePlayBtn.addEventListener("click", () => {
      this._togglePlay();
    });

    // Click vào nút Loop
    this.btnLoop.addEventListener("click", () => {
      this.isLoop = !this.isLoop;
      this._restoreLoopState();
    });

    // Click vào nút Random
    this.btnRandom.addEventListener("click", () => {
      this.isRandom = !this.isRandom;
      this._resRamdomLoopState();
      this._getRandomIndex();
    });

    this.audio.onplay = () => {
      this.playIcon.classList.add("fa-pause");
      this.playIcon.classList.remove("fa-play");
      this.isPlaying = true;
    };

    this.audio.onpause = () => {
      this.playIcon.classList.remove("fa-pause");
      this.playIcon.classList.add("fa-play");
      this.isPlaying = false;
    };

    // xử lý khi kết thúc bài
    this.audio.onended = () => {
      this._handleNextOrPrev(this.NEXT);
    };

    // khi medata sẵn sàng -> biết tổng thời gian
    this.audio.onloadedmetadata = () => {
      this._updateCurrentTimeUI();
      this._updateDurationUI();
    };

    // Một số trình duyệt bắn durationchange muộn / thay đổi nguồn
    this.audio.ondurationchange = () => {
      this._updateDurationUI();
    };

    // Update thời gian mới nhất
    this.audio.ontimeupdate = () => {
      this._updateCurrentTimeUI();
      const percent = this.audio.currentTime / this.audio.duration;
      this.progressFill.style.width = `${percent * 100}%` || 0;
      this.progressHandle.style.left = `calc(${percent * 100}% - 5px)` || 0;
    };

    let isDragging = false;
    let dragPercent = 0;
    // Click để tua
    this.progressBar.addEventListener("click", (e) => {
      const rect = this.progressBar.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      this.progressFill.style.width = `${percent * 100}%` || 0;
      this.progressHandle.style.left = `calc(${percent * 100}% - 5px)` || 0;
      this.audio.currentTime = percent * this.audio.duration;
    });

    // Kéo để tua (mousedown)
    this.progressHandle.addEventListener("mousedown", (e) => {
      e.stopPropagation(); // tránh click vào handle mà bị jump
      isDragging = true;
    });

    // Di chuyển khi kéo
    document.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      this.audio.pause();

      const rect = this.progressBar.getBoundingClientRect();
      dragPercent = (e.clientX - rect.left) / rect.width;
      dragPercent = Math.max(0, Math.min(1, dragPercent)); // giới hạn 0–1

      // update UI ngay trong khi kéo
      this.progressFill.style.width = `${dragPercent * 100}%`;
      this.progressHandle.style.left = `calc(${dragPercent * 100}% - 5px)`;

      // hiển thị preview thời gian kéo
      const previewTime = dragPercent * this.audio.duration;
      this.currentTime.textContent = formatTime(previewTime);
    });

    // Thả chuột => commit thời gian mới
    document.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      this.audio.currentTime = dragPercent * this.audio.duration;
      this.audio.play();
    });

    document.addEventListener("playingTrack:re-render", (e) => {
      this.getLocal();

      this.renderControls();

      this.currentIndex =
        this.playingTracks.findIndex((i) => i.id === this.playingTrack.id) - 1;
      this._handleNextOrPrev(this.NEXT);
    });

    document.addEventListener("playingTrack:isPlaying:true", (e) => {
      this.audio.play();
    });
    document.addEventListener("playingTrack:isPlaying:false", (e) => {
      this.audio.pause();
    });
  }

  _restoreLoopState() {
    this.audio.loop = this.isLoop;
    this.btnLoop.classList.toggle("active", this.isLoop);
    localStorage.setItem("loop", this.isLoop);
  }

  _resRamdomLoopState() {
    this.btnRandom.classList.toggle("active", this.isRandom);
    localStorage.setItem("random", this.isRandom);
  }

  // Helper
  _handleNextAndPrev() {
    // this.currentIndex đang tính toán và phần từ hiện tại
    this.currentIndex =
      (this.currentIndex + this.playingTracks.length) %
      this.playingTracks.length;
    this._loadCurrentSong();
  }

  _handleNextOrPrev(step) {
    if (this.isRandom) {
      this.currentIndex = this._getRandomIndex();
    } else {
      this.currentIndex += step;
    }
    this._handleNextAndPrev();
  }

  _getCurrentSong() {
    return this.playingTracks[this.currentIndex];
  }

  _loadCurrentSong() {
    const currentSong = this._getCurrentSong();
    localStorage.setItem("isPlaying", "true");
    localStorage.setItem("playingTrack", JSON.stringify(currentSong));

    // Re-render
    this.playerImage.src = currentSong.image_url;
    this.playerTitle.textContent = currentSong.title;
    this.playerArtist.textContent = currentSong.artist_name;
    this.audio.src = currentSong.audio_url;

    this.audio.oncanplay = () => {
      // Start
      this.audio.play();
      // Dispatch event
      document.dispatchEvent(
        new CustomEvent("playingTrack:toPlaylistDetail:re-render")
      );
    };
  }

  _getRandomIndex() {
    let randomIndex = null;
    if (this.playingTracks.length === 1) {
      return this.currentIndex;
    }
    do {
      randomIndex = Math.floor(Math.random() * this.playingTracks.length);
    } while (randomIndex === this.currentIndex);
    return randomIndex;
  }

  _updateDurationUI() {
    const d = this.audio.duration;
    this.durationTime.textContent = formatTime(d);
  }

  _updateCurrentTimeUI() {
    const t = this.audio.currentTime;
    this.currentTime.textContent = formatTime(t);
  }

  _togglePlay() {
    if (!this.audio) return;
    const isPlaying = !this.audio.paused;
    if (isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    localStorage.setItem("isPlaying", !isPlaying);
    // Dispatch event
    document.dispatchEvent(
      new CustomEvent(`playingTrack:toPlaylistDetail:re-render`)
    );
  }

  async getHTMLString() {
    const res = await fetch("./components/controller/controller.html");
    const data = await res.text();
    return data;
  }
}

customElements.define("my-controller", Controller);
