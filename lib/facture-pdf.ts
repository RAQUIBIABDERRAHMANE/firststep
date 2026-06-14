import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import prisma from '@/lib/prisma'

export interface FactureData {
  factureNumber: string
  date: string
  clientName: string
  clientEmail: string
  clientCompany: string
  serviceName: string
  servicePrice: string
  subtotal: string
  total: string
}

export interface FieldPositions {
  dateX: number
  dateY: number
  clientNameX: number
  clientNameY: number
  clientEmailX: number
  clientEmailY: number
  clientCompanyX: number
  clientCompanyY: number
  serviceNameX: number
  serviceNameY: number
  servicePriceX: number
  servicePriceY: number
  subtotalX: number
  subtotalY: number
  totalX: number
  totalY: number
  factureNumberX: number
  factureNumberY: number
  fontSize: number
  fontColor: string

  factureNumberFontSize: number
  factureNumberFontColor: string
  factureNumberIsBold: boolean
  factureNumberIsItalic: boolean

  dateFontSize: number
  dateFontColor: string
  dateIsBold: boolean
  dateIsItalic: boolean

  clientCompanyFontSize: number
  clientCompanyFontColor: string
  clientCompanyIsBold: boolean
  clientCompanyIsItalic: boolean

  clientNameFontSize: number
  clientNameFontColor: string
  clientNameIsBold: boolean
  clientNameIsItalic: boolean

  clientEmailFontSize: number
  clientEmailFontColor: string
  clientEmailIsBold: boolean
  clientEmailIsItalic: boolean

  serviceNameFontSize: number
  serviceNameFontColor: string
  serviceNameIsBold: boolean
  serviceNameIsItalic: boolean

  servicePriceFontSize: number
  servicePriceFontColor: string
  servicePriceIsBold: boolean
  servicePriceIsItalic: boolean

  subtotalFontSize: number
  subtotalFontColor: string
  subtotalIsBold: boolean
  subtotalIsItalic: boolean

  totalFontSize: number
  totalFontColor: string
  totalIsBold: boolean
  totalIsItalic: boolean

  factureNumberFontFamily: string
  dateFontFamily: string
  clientCompanyFontFamily: string
  clientNameFontFamily: string
  clientEmailFontFamily: string
  serviceNameFontFamily: string
  servicePriceFontFamily: string
  subtotalFontFamily: string
  totalFontFamily: string
}

const DEFAULT_POSITIONS: FieldPositions = {
  dateX: 400,
  dateY: 700,
  clientNameX: 80,
  clientNameY: 620,
  clientEmailX: 80,
  clientEmailY: 600,
  clientCompanyX: 80,
  clientCompanyY: 640,
  serviceNameX: 80,
  serviceNameY: 480,
  servicePriceX: 450,
  servicePriceY: 480,
  subtotalX: 450,
  subtotalY: 200,
  totalX: 450,
  totalY: 170,
  factureNumberX: 400,
  factureNumberY: 730,
  fontSize: 12,
  fontColor: '#000000',

  factureNumberFontSize: 12,
  factureNumberFontColor: '#000000',
  factureNumberIsBold: true,
  factureNumberIsItalic: false,

  dateFontSize: 12,
  dateFontColor: '#000000',
  dateIsBold: false,
  dateIsItalic: false,

  clientCompanyFontSize: 12,
  clientCompanyFontColor: '#000000',
  clientCompanyIsBold: true,
  clientCompanyIsItalic: false,

  clientNameFontSize: 12,
  clientNameFontColor: '#000000',
  clientNameIsBold: false,
  clientNameIsItalic: false,

  clientEmailFontSize: 12,
  clientEmailFontColor: '#000000',
  clientEmailIsBold: false,
  clientEmailIsItalic: false,

  serviceNameFontSize: 12,
  serviceNameFontColor: '#000000',
  serviceNameIsBold: false,
  serviceNameIsItalic: false,

  servicePriceFontSize: 12,
  servicePriceFontColor: '#000000',
  servicePriceIsBold: false,
  servicePriceIsItalic: false,

  subtotalFontSize: 12,
  subtotalFontColor: '#000000',
  subtotalIsBold: false,
  subtotalIsItalic: false,

  totalFontSize: 14,
  totalFontColor: '#000000',
  totalIsBold: true,
  totalIsItalic: false,

  factureNumberFontFamily: 'Helvetica',
  dateFontFamily: 'Helvetica',
  clientCompanyFontFamily: 'Helvetica',
  clientNameFontFamily: 'Helvetica',
  clientEmailFontFamily: 'Helvetica',
  serviceNameFontFamily: 'Helvetica',
  servicePriceFontFamily: 'Helvetica',
  subtotalFontFamily: 'Helvetica',
  totalFontFamily: 'Helvetica',
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return rgb(0, 0, 0)
  return rgb(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  )
}

