/**
 * High-Reliability Client-Side PDF Text Extractor
 * Uses window.pdfjsLib with intelligent text stream and layout reconstruction
 */
export async function extractTextFromPdf(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();

    // Check for window.pdfjsLib (loaded via CDN)
    let pdfjs = window.pdfjsLib;

    if (!pdfjs) {
      // Fallback to dynamic import if CDN wasn't cached yet
      try {
        pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
      } catch (e) {
        console.warn('Dynamic import fallback for pdfjs:', e);
      }
    }

    if (pdfjs) {
      if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }

      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;

      let fullText = '';
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageStrings = textContent.items
          .map((item) => ('str' in item ? item.str : ''))
          .filter(Boolean);
        fullText += pageStrings.join(' ') + '\n\n';
      }

      if (fullText.trim().length > 30) {
        return fullText;
      }
    }

    throw new Error('PDF.js text was insufficient');
  } catch (error) {
    console.warn('PDF.js parsing error, attempting stream reconstruction:', error);

    // Byte-level PDF stream decoder fallback
    try {
      const buffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(buffer);
      const binaryString = new TextDecoder('latin1').decode(uint8Array);

      const textMatches = [];
      const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
      let match;
      while ((match = streamRegex.exec(binaryString)) !== null) {
        const streamData = match[1];
        const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
        let tjMatch;
        while ((tjMatch = tjRegex.exec(streamData)) !== null) {
          if (tjMatch[1] && tjMatch[1].length > 1) {
            textMatches.push(tjMatch[1]);
          }
        }
      }

      if (textMatches.length > 5) {
        return textMatches.join(' ');
      }
    } catch (fallbackErr) {
      console.error('Fallback error:', fallbackErr);
    }

    throw new Error('Could not parse PDF text. Please copy and paste your resume text in the Paste Text tab.');
  }
}
