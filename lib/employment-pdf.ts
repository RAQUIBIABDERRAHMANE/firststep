import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import prisma from './prisma'


export interface EmploymentAgreementData {
  date: string
  employeeName: string
  employeeCin: string
  startDate: string
  revenueShare: string
  employeeSignName: string
  employeeSignDate: string
}

export interface EmploymentTemplatePositions {
  dateX: number
  dateY: number
  employeeNameX: number
  employeeNameY: number
  employeeCinX: number
  employeeCinY: number
  startDateX: number
  startDateY: number
  revenueShareX: number
  revenueShareY: number
  employeeSignNameX: number
  employeeSignNameY: number
  employeeSignDateX: number
  employeeSignDateY: number

  dateEnabled: boolean
  employeeNameEnabled: boolean
  employeeCinEnabled: boolean
  startDateEnabled: boolean
  revenueShareEnabled: boolean
  employeeSignNameEnabled: boolean
  employeeSignDateEnabled: boolean

  fontSize: number
  fontColor: string

  dateFontSize: number
  dateFontColor: string
  dateIsBold: boolean
  dateIsItalic: boolean
  dateFontFamily: string

  employeeNameFontSize: number
  employeeNameFontColor: string
  employeeNameIsBold: boolean
  employeeNameIsItalic: boolean
  employeeNameFontFamily: string

  employeeCinFontSize: number
  employeeCinFontColor: string
  employeeCinIsBold: boolean
  employeeCinIsItalic: boolean
  employeeCinFontFamily: string

  startDateFontSize: number
  startDateFontColor: string
  startDateIsBold: boolean
  startDateIsItalic: boolean
  startDateFontFamily: string

  revenueShareFontSize: number
  revenueShareFontColor: string
  revenueShareIsBold: boolean
  revenueShareIsItalic: boolean
  revenueShareFontFamily: string

  employeeSignNameFontSize: number
  employeeSignNameFontColor: string
  employeeSignNameIsBold: boolean
  employeeSignNameIsItalic: boolean
  employeeSignNameFontFamily: string

  employeeSignDateFontSize: number
  employeeSignDateFontColor: string
  employeeSignDateIsBold: boolean
  employeeSignDateIsItalic: boolean
  employeeSignDateFontFamily: string
}

