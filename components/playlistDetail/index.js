import httpRequest from "../../utils/httpRequest.js";
import { formatTime } from "../../utils/helpers.js";
class Playlist extends HTMLElement {
  constructor() {
    super();
    // tạo 1 cây Dom riêng biệt
    // có thẻ truy cập được từ bên ngoài
    this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    this.render();
  }
  getElement() {
    // this.contentWrapper = this.shadowRoot.querySelector("")
    this.id = this.getAttribute("data-id");
    console.log(this.id);
    this.type = this.getAttribute("data-type");
    this.trackList = this.shadowRoot.querySelector("#track-list");
    this.artistHero = this.shadowRoot.querySelector("#artist-hero");
  }
  async render() {
    // 1) Ẩn component tới khi sẵn sàng
    this.style.visibility = "hidden";

    // 2) Lấy nội dung HTML header
    const html = await this.getPlaylist();

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

    this.getElement();
    this.renderPlaylist(this.id, this.type);
    this.renderTrack(this.id);
    // gọi 1 lần duy  nhất
    this.style.visibility = "visible";
  }
  async getPlaylist() {
    const res = await fetch("./components/playlistDetail/playlist.html");
    const data = await res.text();
    return data;
  }
  async renderPlaylist(id, type) {
    try {
      // const endPoint = type === "tracks" ? `tracks/${id}` : `artists/${id}`;
      const data = await httpRequest.get(`artists/${id}`);
      // console.log(data);
      const { background_image_url, monthly_listeners, name } = data;
      const html = `
     <div class="hero-background">
      <img src="${background_image_url}" alt="${name} artist background" class="hero-image" />
      <div class="hero-overlay"></div>
     </div>
    <div class="hero-content">
      <div class="verified-badge">
        <i class="fas fa-check-circle"></i>
        <span>Verified Artist</span>
      </div>
      <h1 class="artist-name">${name}</h1>
      <p class="monthly-listeners">${monthly_listeners.toLocaleString()} monthly listeners</p>
    </div>
    `;
      this.artistHero.innerHTML = html;
    } catch (error) {}
  }
  async renderTrack(id) {
    const data = await httpRequest.get("tracks/trending?limit=20");
    const { tracks, pagination } = data;
    const artistTracks = tracks.filter((item) => item.artist_id === id);
    const html = artistTracks
      .map((item, index) => {
        const duration = formatTime(item.duration);
        return `
          <div class="track-item">
          <div class="track-number">${index + 1}</div>
          <div class="track-image">
            <img src="${item.image_url}" alt="${item.title}" />
          </div>
          <div class="track-info">
            <div class="track-name">${item.title}</div>
          </div>
          <div class="track-plays">${item.play_count.toLocaleString()}</div>
          <div class="track-duration">${duration}</div>
          <button class="track-menu-btn">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
    `;
      })
      .join("");
    this.trackList.innerHTML = html;
  }
  open() {
    this.style.display = "block";
    document.querySelector(".content-wrapper").appendChild(this);
    this.shadowRoot.innerHTML = "";
  }
  close() {
    this.style.display = "none";
  }
}

customElements.define("play-list", Playlist);
