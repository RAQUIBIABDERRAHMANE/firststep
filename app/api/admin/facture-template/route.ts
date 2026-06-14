import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/app/actions/auth'

// GET: Return current field positions & styles
export async function GET() {
  const user = await getCurrentUser()
  console.log('[API] GET /api/admin/facture-template - user:', user ? `${user.email} (${user.role})` : 'null')
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const template = await prisma.factureTemplate.findFirst()
    return NextResponse.json({
      success: true,
      template: template || {
        dateX: 400, dateY: 700,
        clientNameX: 80, clientNameY: 620,
        clientEmailX: 80, clientEmailY: 600,
        clientCompanyX: 80, clientCompanyY: 640,
        serviceNameX: 80, serviceNameY: 480,
        servicePriceX: 450, servicePriceY: 480,
        subtotalX: 450, subtotalY: 200,
        totalX: 450, totalY: 170,
        factureNumberX: 400, factureNumberY: 730,
        fontSize: 12,
        fontColor: '#000000',

        factureNumberFontSize: 12,
        factureNumberFontColor: '#000000',
        factureNumberIsBold: true,
        factureNumberIsItalic: false,
        factureNumberFontFamily: 'Helvetica',

        dateFontSize: 12,
        dateFontColor: '#000000',
        dateIsBold: false,
        dateIsItalic: false,
        dateFontFamily: 'Helvetica',

        clientCompanyFontSize: 12,
        clientCompanyFontColor: '#000000',
        clientCompanyIsBold: true,
        clientCompanyIsItalic: false,
        clientCompanyFontFamily: 'Helvetica',

        clientNameFontSize: 12,
        clientNameFontColor: '#000000',
        clientNameIsBold: false,
        clientNameIsItalic: false,
        clientNameFontFamily: 'Helvetica',

        clientEmailFontSize: 12,
        clientEmailFontColor: '#000000',
        clientEmailIsBold: false,
        clientEmailIsItalic: false,
        clientEmailFontFamily: 'Helvetica',

        serviceNameFontSize: 12,
        serviceNameFontColor: '#000000',
        serviceNameIsBold: false,
        serviceNameIsItalic: false,
        serviceNameFontFamily: 'Helvetica',

        servicePriceFontSize: 12,
        servicePriceFontColor: '#000000',
        servicePriceIsBold: false,
        servicePriceIsItalic: false,
        servicePriceFontFamily: 'Helvetica',

        subtotalFontSize: 12,
        subtotalFontColor: '#000000',
        subtotalIsBold: false,
        subtotalIsItalic: false,
        subtotalFontFamily: 'Helvetica',

        totalFontSize: 14,
        totalFontColor: '#000000',
        totalIsBold: true,
        totalIsItalic: false,
        totalFontFamily: 'Helvetica',
      }
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch template' }, { status: 500 })
  }
}

// POST: Save field positions & styles
export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  console.log('[API] POST /api/admin/facture-template - user:', user ? `${user.email} (${user.role})` : 'null')
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      dateX, dateY,
      clientNameX, clientNameY,
      clientEmailX, clientEmailY,
      clientCompanyX, clientCompanyY,
      serviceNameX, serviceNameY,
      servicePriceX, servicePriceY,
      subtotalX, subtotalY,
      totalX, totalY,
      factureNumberX, factureNumberY,
      fontSize, fontColor,

      factureNumberFontSize, factureNumberFontColor, factureNumberIsBold, factureNumberIsItalic, factureNumberFontFamily,
      dateFontSize, dateFontColor, dateIsBold, dateIsItalic, dateFontFamily,
      clientCompanyFontSize, clientCompanyFontColor, clientCompanyIsBold, clientCompanyIsItalic, clientCompanyFontFamily,
      clientNameFontSize, clientNameFontColor, clientNameIsBold, clientNameIsItalic, clientNameFontFamily,
      clientEmailFontSize, clientEmailFontColor, clientEmailIsBold, clientEmailIsItalic, clientEmailFontFamily,
      serviceNameFontSize, serviceNameFontColor, serviceNameIsBold, serviceNameIsItalic, serviceNameFontFamily,
      servicePriceFontSize, servicePriceFontColor, servicePriceIsBold, servicePriceIsItalic, servicePriceFontFamily,
      subtotalFontSize, subtotalFontColor, subtotalIsBold, subtotalIsItalic, subtotalFontFamily,
      totalFontSize, totalFontColor, totalIsBold, totalIsItalic, totalFontFamily,
    } = body

    // Find existing or create new
    const existing = await prisma.factureTemplate.findFirst()

    const data = {
      dateX, dateY,
      clientNameX, clientNameY,
      clientEmailX, clientEmailY,
      clientCompanyX, clientCompanyY,
      serviceNameX, serviceNameY,
      servicePriceX, servicePriceY,
      subtotalX, subtotalY,
      totalX, totalY,
      factureNumberX, factureNumberY,
      fontSize, fontColor,

      factureNumberFontSize, factureNumberFontColor, factureNumberIsBold, factureNumberIsItalic, factureNumberFontFamily,
      dateFontSize, dateFontColor, dateIsBold, dateIsItalic, dateFontFamily,
      clientCompanyFontSize, clientCompanyFontColor, clientCompanyIsBold, clientCompanyIsItalic, clientCompanyFontFamily,
      clientNameFontSize, clientNameFontColor, clientNameIsBold, clientNameIsItalic, clientNameFontFamily,
      clientEmailFontSize, clientEmailFontColor, clientEmailIsBold, clientEmailIsItalic, clientEmailFontFamily,
      serviceNameFontSize, serviceNameFontColor, serviceNameIsBold, serviceNameIsItalic, serviceNameFontFamily,
      servicePriceFontSize, servicePriceFontColor, servicePriceIsBold, servicePriceIsItalic, servicePriceFontFamily,
      subtotalFontSize, subtotalFontColor, subtotalIsBold, subtotalIsItalic, subtotalFontFamily,
      totalFontSize, totalFontColor, totalIsBold, totalIsItalic, totalFontFamily,
    }

    let template
    if (existing) {
      template = await prisma.factureTemplate.update({
        where: { id: existing.id },
        data,
      })
    } else {
      template = await prisma.factureTemplate.create({
        data,
      })
    }

    return NextResponse.json({ success: true, template })
  } catch (error) {
    console.error('Failed to save template:', error)
    return NextResponse.json({ error: 'Failed to save template' }, { status: 500 })
  }
}
