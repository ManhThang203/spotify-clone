const $ = document.querySelector.bind(document);

export function initTooltip() {
  const attachTooltip = (btnSelector, tooltipSelector) => {
    const btn = $(btnSelector);
    const tooltip = $(tooltipSelector);
    if (btn && tooltip) {
      btn.addEventListener("mouseenter", () => {
        tooltip.classList.add("active");
      });
      btn.addEventListener("mouseleave", () => {
        tooltip.classList.remove("active");
      });
    }
  };

  attachTooltip("#btn-ramdom", "#tooltip-random");
  attachTooltip("#btn-prev", "#tooltip-prev");
  attachTooltip("#btn-pause", "#tooltip-pause");
  attachTooltip("#btn-next", "#tooltip-next");
  attachTooltip("#btn-loop", "#tooltip-loop");
  attachTooltip("#btn-song", "#tooltip-song");
  attachTooltip("#btn-sound", "#tooltip-sound");
  attachTooltip("#btn-full_screen", "#tooltip-full_screen");
  attachTooltip("#btn-like_song", "#tooltip-like_song");
  attachTooltip("#btn-home", "#tooltip-home");
  attachTooltip("#btn-search_library", "#tooltip-search_library");
  attachTooltip("#btn-create", "#tooltip-create");
}