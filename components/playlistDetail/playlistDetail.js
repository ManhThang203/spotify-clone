import httpRequest from "../../utils/httpRequest.js";
import { formatTime } from "../../utils/helpers.js";
class Playlist extends HTMLElement {
  isPlaying;
  playingTrack;
  playingTracks;
  artistId;
  artist;
  artistTracks;
  isSameTrack;
  isSameTracks;

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

    // Hooks
    await this.getData();
    this.getElement();
    this.renderHero();
    this.renderControls();
    this.renderTracks();
    this.setListner();

    // gọi 1 lần duy  nhất
    this.style.visibility = "visible";
  }
  // Lấy dự liệu từ LocalStorage
  getLocal() {
    // Nếu có giá trị lấy được là chuỗi "undefined" hoặc thật sự là undefined thì trả vè null
    // Nếu có giá tri hợp lệ thì dùng JSON.parse chuyển chuỗi thành kiểu dữ liệu boolean
    this.isPlaying =
      JSON.parse(
        localStorage.getItem("isPlaying") === "undefined" ||
          localStorage.getItem("isPlaying") === undefined
          ? null
          : localStorage.getItem("isPlaying")
      ) || false;
    // Nếu có giá trị lấy được là chuỗi "undefined" hoặc thật sự là undefined thì trả vè null
    // Nếu có giá tri hợp lệ thì dùng JSON.parse chuyển chuỗi thành kiểu dữ liệu null
    this.playingTrack =
      JSON.parse(
        localStorage.getItem("playingTrack") === "undefined" ||
          localStorage.getItem("playingTrack") === undefined
          ? null
          : localStorage.getItem("playingTrack")
      ) || null;
    // Nếu có giá trị lấy được là chuỗi "undefined" hoặc thật sự là undefined thì trả vè null
    // Nếu có giá tri hợp lệ thì dùng JSON.parse chuyển chuỗi thành kiểu dữ liệu array
    this.playingTracks =
      JSON.parse(
        localStorage.getItem("playingTracks") === "undefined" ||
          localStorage.getItem("playingTracks") === undefined
          ? null
          : localStorage.getItem("playingTracks")
      ) || [];
  }
  // kiểm tra bài hát đang hát có phải là bài hát hiện tại hay không
  isSame() {
    // kiểm tra bài hát đang hát có nằm trong danh sách bài hát đó không
    this.isSameTrack = this.artistTracks.some(
      (i) => i.id === this.playingTrack?.id
    );
    //  kiểm tra danh sách bải hát A với danh sách bài hát B
    this.isSameTracks = this.arraysDeepEqualOrdered(
      this.artistTracks,
      this.playingTracks
    );
    return this.isSameTrack && this.isSameTracks;
  }

  async getData() {
    this.getLocal();
    this.artistId = this.dataset.artist;
    this.type = this.dataset.type;
    const { tracks } = await httpRequest.get("tracks?limit=50&offset=0");
    this.artistTracks = tracks.filter(
      (item) => item.artist_id === this.artistId
    );
    this.artist = await httpRequest.get(`artists/${this.artistId}`);
    this.isSame(); // cập nhật lại luôn khi chyển tới nghệ sĩ khác
  }

  getElement() {
    this.artistHero = this.shadowRoot.querySelector("#artist-hero");
    this.artistControls = this.shadowRoot.querySelector("#artist-controls");
    this.trackList = this.shadowRoot.querySelector("#track-list");
  }

  async renderHero() {
    try {
      const { background_image_url, monthly_listeners, name } = this.artist;
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

  renderControls() {
    let isPlaying;
    // this.isSameTrack : nếu là đúng là bài hát của danh sách nghệ sĩ đó
    // this.isSameTracks : nếu danh sách bài hát của nghệ sĩ đó
    if (this.isSameTrack && this.isSameTracks) {
      isPlaying = this.isPlaying;
    } else {
      isPlaying = false;
    }
    const isFollowing = this.artist.is_following;
    const html = `
      <button class="play-btn-large ${
        isPlaying ? "playing" : ""
      }" id="play-btn-large">
        <i class="fa-solid fa-play"></i>
        <i class="fa-solid fa-pause"></i>
      </button>
      <div class="follow-box ${isFollowing ? "following" : ""}" id="follow-box">
        <button class="btn-follow follow" id="btn-follow">Theo dõi</button>
        <button class="btn-follow are-follow" id="btn-arefollow">
          Đang theo dõi
        </button>
      </div>
    `;

    this.artistControls.innerHTML = html;

    this.playBtnLarge = this.shadowRoot.querySelector("#play-btn-large");
    this.btnFollow = this.shadowRoot.querySelector("#btn-follow");
    this.btnAreFollow = this.shadowRoot.querySelector("#btn-arefollow");

    this.playBtnLarge.addEventListener("click", () => {
      // khi phát
      if (isPlaying) {
        localStorage.setItem("isPlaying", "false");
        //dispatch event
        document.dispatchEvent(new CustomEvent("playingTrack:isPlaying:false"));
      } else {
        // không phát
        this.playBtnLarge.classList.add("playing");
        // this.isSameTrack : nếu là đúng là bài hát của danh sách nghệ sĩ đó
        // this.isSameTracks : nếu danh sách bài hát của nghệ sĩ đó
        if (this.isSameTrack && this.isSameTracks) {
          localStorage.setItem("isPlaying", "true");
          //dispatch event
          document.dispatchEvent(
            new CustomEvent("playingTrack:isPlaying:true")
          );
        } else {
          localStorage.setItem("isPlaying", "true");
          localStorage.setItem(
            "playingTrack",
            JSON.stringify(this.artistTracks[0])
          );
          localStorage.setItem(
            "playingTracks",
            JSON.stringify(this.artistTracks)
          );
          //dispatch event
          document.dispatchEvent(new CustomEvent("playingTrack:re-render"));
        }
      }
      //re-render
      this.getLocal();
      this.isSame();
      this.renderControls();
      this.renderTracks();
    });

    this.followBox = this.shadowRoot.querySelector("#follow-box");
    this.btnFollow = this.shadowRoot.querySelector("#btn-follow");
    this.btnFollow.addEventListener("click", () => {
      this.followBox.classList.add("following");
    });

    this.btnAreFollow = this.shadowRoot.querySelector("#btn-arefollow");
    this.btnAreFollow.addEventListener("click", () => {
      this.followBox.classList.remove("following");
    });
  }

  async renderTracks() {
    const html = this.artistTracks
      .map((item, index) => {
        const duration = formatTime(item.duration);

        let isPlaying;
        // kiểm tra các điều kiện trong hàm isSame
        // kiểm tra thêm bài hát đang phát có phải là bài hát đang lưu vào local ko
        if (this.isSame() && item.id === this.playingTrack.id) {
          isPlaying = true;
        } else {
          isPlaying = false;
        }

        return `
        <div class="track-item ${isPlaying ? "playing" : ""}" data-id="${
          item.id
        }">
         <div class="track-number" style="display: ${
           isPlaying ? "block" : "none"
         };">
          <i class="fas fa-volume-up playing-icon"></i>
         </div>
          <div class="track-number"  style="display: ${
            isPlaying ? "none" : "block"
          };">${index + 1}</div>
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

    // lấy ra tất cả các trackItem
    this.trackItems = Array.from(
      this.shadowRoot.querySelectorAll(".track-item")
    );
    this.trackItems.forEach((item) => {
      item.addEventListener("click", () => {
        // const local = localStorage.getItem("access_token");
        // if (!local) {
        //   document.dispatchEvent(new CustomEvent("open:loginModal"));
        //   return;
        // }
        if (this.isSame()) {
          localStorage.setItem("isPlaying", !this.isPlaying);
          //re-render
          this.getLocal();
          this.isSame();
          this.renderControls();
          this.renderTracks();
          //dispatch event

          document.dispatchEvent(
            new CustomEvent(`playingTrack:isPlaying:${this.isPlaying}`)
          );
        } else {
          localStorage.setItem("isPlaying", "true");
          localStorage.setItem(
            "playingTrack",
            JSON.stringify(
              this.artistTracks.find((i) => i.id === item.dataset.id) || null
            )
          );
          localStorage.setItem(
            "playingTracks",
            JSON.stringify(this.artistTracks)
          );
          //re-render
          this.getLocal();
          this.isSame();
          this.renderControls();
          this.renderTracks();
          //dispatch event
          document.dispatchEvent(new CustomEvent("playingTrack:re-render"));
        }
      });

      item.addEventListener("dblclick", () => {
        // const local = localStorage.getItem("access_token");
        // if (!local) {
        //   document.dispatchEvent(new CustomEvent("open:loginModal"));
        //   return;
        // }
        localStorage.setItem("isPlaying", "true");
        localStorage.setItem(
          "playingTrack",
          JSON.stringify(
            this.artistTracks.find((i) => i.id === item.dataset.id) || null
          )
        );
        localStorage.setItem(
          "playingTracks",
          JSON.stringify(this.artistTracks)
        );
        //re-render
        this.getLocal();
        this.isSame();
        this.renderControls();
        this.renderTracks();
        //dispatch event
        document.dispatchEvent(new CustomEvent("playingTrack:re-render"));
      });
    });
  }

  setListner() {
    document.addEventListener(
      "playingTrack:toPlaylistDetail:re-render",
      (e) => {
        this.getLocal();
        this.isSame();
        this.renderControls();
        this.renderTracks();
      }
    );
  }

  open() {
    this.style.display = "block";
    document.querySelector(".content-wrapper").appendChild(this);
    this.shadowRoot.innerHTML = "";
  }
  close() {
    this.style.display = "none";
  }

  async getPlaylist() {
    const res = await fetch("./components/playlistDetail/playlistDetail.html");
    const data = await res.text();
    return data;
  }

  // Deep equal cơ bản cho dữ liệu thuần (Object/Array/Date/primitive)
  deepEqual(a, b) {
    if (Object.is(a, b)) return true; // đúng cho NaN, -0
    // kiểm tra nếu là phần từ a và b có phải là obj hay null không
    if (
      typeof a !== "object" ||
      a === null ||
      typeof b !== "object" ||
      b === null
    )
      return false;
    // mỗi obj trong js đềucó thuộc tính constructor
    // kiểm tra phần từ a hay b có cùng constructor
    if (a.constructor !== b.constructor) return false;
    if (a instanceof Date)
      return b instanceof Date && a.getTime() === b.getTime();
    // nếu phần từ a là mảng
    if (Array.isArray(a)) {
      // nếu phần từ b không phải là mảng Hoặc độ dài a và b khác nhau
      if (!Array.isArray(b) || a.length !== b.length) return false;
      // nếu phàn từ a là mảng thì lặp qua từ phần từ là đệ quy gọi lại hàm deepEqual để kieemrb  tra kiều mảng
      for (let i = 0; i < a.length; i++) {
        if (!this.deepEqual(a[i], b[i])) return false;
      }
      return true;
    }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    // lặp qua phân từ a qua các key
    for (const k of keysA) {
      // nếu key của phần từ a không có trong phàn từ b
      if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
      // đệ  quy để gọi lại hàm deepEqual chuyền vào value để kiểm tra có gióng nhau không
      if (!this.deepEqual(a[k], b[k])) return false;
    }
    return true;
  }

  // Trường hợp thứ tự phần tử quan trọng:
  arraysDeepEqualOrdered(arrA, arrB) {
    if (arrA.length !== arrB.length) return false;
    for (let i = 0; i < arrA.length; i++) {
      if (!this.deepEqual(arrA[i], arrB[i])) return false;
    }
    return true;
  }
}

customElements.define("play-list", Playlist);
