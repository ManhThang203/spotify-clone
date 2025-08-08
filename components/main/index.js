import httpRequest from "../../utils/httpRequest.js";
class MyHome extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }
  getElements() {
    this.hitsGrid = this.shadowRoot.querySelector("#hits-grid");
    this.artistsGrid = this.shadowRoot.querySelector("#artists-grid");
  }
  async render() {
    const data = await this.getHTMLString();
    this.shadowRoot.innerHTML = data;
    this.getElements();
    this.renderPlaylists();
    this.renderArtists();
  }

  async getHTMLString() {
    const res = await fetch("./components/main/main.html");
    const data = await res.text();
    return data;
  }
  async renderPlaylists() {
    const { playlists, pagination } = await httpRequest.get(
      "playlists?limit=20&offset=0"
    );
    const html = playlists
      .map(
        (item) => `
        <div class="hit-card">
      <div class="hit-card-cover">
        <img src="${item.image_url}" alt="Flowers" />
        <button class="hit-play-btn">
          <i class="fas fa-play"></i>
        </button>
      </div>
      <div class="hit-card-info">
        <h3 class="hit-card-title">${item.name}</h3>
        <p class="hit-card-artist">${item.user_display_name}</p>
      </div>
    </div>
    `
      )
      .join("");
    this.hitsGrid.innerHTML = html;
  }
  async renderArtists() {
    const { artists, pagination } = await httpRequest.get(
      "artists?limit=20&offset=0"
    );
    const html = artists
      .map(
        (item) => `
         <div class="artist-card">
      <div class="artist-card-cover">
        <img src="${item.image_url}" alt="${item.name}" />
        <button class="artist-play-btn">
          <i class="fas fa-play"></i>
        </button>
      </div>
      <div class="artist-card-info">
        <h3 class="artist-card-name">${item.name}</h3>
        <p class="artist-card-type">${item.bio}</p>
      </div>
    </div>
    `
      )
      .join("");

    this.artistsGrid.innerHTML = html;
  }
  open() {
    document.querySelector(".content-wrapper").prepend(this);
  }
  close() {
    this.remove(this);
  }
}

customElements.define("my-home", MyHome);
