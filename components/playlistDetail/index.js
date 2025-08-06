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

  async render() {
    const data = await this.getPlaylist();
    // this.shadowRoot sẽ them chiếu tới shadow DOM
    this.shadowRoot.innerHTML = data;
  }
  async getPlaylist() {
    const res = await fetch("./components/playlistDetail/playlist.html");
    const data = await res.text();
    return data;
  }
}

customElements.define("play-list", Playlist);
