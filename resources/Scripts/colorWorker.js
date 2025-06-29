// colorWorker.js
self.importScripts('/resources/Scripts/colorThief.umd.js');

self.onmessage = async function (e) {
  const bitmap = e.data; // already an ImageBitmap

  try {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);

    const colorThief = new ColorThief();
    const color = colorThief.getColor(canvas);

    self.postMessage({ success: true, color });
  } catch (err) {
    self.postMessage({ success: false, error: err.message });
  }
};
