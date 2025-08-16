export function formatTime(sec) {
  const s = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  const m = Math.floor(sec / 60) % 60; // chia cho 60 để chuyển qua phát ròi lại chưa lấy dư cho 60 ddeere láy ra số phút từ 0 - 59
  const h = Math.floor(sec / 3600);
  if (h > 0) {
    const mm = Math.floor((sec % 3600) / 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${mm}:${s}`;
  }
  return `${m}:${s}`;
}
