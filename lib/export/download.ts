/** Triggers a browser download for a generated file. */
export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = window.document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  window.document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Revoking synchronously cancels the download in Firefox/Safari.
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/**
 * Opens the browser print dialog ("Save as PDF"). Browsers use the page title
 * as the suggested PDF file name, so it is swapped for the export name while
 * the dialog is open. `pageCss` can override the default A4 `@page` rule.
 */
export function printDocument(fileTitle: string, pageCss?: string): void {
  const previousTitle = window.document.title;
  window.document.title = fileTitle;

  let style: HTMLStyleElement | null = null;
  if (pageCss) {
    style = window.document.createElement("style");
    style.setAttribute("data-print-page", "");
    style.textContent = `@media print { ${pageCss} }`;
    window.document.head.appendChild(style);
  }

  const restore = () => {
    window.document.title = previousTitle;
    style?.remove();
    window.removeEventListener("afterprint", restore);
  };
  window.addEventListener("afterprint", restore);
  window.print();
  // Some browsers never fire `afterprint` (e.g. when the dialog is blocked).
  window.setTimeout(restore, 60_000);
}