export const DEFAULT_EMPLOYMENT_POSITIONS: EmploymentTemplatePositions = {
  dateX: 235,
  dateY: 687,
  employeeNameX: 125,
  employeeNameY: 647,
  employeeCinX: 60,
  employeeCinY: 627,
  startDateX: 125,
  startDateY: 607,
  revenueShareX: 180,
  revenueShareY: 436,
  employeeSignNameX: 120,
  employeeSignNameY: 165,
  employeeSignDateX: 125,
  employeeSignDateY: 120,

  dateEnabled: true,
  employeeNameEnabled: true,
  employeeCinEnabled: true,
  startDateEnabled: true,
  revenueShareEnabled: true,
  employeeSignNameEnabled: true,
  employeeSignDateEnabled: true,

  fontSize: 11,
  fontColor: '#000000',

  dateFontSize: 11,
  dateFontColor: '#000000',
  dateIsBold: true,
  dateIsItalic: false,
  dateFontFamily: 'Helvetica',

  employeeNameFontSize: 11,
  employeeNameFontColor: '#000000',
  employeeNameIsBold: true,
  employeeNameIsItalic: false,
  employeeNameFontFamily: 'Helvetica',

  employeeCinFontSize: 10,
  employeeCinFontColor: '#000000',
  employeeCinIsBold: false,
  employeeCinIsItalic: false,
  employeeCinFontFamily: 'Helvetica',

  startDateFontSize: 11,
  startDateFontColor: '#000000',
  startDateIsBold: true,
  startDateIsItalic: false,
  startDateFontFamily: 'Helvetica',

  revenueShareFontSize: 11,
  revenueShareFontColor: '#0277bd',
  revenueShareIsBold: true,
  revenueShareIsItalic: false,
  revenueShareFontFamily: 'Helvetica',

  employeeSignNameFontSize: 11,
  employeeSignNameFontColor: '#000000',
  employeeSignNameIsBold: true,
  employeeSignNameIsItalic: false,
  employeeSignNameFontFamily: 'Helvetica',

  employeeSignDateFontSize: 10,
  employeeSignDateFontColor: '#000000',
  employeeSignDateIsBold: false,
  employeeSignDateIsItalic: false,
  employeeSignDateFontFamily: 'Helvetica',
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

function sanitizeText(text: string | null | undefined): string {
  if (!text) return ''
  return text.replace(/[\u202F\u00A0]/g, ' ')
}

export async function getEmploymentTemplatePositions(): Promise<EmploymentTemplatePositions> {
  try {
    const template = await prisma.employmentAgreementTemplate.findFirst()
    if (!template) return DEFAULT_EMPLOYMENT_POSITIONS
    return {
      dateX: template.dateX,
      dateY: template.dateY,
      employeeNameX: template.employeeNameX,
      employeeNameY: template.employeeNameY,
      employeeCinX: template.employeeCinX,
      employeeCinY: template.employeeCinY,
      startDateX: template.startDateX,
      startDateY: template.startDateY,
      revenueShareX: template.revenueShareX,
      revenueShareY: template.revenueShareY,
      employeeSignNameX: template.employeeSignNameX,
      employeeSignNameY: template.employeeSignNameY,
      employeeSignDateX: template.employeeSignDateX,
      employeeSignDateY: template.employeeSignDateY,

      dateEnabled: template.dateEnabled ?? true,
      employeeNameEnabled: template.employeeNameEnabled ?? true,
      employeeCinEnabled: template.employeeCinEnabled ?? true,
      startDateEnabled: template.startDateEnabled ?? true,
      revenueShareEnabled: template.revenueShareEnabled ?? true,
      employeeSignNameEnabled: template.employeeSignNameEnabled ?? true,
      employeeSignDateEnabled: template.employeeSignDateEnabled ?? true,

      fontSize: template.fontSize,
      fontColor: template.fontColor,

      dateFontSize: template.dateFontSize,
      dateFontColor: template.dateFontColor,
      dateIsBold: template.dateIsBold,
      dateIsItalic: template.dateIsItalic,
      dateFontFamily: template.dateFontFamily || 'Helvetica',

      employeeNameFontSize: template.employeeNameFontSize,
      employeeNameFontColor: template.employeeNameFontColor,
      employeeNameIsBold: template.employeeNameIsBold,
      employeeNameIsItalic: template.employeeNameIsItalic,
      employeeNameFontFamily: template.employeeNameFontFamily || 'Helvetica',

      employeeCinFontSize: template.employeeCinFontSize,
      employeeCinFontColor: template.employeeCinFontColor,
      employeeCinIsBold: template.employeeCinIsBold,
      employeeCinIsItalic: template.employeeCinIsItalic,
      employeeCinFontFamily: template.employeeCinFontFamily || 'Helvetica',

      startDateFontSize: template.startDateFontSize,
      startDateFontColor: template.startDateFontColor,
      startDateIsBold: template.startDateIsBold,
      startDateIsItalic: template.startDateIsItalic,
      startDateFontFamily: template.startDateFontFamily || 'Helvetica',

      revenueShareFontSize: template.revenueShareFontSize,
      revenueShareFontColor: template.revenueShareFontColor,
      revenueShareIsBold: template.revenueShareIsBold,
      revenueShareIsItalic: template.revenueShareIsItalic,
      revenueShareFontFamily: template.revenueShareFontFamily || 'Helvetica',

      employeeSignNameFontSize: template.employeeSignNameFontSize,
      employeeSignNameFontColor: template.employeeSignNameFontColor,
      employeeSignNameIsBold: template.employeeSignNameIsBold,
      employeeSignNameIsItalic: template.employeeSignNameIsItalic,
      employeeSignNameFontFamily: template.employeeSignNameFontFamily || 'Helvetica',

      employeeSignDateFontSize: template.employeeSignDateFontSize,
      employeeSignDateFontColor: template.employeeSignDateFontColor,
      employeeSignDateIsBold: template.employeeSignDateIsBold,
      employeeSignDateIsItalic: template.employeeSignDateIsItalic,
      employeeSignDateFontFamily: template.employeeSignDateFontFamily || 'Helvetica',
    }
  } catch {
    return DEFAULT_EMPLOYMENT_POSITIONS
  }
}

export async function generateEmploymentAgreementPdf(
  data: EmploymentAgreementData
): Promise<Uint8Array> {
  const templatePath = path.join(process.cwd(), 'public', 'developer-employment-agreement.pdf')
  if (!fs.existsSync(templatePath)) {
    throw new Error('Agreement PDF template missing. Run template script first.')
  }
  const templateBytes = fs.readFileSync(templatePath)
  const pdfDoc = await PDFDocument.load(templateBytes)

  const pages = pdfDoc.getPages()
  const firstPage = pages[0]

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
  const helveticaBoldOblique = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique)

  const times = await pdfDoc.embedFont(StandardFonts.TimesRoman)
  const timesBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)
  const timesOblique = await pdfDoc.embedFont(StandardFonts.TimesRomanItalic)
  const timesBoldOblique = await pdfDoc.embedFont(StandardFonts.TimesRomanBoldItalic)

  const courier = await pdfDoc.embedFont(StandardFonts.Courier)
  const courierBold = await pdfDoc.embedFont(StandardFonts.CourierBold)
  const courierOblique = await pdfDoc.embedFont(StandardFonts.CourierOblique)
  const courierBoldOblique = await pdfDoc.embedFont(StandardFonts.CourierBoldOblique)

  const getFont = (family: string, isBold: boolean, isItalic: boolean) => {
    const f = family?.toLowerCase()
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

  const positions = await getEmploymentTemplatePositions()

  // Agreement Date
  if (data.date && positions.dateEnabled !== false) {
    firstPage.drawText(sanitizeText(data.date), {
      x: positions.dateX,
      y: positions.dateY,
      size: positions.dateFontSize,
      font: getFont(positions.dateFontFamily, positions.dateIsBold, positions.dateIsItalic),
      color: hexToRgb(positions.dateFontColor),
    })
  }

  // Employee Name
  if (data.employeeName && positions.employeeNameEnabled !== false) {
    firstPage.drawText(sanitizeText(data.employeeName), {
      x: positions.employeeNameX,
      y: positions.employeeNameY,
      size: positions.employeeNameFontSize,
      font: getFont(
        positions.employeeNameFontFamily,
        positions.employeeNameIsBold,
        positions.employeeNameIsItalic
      ),
      color: hexToRgb(positions.employeeNameFontColor),
    })
  }

  // Start Date
  if (data.startDate && positions.startDateEnabled !== false) {
    firstPage.drawText(sanitizeText(data.startDate), {
      x: positions.startDateX,
      y: positions.startDateY,
      size: positions.startDateFontSize,
      font: getFont(
        positions.startDateFontFamily,
        positions.startDateIsBold,
        positions.startDateIsItalic
      ),
      color: hexToRgb(positions.startDateFontColor),
    })
  }

  // Revenue Share Percentage
  if (data.revenueShare && positions.revenueShareEnabled !== false) {
    const revText = `${sanitizeText(String(data.revenueShare))}%`
    firstPage.drawText(revText, {
      x: positions.revenueShareX,
      y: positions.revenueShareY,
      size: positions.revenueShareFontSize,
      font: getFont(
        positions.revenueShareFontFamily,
        positions.revenueShareIsBold,
        positions.revenueShareIsItalic
      ),
      color: hexToRgb(positions.revenueShareFontColor),
    })
  }

  // Employee Signature Name
  if ((data.employeeSignName || data.employeeName) && positions.employeeSignNameEnabled !== false) {
    const signName = data.employeeSignName || data.employeeName
    firstPage.drawText(sanitizeText(signName), {
      x: positions.employeeSignNameX,
      y: positions.employeeSignNameY,
      size: positions.employeeSignNameFontSize,
      font: getFont(
        positions.employeeSignNameFontFamily,
        positions.employeeSignNameIsBold,
        positions.employeeSignNameIsItalic
      ),
      color: hexToRgb(positions.employeeSignNameFontColor),
    })
  }

  // Employee Signature Date
  if ((data.employeeSignDate || data.date) && positions.employeeSignDateEnabled !== false) {
    const signDate = data.employeeSignDate || data.date
    firstPage.drawText(sanitizeText(signDate), {
      x: positions.employeeSignDateX,
      y: positions.employeeSignDateY,
      size: positions.employeeSignDateFontSize,
      font: getFont(
        positions.employeeSignDateFontFamily,
        positions.employeeSignDateIsBold,
        positions.employeeSignDateIsItalic
      ),
      color: hexToRgb(positions.employeeSignDateFontColor),
    })
  }

  return await pdfDoc.save()
}



export function getSampleEmploymentData(): EmploymentAgreementData {
  const today = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  return {
    date: today,
    employeeName: 'Yassine El Amrani',
    employeeCin: 'AB123456',
    startDate: today,
    revenueShare: '15',
    employeeSignName: 'Yassine El Amrani',
    employeeSignDate: today,
  }
}
