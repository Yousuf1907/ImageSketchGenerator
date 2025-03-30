document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const dropZone = document.getElementById("dropZone");
  const originalCanvas = document.getElementById("originalCanvas");
  const sketchCanvas = document.getElementById("sketchCanvas");
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const sketchType = document.getElementById("sketchType");
  const intensity = document.getElementById("intensity");

  let originalImage = null;

  // Handle drag & drop
  dropZone.addEventListener("click", () => fileInput.click());
  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.background = "#f0f0f0";
  });
  dropZone.addEventListener("dragleave", () => {
    dropZone.style.background = "";
  });
  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.background = "";
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      loadImage(e.dataTransfer.files[0]);
    }
  });

  // Handle file selection
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length) {
      loadImage(e.target.files[0]);
    }
  });

  function loadImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      originalImage = new Image();
      originalImage.onload = () => {
        drawOriginalImage();
        generateBtn.disabled = false;
      };
      originalImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function drawOriginalImage() {
    const ctx = originalCanvas.getContext("2d");
    originalCanvas.width = originalImage.width;
    originalCanvas.height = originalImage.height;
    ctx.drawImage(originalImage, 0, 0);
  }

  // Generate sketch
  generateBtn.addEventListener("click", () => {
    if (!originalImage) return;

    const sketchCtx = sketchCanvas.getContext("2d");
    sketchCanvas.width = originalCanvas.width;
    sketchCanvas.height = originalCanvas.height;

    // Apply filters (simplified for frontend)
    sketchCtx.filter = "grayscale(100%) contrast(150%)";
    sketchCtx.drawImage(originalImage, 0, 0);

    // Edge detection (simulated)
    const imageData = sketchCtx.getImageData(
      0,
      0,
      sketchCanvas.width,
      sketchCanvas.height
    );
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg > 128 ? 255 : 0;
    }

    sketchCtx.putImageData(imageData, 0, 0);
    downloadBtn.disabled = false;
  });

  // Download sketch
  downloadBtn.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "sketch.png";
    link.href = sketchCanvas.toDataURL("image/png");
    link.click();
  });
});