export async function getFieldPositions(): Promise<FieldPositions> {
  try {
    const template = await prisma.factureTemplate.findFirst()
    if (!template) return DEFAULT_POSITIONS
    return {
      dateX: template.dateX,
      dateY: template.dateY,
      clientNameX: template.clientNameX,
      clientNameY: template.clientNameY,
      clientEmailX: template.clientEmailX,
      clientEmailY: template.clientEmailY,
      clientCompanyX: template.clientCompanyX,
      clientCompanyY: template.clientCompanyY,
      serviceNameX: template.serviceNameX,
      serviceNameY: template.serviceNameY,
      servicePriceX: template.servicePriceX,
      servicePriceY: template.servicePriceY,
      subtotalX: template.subtotalX,
      subtotalY: template.subtotalY,
      totalX: template.totalX,
      totalY: template.totalY,
      factureNumberX: template.factureNumberX,
      factureNumberY: template.factureNumberY,
      fontSize: template.fontSize,
      fontColor: template.fontColor,

      factureNumberFontSize: template.factureNumberFontSize,
      factureNumberFontColor: template.factureNumberFontColor,
      factureNumberIsBold: template.factureNumberIsBold,
      factureNumberIsItalic: template.factureNumberIsItalic,

      dateFontSize: template.dateFontSize,
      dateFontColor: template.dateFontColor,
      dateIsBold: template.dateIsBold,
      dateIsItalic: template.dateIsItalic,

      clientCompanyFontSize: template.clientCompanyFontSize,
      clientCompanyFontColor: template.clientCompanyFontColor,
      clientCompanyIsBold: template.clientCompanyIsBold,
      clientCompanyIsItalic: template.clientCompanyIsItalic,

      clientNameFontSize: template.clientNameFontSize,
      clientNameFontColor: template.clientNameFontColor,
      clientNameIsBold: template.clientNameIsBold,
      clientNameIsItalic: template.clientNameIsItalic,

      clientEmailFontSize: template.clientEmailFontSize,
      clientEmailFontColor: template.clientEmailFontColor,
      clientEmailIsBold: template.clientEmailIsBold,
      clientEmailIsItalic: template.clientEmailIsItalic,

      serviceNameFontSize: template.serviceNameFontSize,
      serviceNameFontColor: template.serviceNameFontColor,
      serviceNameIsBold: template.serviceNameIsBold,
      serviceNameIsItalic: template.serviceNameIsItalic,

      servicePriceFontSize: template.servicePriceFontSize,
      servicePriceFontColor: template.servicePriceFontColor,
      servicePriceIsBold: template.servicePriceIsBold,
      servicePriceIsItalic: template.servicePriceIsItalic,

      subtotalFontSize: template.subtotalFontSize,
      subtotalFontColor: template.subtotalFontColor,
      subtotalIsBold: template.subtotalIsBold,
      subtotalIsItalic: template.subtotalIsItalic,

      totalFontSize: template.totalFontSize,
      totalFontColor: template.totalFontColor,
      totalIsBold: template.totalIsBold,
      totalIsItalic: template.totalIsItalic,

      factureNumberFontFamily: template.factureNumberFontFamily || 'Helvetica',
      dateFontFamily: template.dateFontFamily || 'Helvetica',
      clientCompanyFontFamily: template.clientCompanyFontFamily || 'Helvetica',
      clientNameFontFamily: template.clientNameFontFamily || 'Helvetica',
      clientEmailFontFamily: template.clientEmailFontFamily || 'Helvetica',
      serviceNameFontFamily: template.serviceNameFontFamily || 'Helvetica',
      servicePriceFontFamily: template.servicePriceFontFamily || 'Helvetica',
      subtotalFontFamily: template.subtotalFontFamily || 'Helvetica',
      totalFontFamily: template.totalFontFamily || 'Helvetica',
    }
  } catch {
    return DEFAULT_POSITIONS
  }
}

