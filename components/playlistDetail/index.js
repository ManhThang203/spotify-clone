import httpRequest from "../../utils/httpRequest.js";

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
    this.type = this.getAttribute("data-type");
    this.trackList = this.shadowRoot.querySelector("#track-list");
    this.artistHero = this.shadowRoot.querySelector("#artist-hero");
  }
  async render() {
    const data = await this.getPlaylist();
    // this.shadowRoot sẽ them chiếu tới shadow DOM
    this.shadowRoot.innerHTML = data;
    this.getElement();
    this.renderPlaylist(this.id, this.type);
    this.renderTrack(this.id, this.type);
  }
  async getPlaylist() {
    const res = await fetch("./components/playlistDetail/playlist.html");
    const data = await res.text();
    return data;
  }
  async renderPlaylist(id, type) {
    const endPoint = type === "playlist" ? `playlists/${id}` : `artists/${id}`;
    const data = await httpRequest.get(endPoint);
    const { image_url, background_image_url, monthly_listeners, name } = data;
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
      <p class="monthly-listeners">${monthly_listeners} monthly listeners</p>
    </div>
    `;
    this.artistHero.innerHTML = html;
  }
  async renderTrack() {
    const data = await httpRequest.get("tracks?limit=20&offset=0");
    const { tracks, pagination } = data;
    console.log(tracks);
    const html = tracks
      .map(
        (item, index) => `
          <div class="track-item">
          <div class="track-number">${index + 1}</div>
          <div class="track-image">
            <img src="${item.image_url}" alt="${item.title}" />
          </div>
          <div class="track-info">
            <div class="track-name">${item.title}</div>
          </div>
          <div class="track-plays">27,498,341</div>
          <div class="track-duration">4:18</div>
          <button class="track-menu-btn">
            <i class="fas fa-ellipsis-h"></i>
          </button>
        </div>
    `
      )
      .join("");
    this.trackList.innerHTML = html;
  }
  open() {
    document.querySelector(".content-wrapper").appendChild(this);
  }
  close() {
    this.remove();
  }
}

customElements.define("play-list", Playlist);
