import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

async function createAgreementTemplatePdf() {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.5, 842.25]) // Standard A4 page size
  const { width, height } = page.getSize()


  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)

  // Colors
  const darkText = rgb(0.1, 0.1, 0.1)
  const primaryBlue = rgb(0.01, 0.48, 0.77) // #0277bd
  const lightGray = rgb(0.94, 0.95, 0.96)
  const mutedText = rgb(0.3, 0.3, 0.3)

  // Header - Right Side Info
  page.drawText('+212-6658-30816', {
    x: 440,
    y: height - 40,
    size: 10,
    font: fontRegular,
    color: darkText,
  })
  page.drawText('contact@firststepco.com', {
    x: 440,
    y: height - 54,
    size: 10,
    font: fontRegular,
    color: darkText,
  })
  page.drawText('www.firststepco.com', {
    x: 440,
    y: height - 68,
    size: 10,
    font: fontRegular,
    color: darkText,
  })

  // Header - Left Side Logo Badge (Rounded Box)
  page.drawRectangle({
    x: 60,
    y: height - 75,
    width: 45,
    height: 45,
    color: primaryBlue,
    borderWidth: 0,
  })
  page.drawText('FS', {
    x: 72,
    y: height - 62,
    size: 22,
    font: fontBold,
    color: rgb(1, 1, 1),
  })

  page.drawText('FIRST STEP', {
    x: 115,
    y: height - 48,
    size: 13,
    font: fontBold,
    color: darkText,
  })
  page.drawText('SAAS PLATFORM', {
    x: 115,
    y: height - 62,
    size: 12,
    font: fontBold,
    color: darkText,
  })

  // Title
  let y = height - 120
  page.drawText('DEVELOPER EMPLOYMENT Agreement', {
    x: 60,
    y: y,
    size: 20,
    font: fontBold,
    color: primaryBlue,
  })

  // Preamble section box background
  y -= 35
  page.drawText('This Agreement is made on', {
    x: 60,
    y: y,
    size: 11,
    font: fontBold,
    color: darkText,
  })

  page.drawText('between:', {
    x: 60,
    y: y - 18,
    size: 11,
    font: fontRegular,
    color: darkText,
  })

  // Employee & Employer Details
  y -= 40
  page.drawText('Employee:', {
    x: 60,
    y: y,
    size: 11,
    font: fontBold,
    color: darkText,
  })
  // Placeholder line for Employee Name
  page.drawLine({
    start: { x: 120, y: y - 2 },
    end: { x: 260, y: y - 2 },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  })

  page.drawText('and Employer:', {
    x: 270,
    y: y,
    size: 11,
    font: fontBold,
    color: darkText,
  })
  page.drawText('FirstStep - Founder : Abderrahmane Raquibi', {
    x: 350,
    y: y,
    size: 10.5,
    font: fontBold,
    color: darkText,
  })

  y -= 20
  page.drawText('Position Held:', {
    x: 60,
    y: y,
    size: 11,
    font: fontBold,
    color: darkText,
  })
  page.drawText('Software Developer', {
    x: 140,
    y: y,
    size: 11,
    font: fontBold,
    color: primaryBlue,
  })

  y -= 20
  page.drawText('Start Date:', {
    x: 60,
    y: y,
    size: 11,
    font: fontBold,
    color: darkText,
  })
  page.drawLine({
    start: { x: 120, y: y - 2 },
    end: { x: 260, y: y - 2 },
    thickness: 0.5,
    color: rgb(0.7, 0.7, 0.7),
  })

  // Section 1: Developer Responsibilities / Reason for Separation
  y -= 35
  page.drawText('1. Developer Responsibilities', {
    x: 60,
    y: y,
    size: 12,
    font: fontBold,
    color: darkText,
  })

  y -= 16
  page.drawText('The Developer will:', {
    x: 60,
    y: y,
    size: 10.5,
    font: fontRegular,
    color: darkText,
  })

  const responsibilities = [
    'Build and maintain web applications',
    'Work with frontend/backend technologies and APIs',
    'Collaborate with the FirstStep team to deliver products',
  ]

  responsibilities.forEach((resp) => {
    y -= 15
    page.drawText('•', { x: 75, y: y, size: 10, font: fontBold, color: primaryBlue })
    page.drawText(resp, { x: 88, y: y, size: 10, font: fontRegular, color: darkText })
  })

  // Section 2: Compensation
  y -= 30
  page.drawText('2. Final Compensation', {
    x: 60,
    y: y,
    size: 12,
    font: fontBold,
    color: darkText,
  })

  const compensations = [
    'No fixed salary',
    'Paid % of revenue from websites/projects the Developer directly contributes to',
    'Revenue Share:           % per project',
    'Payment is issued after the client fully pays',
    'No work = no payment',
  ]

  compensations.forEach((comp) => {
    y -= 15
    page.drawText('•', { x: 75, y: y, size: 10, font: fontBold, color: primaryBlue })
    page.drawText(comp, { x: 88, y: y, size: 10, font: fontRegular, color: darkText })
  })

  // Section 3: Confidentiality & NDA
  y -= 30
  page.drawText('3. Confidentiality & Non-Disclosure', {
    x: 60,
    y: y,
    size: 12,
    font: fontBold,
    color: darkText,
  })

  y -= 16
  page.drawText('The Developer agrees to keep all company information confidential, including:', {
    x: 60,
    y: y,
    size: 10,
    font: fontRegular,
    color: darkText,
  })

  const ndaItems = ['Source code', 'Business ideas', 'Client and company data']
  ndaItems.forEach((item) => {
    y -= 14
    page.drawText('•', { x: 75, y: y, size: 10, font: fontBold, color: primaryBlue })
    page.drawText(item, { x: 88, y: y, size: 10, font: fontRegular, color: darkText })
  })

  y -= 16
  page.drawText('This obligation continues even after leaving the company.', {
    x: 60,
    y: y,
    size: 10,
    font: fontOblique,
    color: mutedText,
  })

  // Section 4: Ownership
  y -= 30
  page.drawText('4. Ownership of Work', {
    x: 60,
    y: y,
    size: 12,
    font: fontBold,
    color: darkText,
  })

  y -= 16
  page.drawText(
    'All code, designs, and projects developed for FirstStep are 100% owned by FirstStep.',
    {
      x: 60,
      y: y,
      size: 10,
      font: fontRegular,
      color: darkText,
    }
  )

  // Bottom Signature Area
  const sigY = 120

  // Left side - Employee signature area
  page.drawLine({ start: { x: 90, y: sigY + 40 }, end: { x: 260, y: sigY + 40 }, thickness: 1, color: rgb(0.7, 0.7, 0.7) })
  page.drawText('Employee', { x: 150, y: sigY + 25, size: 12, font: fontBold, color: darkText })
  page.drawText('Date:', { x: 90, y: sigY, size: 10, font: fontRegular, color: darkText })
  page.drawLine({ start: { x: 120, y: sigY - 2 }, end: { x: 260, y: sigY - 2 }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) })

  // Right side - Employer signature area
  page.drawText('ABDERRAHMANE RAQUIBI', { x: 350, y: sigY + 45, size: 12, font: fontBold, color: darkText })
  page.drawLine({ start: { x: 340, y: sigY + 40 }, end: { x: 520, y: sigY + 40 }, thickness: 1, color: rgb(0.7, 0.7, 0.7) })
  page.drawText('Employer', { x: 410, y: sigY + 25, size: 12, font: fontBold, color: darkText })
  page.drawText('Date:', { x: 340, y: sigY, size: 10, font: fontRegular, color: darkText })
  page.drawLine({ start: { x: 370, y: sigY - 2 }, end: { x: 520, y: sigY - 2 }, thickness: 0.5, color: rgb(0.7, 0.7, 0.7) })


  // Decorative Bottom Curve graphic
  page.drawRectangle({
    x: 0,
    y: 0,
    width: 612,
    height: 18,
    color: primaryBlue,
  })

  const pdfBytes = await pdfDoc.save()
  const outputPath = path.join(process.cwd(), 'public', 'developer-employment-agreement.pdf')
  fs.writeFileSync(outputPath, pdfBytes)
  console.log(`✅ Base Employment Agreement PDF template written to: ${outputPath}`)
}

createAgreementTemplatePdf().catch(console.error)
