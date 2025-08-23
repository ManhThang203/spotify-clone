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
  setLisstens() {
    this.hitsGrid.querySelectorAll(".hit-card").forEach((item) => {
      // console.log(item);
    });
  }
  async render() {
    this.style.visibility = "hidden";
    const html = await this.getHTMLString();
    // tạo đối tượng DOMParser để phân tích html
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html"); // biến đổi chuỗi html thành cây dom tree
    const linkEls = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    linkEls.forEach((l) => l.remove());
    // lấy các hrel
    // thêm các link vào shadowRoot và chờ load song
    const awaitLink = (href) =>
      new Promise((resolve, reject) => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.onload = resolve;
        link.onerror = () => reject(new Error(`Css failed: ${href}`));
        this.shadowRoot.appendChild(link);
      });
    const hrefs = linkEls.map((l) => l.getAttribute("href"));
    await Promise.all(hrefs.map(awaitLink)); // chờ đợi tất cả css sẵn sàng

    // appen phần marup còn lại (không innerHtml để xóa khỏi xóa link)
    const tpl = document.createElement("template");
    tpl.innerHTML = doc.body ? doc.body.innerHTML : html;
    const frag = tpl.content.cloneNode(true);
    this.shadowRoot.appendChild(frag);

    // Hook logic
    this.getElements();
    this.setLisstens();
    this.renderPlaylists();
    this.renderArtists();
    this.style.visibility = "visible";
  }
  async getHTMLString() {
    const res = await fetch("./components/main/main.html");
    const data = await res.text();
    return data;
  }
  async renderPlaylists() {
    const [{ tracks }, { artists }] = await Promise.all([
      httpRequest.get("tracks/trending?limit=20"),
      httpRequest.get("artists?limit=20&offset=0"),
    ]);
    const html = tracks
      .map(
        (item) => `
        <div class="hit-card" data-id="${item.id}">
      <div class="hit-card-cover">
        <img src="${item.image_url}" alt="Flowers" />
        <button class="hit-play-btn">
          <i class="fas fa-play"></i>
        </button>
      </div>
      <div class="hit-card-info">
        <h3 class="hit-card-title">${item.title}</h3>
        <p class="hit-card-artist">${item.artist_name}</p>
      </div>
    </div>
    `
      )
      .join("");
    this.hitsGrid.innerHTML = html;

    this.hitCard = this.hitsGrid.querySelectorAll(".hit-card");
    this.hitCard.forEach((item) => {
      item.addEventListener("click", () => {
        const artistsId = item.dataset.id;
        document.dispatchEvent(
          new CustomEvent("navigateToPlaylist", {
            detail: { id: artistsId, type: "artist" },
            bubbles: true,
            composed: true,
          })
        );
      });
    });
  }
  async renderArtists() {
    const { artists, pagination } = await httpRequest.get(
      "artists?limit=20&offset=0"
    );
    const html = artists
      .map(
        (item) => `
         <div class="artist-card" data-id="${item.id}">
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

    this.artistCard = this.artistsGrid.querySelectorAll(".artist-card");
    this.artistCard.forEach((item) => {
      item.addEventListener("click", () => {
        const artistsId = item.dataset.id;
        document.dispatchEvent(
          new CustomEvent("navigateToPlaylist", {
            detail: { id: artistsId, type: "artist" },
            bubbles: true,
            composed: true,
          })
        );
      });
    });
  }
  open() {
    this.style.display = "block";
    if (document.querySelector("my-home")) return;
    document.querySelector(".content-wrapper").prepend(this);
  }
  close() {
    this.style.display = "none";
  }
}

customElements.define("my-home", MyHome);
