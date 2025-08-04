import httpRequest from "../utils/httpRequest.js";
import { SortModal } from "./sortModal.js";

const $ = document.querySelector.bind(document);

export class LibraryPage {
  constructor() {
    this.libraryContent = $(".library-content");
    this.artistsGrid = $(".artists-grid");
  }
  // hàm render khi bấm vào nút gần đây
  async renderRecent() {
    const artists = await this._callApiArtists();
    const likeSongsHtml = `
     <div class="library-item">
          <div class="item-info">
            <div class="item-title">
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
    this.artistsGrid.innerHTML = "";
  }
  // hàm Render ra giao diện
  async render() {
    const artists = await this._callApiArtists();

    const likeSongsHtml = `
      <div class="library-item">
        <div class="item-icon liked-songs">
          <i class="fas fa-heart"></i>
        </div>
        <div class="item-info">
          <div class="item-title">Liked Songs</div>
          <div class="item-subtitle">
            <i class="fas fa-thumbtack"></i>
            Playlist • 3 songs
          </div>
        </div>
      </div>
    `;

    const htmlArtist = artists
      .map(
        (artist, index) => `
        <div class="library-item" data-index="${index}">
          <img src="${artist.image_url}" alt="${artist.name}" class="item-image" />
          <div class="item-info">
            <div class="item-title">${artist.name}</div>
            <div class="item-subtitle">Artist</div>
          </div>
        </div>
      `
      )
      .join("");

    const htmlArtistsGrid = artists
      .map(
        (artist) => `
        <div class="artist-card">
          <div class="artist-card-cover">
            <img src="${artist.image_url}" alt="${artist.name}" />
            <button class="artist-play-btn">
              <i class="fas fa-play"></i>
            </button>
          </div>
          <div class="artist-card-info">
            <h3 class="artist-card-name">${artist.name}</h3>
            <p class="artist-card-type">${artist.bio}</p>
          </div>
        </div>
      `
      )
      .join("");

    this.libraryContent.innerHTML = likeSongsHtml + htmlArtist;
    this.artistsGrid.innerHTML = htmlArtistsGrid;
  }
  // hàm Render ra giao diện Grid
  async renderGird(width) {
    document.dispatchEvent(new CustomEvent("click:sortBtn"));
    const artists = await this._callApiArtists();
    const likeSongsHtml = `
      <div class="library-item">
        <div class="item-icon liked-songs">
          <i class="fas fa-heart"></i>
        </div>
      </div>
    `;
    const htmlGrid = artists
      .map(
        (artist, index) => `
        <div class="library-item" data-index="${index}">
          <img src="${artist.image_url}" alt="${artist.name}" class="item-image" />
        </div>
      `
      )
      .join("");

    this.libraryContent.innerHTML = likeSongsHtml + htmlGrid;
  }
  // Gọi Api Artists
  async _callApiArtists() {
    const { artists } = await httpRequest.get("artists");
    return artists;
  }
}
