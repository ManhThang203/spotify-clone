import httpRequest from "../utils/httpRequest.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

export class TrackMusic {
  _currenIndex = 0;
  _isPlaySong = false;

  constructor() {
    this._trackList = $("#track-list");
    this._btnTogglePlay = $("#btn-pause");
    this._heroImage = $("#hero-image");
    this._artistName = $("#artist-name");
    this._monthlyListeners = $("#monthly-listeners");
    this._libraryContent = $("#library-content");
  }

  async _start() {
    await this._render();
    await this._playBack();
    await this._fetchApiArtists();
    this._bindLibraryEvents();
  }

  _bindLibraryEvents() {
    this._libraryItem = $$(".library-item");
    this._libraryItem.forEach((item) => {
      item.addEventListener("click", () => {
        this._libraryItem.forEach((re) => re.classList.remove("active"));
        item.classList.add("active");
        this._currenIndex = +item.dataset.index;
        this._playBack();
      });
    });
  }

  async _fetchApiTrack() {
    const { tracks } = await httpRequest.get("tracks"); // Thay đổi để phù hợp với API trả về data
    return tracks;
  }

  async _fetchApiArtists() {
    const { artists } = await httpRequest.get("artists"); // Thay đổi để phù hợp với API trả về data
    return artists;
  }

  async _playBack() {
    const currenInformation = await this._getCurrenInformation();
    this._heroImage.src = currenInformation.background_image_url;
    this._heroImage.alt = currenInformation.name;
    this._artistName.textContent = currenInformation.name;
    this._monthlyListeners.textContent = `${currenInformation.monthly_listeners} monthly listeners`;
  }

  async _getCurrenSong() {
    const tracks = await this._fetchApiTrack();
    return tracks[this._currenIndex];
  }

  async _getCurrenInformation() {
    const artists = await this._fetchApiArtists();
    return artists[this._currenIndex];
  }

  async _render() {
    const track = await this._fetchApiTrack();
    const html = track
      .map(
        (track, index) => `
        <div class="track-item">
          <div class="track-number">${index + 1}</div>
          <div class="track-image">
            <img src="${track.image_url}" alt="${track.title}" />
          </div>
          <div class="track-info">
            <div class="track-name">${track.title}</div>
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
    this._trackList.innerHTML = html;
  }
}
