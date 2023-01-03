export function downloadSVGAsPNG(e, svg, name) {
  console.log(e, svg);
  const canvas = document.createElement("canvas");
  const base64doc = Buffer.from(svg.outerHTML, "utf8").toString("base64");
  // const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
  const w = parseInt(svg.getAttribute("width"));
  const h = parseInt(svg.getAttribute("height"));
  const img_to_download = document.createElement("img");
  img_to_download.src = "data:image/svg+xml;base64," + base64doc;
  img_to_download.onload = function () {
    canvas.setAttribute("width", w);
    canvas.setAttribute("height", h);
    const context = canvas.getContext("2d");
    context.drawImage(img_to_download, 0, 0, w, h);
    const dataURL = canvas.toDataURL("image/png");
    if (window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(canvas.msToBlob(), "download.png");
      e.preventDefault();
    } else {
      const a = document.createElement("a");
      const my_evt = new MouseEvent("click");
      a.download = name + ".png";
      a.href = dataURL;
      a.dispatchEvent(my_evt);
    }
  };
}
