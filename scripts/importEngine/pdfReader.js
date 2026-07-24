import PDFParser from "pdf2json";

export function readPdf(filePath) {
  return new Promise((resolve, reject) => {
    const parser = new PDFParser();

    parser.on("pdfParser_dataError", (err) => {
      reject(err.parserError || err);
    });

    parser.on("pdfParser_dataReady", (pdf) => {
      const pages = pdf.Pages.map((page) => {
        return page.Texts.map((item) => ({
          x: item.x,
          y: item.y,
          text: item.R
  .map((r) => {
    try {
      return decodeURIComponent(r.T);
    } catch {
      return r.T;
    }
  })
  .join("")
        }));
      });

      resolve(pages);
    });

    parser.loadPDF(filePath);
  });
}