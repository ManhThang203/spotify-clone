const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

import { LibraryPage } from "../components/libraryPage.js";

export class SortModal {
  constructor() {
    this.btnSort = $("#sort-btn");
    this.sortModal = $("#sort-modal");
    this.sortItems = $$(".sort-item");
    this.btnFormats = $$(".btn-format");
    this.sortItemNear = $("#sort-item_near");
    this.btnMenuIcon = $("#btn-menu_icon");
    this.btnHamburger = $("#btn-hamburger");
    this.btnGridMenu = $("#btn-grid_menu");
    this.libraryContent = $("#library-content");
    
    this.itemIcon = $(".item-icon.liked-songs");
    this.itemImage = $(".item-image");

    this.libraryPage = new LibraryPage(); // Khởi tạo LibraryPage
    this.isNearClicked = false; // Trạng thái nút "Gần đây"
    this.isMenuClicked = false; // Trạng thái nút "Danh sách phát"
    this.isHamburgerClicked = false; // Trạng thái nút "Hamburger"
    this.isGridMenu = false;
  }

  init() {
    this._initEvents();
  }

  _initEvents() {
    // mở modal sort
    this.btnSort?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.sortModal?.classList.toggle("active");
    });

    // khi bấm ra ngoài modal thì đóng modal
    document.addEventListener("click", (e) => {
      const isInsideModal = e.target.closest(".sort-modal");
      const isBtnSort = e.target.closest("#sort-btn");
      if (!isInsideModal && !isBtnSort) {
        this.sortModal?.classList.remove("active");
      }
    });

    // khi bấm Esc thì tắt modal
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.sortModal?.classList.remove("active");
      }
    });

    this.sortItems.forEach((item) => {
      item.addEventListener("click", () => {
        this.sortItems.forEach((el) => el.classList.remove("active"));
        item.classList.add("active");
      });
    });

    this.btnFormats.forEach((item) => {
      item.addEventListener("click", () => {
        this.btnFormats.forEach((el) => el.classList.remove("active"));
        item.classList.add("active");
      });
    });

    // Thực hiện bấm vào nút sortItemNear
    this.sortItemNear?.addEventListener("click", () => {
      this.isNearClicked = true;
      this.checkBothClicked();
    });

    // Thực hiện bấm vào nút btnMenuIcon
    this.btnMenuIcon?.addEventListener("click", () => {
      this.isMenuClicked = true;
      this.checkBothClicked();
    });

    // Thực hiện bấm vào nút btnHamburger
    this.btnHamburger?.addEventListener("click", () => {
      this.isHamburgerClicked = true;
      this.checkHamburgerClicked();
    });

    // thực hiên bấm vào nút GridMenu
    this.btnGridMenu?.addEventListener("click", () => {
      this.isGridMenu = true;
      // Lấy lại phần tử sau khi render (nếu nó render sau)
      this.itemIcon = $(".item-icon.liked-songs");
      this.itemImage = $(".item-image");

      if (this.libraryContent) {
        Object.assign(this.libraryContent.style, {
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
        });
      }
      if (this.itemIcon) {
        Object.assign(this.itemIcon.style, {
          width: "80px",
          height: "78px",
        });
        // this.itemIcon.style.width = 80 + "px";
        // this.itemIcon.style.height = 78 + "px";
      }
      if (this.itemImage) {
        this.itemImage.style.width = "80px";
        this.itemImage.style.height = "80px";
      } else {
        console.log("KHông tìm thấy this.itemIcon");
      }
      this.checkGirdClicked();
    });
  }

  // Kiểm tra và render khi cả hai nút sortItemNear và btnMenuIcon đều được bấm
  async checkBothClicked() {
    if (this.isNearClicked && this.isMenuClicked) {
      await this.libraryPage.renderRecent(); // Render giao diện "Gần đây"
      // Reset trạng thái về false sau khi render
      this.isNearClicked = true;
      this.isMenuClicked = false;
    }
  }

  // Kiểm tra và render khi cả nút sortItemNear và btnHamburger đều được bấm
  async checkHamburgerClicked() {
    if (this.isNearClicked && this.isHamburgerClicked) {
      await this.libraryPage.render(); // Render giao diện mặc định
      // Reset trạng thái về false sau khi render
      this.isNearClicked = true;
      this.isHamburgerClicked = false;
    }
  }

  // Kiểm tra và render khi cả nút sortItemNear và btnGridMenu đều được bấm
  async checkGirdClicked() {
    if (this.isNearClicked && this.isGridMenu) {
      await this.libraryPage.renderGird(); // Render giao diện mặc định
      // Reset trạng thái về false sau khi render
      this.isGridMenu = true;
      this.isHamburgerClicked = false;
    }
  }
}