export async function generateFacturePdf(data: FactureData): Promise<Uint8Array> {
  // Read the template PDF
  const templatePath = path.join(process.cwd(), 'public', 'facture themplate.pdf')
  const templateBytes = fs.readFileSync(templatePath)

  // Load the PDF
  const pdfDoc = await PDFDocument.load(templateBytes)

  // Get the first page
  const pages = pdfDoc.getPages()
  const firstPage = pages[0]

  // Get CropBox boundaries to offset coordinates for page origin shifts dynamically
  const cropBox = firstPage.getCropBox()
  const xOffset = cropBox ? cropBox.x : 0
  const yOffset = cropBox ? cropBox.y : 0

  // Embed standard Helvetica fonts
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
  const helveticaBoldOblique = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique)

  // Embed standard Times-Roman fonts
  const times = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  const timesOblique = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic)
  const timesBoldOblique = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic)

  // Embed standard Courier fonts
  const courier = await pdfDoc.embedFont(StandardFonts.Courier)
  const courierBold = await pdfDoc.embedFont(StandardFonts.CourierBold)
  const courierOblique = await pdfDoc.embedFont(StandardFonts.CourierOblique)
  const courierBoldOblique = await pdfDoc.embedFont(StandardFonts.CourierBoldOblique)

  const getFont = (family: string, isBold: boolean, isItalic: boolean) => {
    const f = family?.toLowerCase();
    if (f === 'times' || f === 'timesroman' || f === 'times-roman' || f === 'times new roman') {
      if (isBold && isItalic) return timesBoldOblique
      if (isBold) return timesBold
      if (isItalic) return timesOblique
      return times
    } else if (f === 'courier' || f === 'courier new') {
      if (isBold && isItalic) return courierBoldOblique
      if (isBold) return courierBold
      if (isItalic) return courierOblique
      return courier
    } else {
      if (isBold && isItalic) return helveticaBoldOblique
      if (isBold) return helveticaBold
      if (isItalic) return helveticaOblique
      return helvetica
    }
  }

  // Get field positions from database
  const positions = await getFieldPositions()

  // Draw each field on the PDF
  // Facture Number
  firstPage.drawText(data.factureNumber, {
    x: positions.factureNumberX + xOffset,
    y: positions.factureNumberY + yOffset,
    size: positions.factureNumberFontSize,
    font: getFont(positions.factureNumberFontFamily, positions.factureNumberIsBold, positions.factureNumberIsItalic),
    color: hexToRgb(positions.factureNumberFontColor),
  })

  // Date
  firstPage.drawText(data.date, {
    x: positions.dateX + xOffset,
    y: positions.dateY + yOffset,
    size: positions.dateFontSize,
    font: getFont(positions.dateFontFamily, positions.dateIsBold, positions.dateIsItalic),
    color: hexToRgb(positions.dateFontColor),
  })

  // Client Company
  firstPage.drawText(data.clientCompany, {
    x: positions.clientCompanyX + xOffset,
    y: positions.clientCompanyY + yOffset,
    size: positions.clientCompanyFontSize,
    font: getFont(positions.clientCompanyFontFamily, positions.clientCompanyIsBold, positions.clientCompanyIsItalic),
    color: hexToRgb(positions.clientCompanyFontColor),
  })

  // Client Name
  firstPage.drawText(data.clientName, {
    x: positions.clientNameX + xOffset,
    y: positions.clientNameY + yOffset,
    size: positions.clientNameFontSize,
    font: getFont(positions.clientNameFontFamily, positions.clientNameIsBold, positions.clientNameIsItalic),
    color: hexToRgb(positions.clientNameFontColor),
  })

  // Client Email
  firstPage.drawText(data.clientEmail, {
    x: positions.clientEmailX + xOffset,
    y: positions.clientEmailY + yOffset,
    size: positions.clientEmailFontSize,
    font: getFont(positions.clientEmailFontFamily, positions.clientEmailIsBold, positions.clientEmailIsItalic),
    color: hexToRgb(positions.clientEmailFontColor),
  })

  // Service Name
  firstPage.drawText(data.serviceName, {
    x: positions.serviceNameX + xOffset,
    y: positions.serviceNameY + yOffset,
    size: positions.serviceNameFontSize,
    font: getFont(positions.serviceNameFontFamily, positions.serviceNameIsBold, positions.serviceNameIsItalic),
    color: hexToRgb(positions.serviceNameFontColor),
  })

  // Service Price (Montant Service)
  firstPage.drawText(data.servicePrice, {
    x: positions.servicePriceX + xOffset,
    y: positions.servicePriceY + yOffset,
    size: positions.servicePriceFontSize,
    font: getFont(positions.servicePriceFontFamily, positions.servicePriceIsBold, positions.servicePriceIsItalic),
    color: hexToRgb(positions.servicePriceFontColor),
  })

  // Subtotal
  firstPage.drawText(data.subtotal, {
    x: positions.subtotalX + xOffset,
    y: positions.subtotalY + yOffset,
    size: positions.subtotalFontSize,
    font: getFont(positions.subtotalFontFamily, positions.subtotalIsBold, positions.subtotalIsItalic),
    color: hexToRgb(positions.subtotalFontColor),
  })

  // Total
  firstPage.drawText(data.total, {
    x: positions.totalX + xOffset,
    y: positions.totalY + yOffset,
    size: positions.totalFontSize,
    font: getFont(positions.totalFontFamily, positions.totalIsBold, positions.totalIsItalic),
    color: hexToRgb(positions.totalFontColor),
  })

  // Serialize the PDF
  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

export async function generateNextFactureNumber(): Promise<string> {
  const year = new Date().getFullYear()

  // Upsert the counter for the current year
  const counter = await prisma.factureCounter.upsert({
    where: { year },
    update: { nextNumber: { increment: 1 } },
    create: { year, nextNumber: 2 },
  })

  // The number we use is nextNumber - 1 (since we already incremented)
  const num = counter.nextNumber - 1
  return `FS-${year}-${String(num).padStart(4, '0')}`
}

export function getSampleFactureData(): FactureData {
  return {
    factureNumber: 'FS-2026-0001',
    date: new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }),
    clientName: 'Mohammed Alaoui',
    clientEmail: 'mohammed@example.com',
    clientCompany: 'Entreprise ABC SARL',
    serviceName: 'Site Web Restaurant',
    servicePrice: '2,500.00 MAD',
    subtotal: '2,500.00 MAD',
    total: '2,500.00 MAD',
  }
}
