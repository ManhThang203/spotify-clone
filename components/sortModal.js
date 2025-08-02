const $ = document.querySelector.bind(document);

export class SortModal {
  constructor() {
    this.btnSort = $("#sort-btn");
    this.sortModal = $("#sort-modal");
    this.sortItems = document.querySelectorAll(".sort-item");
    this.btnFormats = document.querySelectorAll(".btn-format");
  }

  init() {
    this._initEvents();
  }

  _initEvents() {
    this.btnSort?.addEventListener("click", (e) => {
      e.stopPropagation();
      this.sortModal?.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      const isInsideModal = e.target.closest(".sort-modal");
      const isBtnSort = e.target.closest("#sort-btn");
      if (!isInsideModal && !isBtnSort) {
        this.sortModal?.classList.remove("active");
      }
    });

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
  }
}