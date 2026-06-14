import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

async function check() {
  const templatePath = path.join(process.cwd(), 'public', 'facture themplate.pdf');
  const templateBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFDocument.load(templateBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  
  const { width, height } = firstPage.getSize();
  console.log(`Page Size: width = ${width}, height = ${height}`);
  
  // Check boxes
  console.log('MediaBox:', firstPage.getMediaBox());
  
  try {
    console.log('CropBox:', firstPage.getCropBox());
  } catch (e) {
    console.log('CropBox: not defined or error', e.message);
  }
  
  try {
    console.log('TrimBox:', firstPage.getTrimBox());
  } catch (e) {
    console.log('TrimBox: not defined or error', e.message);
  }
}

check().catch(console.error);
