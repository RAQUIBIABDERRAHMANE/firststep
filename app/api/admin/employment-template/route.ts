import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/app/actions/auth'
import { DEFAULT_EMPLOYMENT_POSITIONS } from '@/lib/employment-pdf'

export async function GET() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const template = await prisma.employmentAgreementTemplate.findFirst()
    return NextResponse.json({
      success: true,
      template: template || DEFAULT_EMPLOYMENT_POSITIONS,
    })
  } catch (error: any) {
    console.error('[GET EMPLOYMENT TEMPLATE ERROR]', error)
    return NextResponse.json({ error: 'Failed to load template positions' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const existing = await prisma.employmentAgreementTemplate.findFirst()

    let template
    if (existing) {
      template = await prisma.employmentAgreementTemplate.update({
        where: { id: existing.id },
        data: {
          dateX: body.dateX,
          dateY: body.dateY,
          employeeNameX: body.employeeNameX,
          employeeNameY: body.employeeNameY,
          employeeCinX: body.employeeCinX,
          employeeCinY: body.employeeCinY,
          startDateX: body.startDateX,
          startDateY: body.startDateY,
          revenueShareX: body.revenueShareX,
          revenueShareY: body.revenueShareY,
          employeeSignNameX: body.employeeSignNameX,
          employeeSignNameY: body.employeeSignNameY,
          employeeSignDateX: body.employeeSignDateX,
          employeeSignDateY: body.employeeSignDateY,

          dateEnabled: body.dateEnabled ?? true,
          employeeNameEnabled: body.employeeNameEnabled ?? true,
          employeeCinEnabled: body.employeeCinEnabled ?? true,
          startDateEnabled: body.startDateEnabled ?? true,
          revenueShareEnabled: body.revenueShareEnabled ?? true,
          employeeSignNameEnabled: body.employeeSignNameEnabled ?? true,
          employeeSignDateEnabled: body.employeeSignDateEnabled ?? true,

          fontSize: body.fontSize ?? 11,

          fontColor: body.fontColor ?? '#000000',

          dateFontSize: body.dateFontSize ?? 11,
          dateFontColor: body.dateFontColor ?? '#000000',
          dateIsBold: body.dateIsBold ?? false,
          dateIsItalic: body.dateIsItalic ?? false,
          dateFontFamily: body.dateFontFamily ?? 'Helvetica',

          employeeNameFontSize: body.employeeNameFontSize ?? 11,
          employeeNameFontColor: body.employeeNameFontColor ?? '#000000',
          employeeNameIsBold: body.employeeNameIsBold ?? true,
          employeeNameIsItalic: body.employeeNameIsItalic ?? false,
          employeeNameFontFamily: body.employeeNameFontFamily ?? 'Helvetica',

          employeeCinFontSize: body.employeeCinFontSize ?? 10,
          employeeCinFontColor: body.employeeCinFontColor ?? '#000000',
          employeeCinIsBold: body.employeeCinIsBold ?? false,
          employeeCinIsItalic: body.employeeCinIsItalic ?? false,
          employeeCinFontFamily: body.employeeCinFontFamily ?? 'Helvetica',

          startDateFontSize: body.startDateFontSize ?? 11,
          startDateFontColor: body.startDateFontColor ?? '#000000',
          startDateIsBold: body.startDateIsBold ?? false,
          startDateIsItalic: body.startDateIsItalic ?? false,
          startDateFontFamily: body.startDateFontFamily ?? 'Helvetica',

          revenueShareFontSize: body.revenueShareFontSize ?? 11,
          revenueShareFontColor: body.revenueShareFontColor ?? '#0277bd',
          revenueShareIsBold: body.revenueShareIsBold ?? true,
          revenueShareIsItalic: body.revenueShareIsItalic ?? false,
          revenueShareFontFamily: body.revenueShareFontFamily ?? 'Helvetica',

          employeeSignNameFontSize: body.employeeSignNameFontSize ?? 11,
          employeeSignNameFontColor: body.employeeSignNameFontColor ?? '#000000',
          employeeSignNameIsBold: body.employeeSignNameIsBold ?? true,
          employeeSignNameIsItalic: body.employeeSignNameIsItalic ?? false,
          employeeSignNameFontFamily: body.employeeSignNameFontFamily ?? 'Helvetica',

          employeeSignDateFontSize: body.employeeSignDateFontSize ?? 10,
          employeeSignDateFontColor: body.employeeSignDateFontColor ?? '#000000',
          employeeSignDateIsBold: body.employeeSignDateIsBold ?? false,
          employeeSignDateIsItalic: body.employeeSignDateIsItalic ?? false,
          employeeSignDateFontFamily: body.employeeSignDateFontFamily ?? 'Helvetica',
        },
      })
    } else {
      template = await prisma.employmentAgreementTemplate.create({
        data: {
          dateX: body.dateX ?? 200,
          dateY: body.dateY ?? 638,
          employeeNameX: body.employeeNameX ?? 125,
          employeeNameY: body.employeeNameY ?? 579,
          employeeCinX: body.employeeCinX ?? 60,
          employeeCinY: body.employeeCinY ?? 540,
          startDateX: body.startDateX ?? 125,
          startDateY: body.startDateY ?? 540,
          revenueShareX: body.revenueShareX ?? 180,
          revenueShareY: body.revenueShareY ?? 377,
          employeeSignNameX: body.employeeSignNameX ?? 120,
          employeeSignNameY: body.employeeSignNameY ?? 145,
          employeeSignDateX: body.employeeSignDateX ?? 125,
          employeeSignDateY: body.employeeSignDateY ?? 120,

          dateEnabled: body.dateEnabled ?? true,
          employeeNameEnabled: body.employeeNameEnabled ?? true,
          employeeCinEnabled: body.employeeCinEnabled ?? true,
          startDateEnabled: body.startDateEnabled ?? true,
          revenueShareEnabled: body.revenueShareEnabled ?? true,
          employeeSignNameEnabled: body.employeeSignNameEnabled ?? true,
          employeeSignDateEnabled: body.employeeSignDateEnabled ?? true,

          fontSize: body.fontSize ?? 11,

          fontColor: body.fontColor ?? '#000000',

          dateFontSize: body.dateFontSize ?? 11,
          dateFontColor: body.dateFontColor ?? '#000000',
          dateIsBold: body.dateIsBold ?? false,
          dateIsItalic: body.dateIsItalic ?? false,
          dateFontFamily: body.dateFontFamily ?? 'Helvetica',

          employeeNameFontSize: body.employeeNameFontSize ?? 11,
          employeeNameFontColor: body.employeeNameFontColor ?? '#000000',
          employeeNameIsBold: body.employeeNameIsBold ?? true,
          employeeNameIsItalic: body.employeeNameIsItalic ?? false,
          employeeNameFontFamily: body.employeeNameFontFamily ?? 'Helvetica',

          employeeCinFontSize: body.employeeCinFontSize ?? 10,
          employeeCinFontColor: body.employeeCinFontColor ?? '#000000',
          employeeCinIsBold: body.employeeCinIsBold ?? false,
          employeeCinIsItalic: body.employeeCinIsItalic ?? false,
          employeeCinFontFamily: body.employeeCinFontFamily ?? 'Helvetica',

          startDateFontSize: body.startDateFontSize ?? 11,
          startDateFontColor: body.startDateFontColor ?? '#000000',
          startDateIsBold: body.startDateIsBold ?? false,
          startDateIsItalic: body.startDateIsItalic ?? false,
          startDateFontFamily: body.startDateFontFamily ?? 'Helvetica',

          revenueShareFontSize: body.revenueShareFontSize ?? 11,
          revenueShareFontColor: body.revenueShareFontColor ?? '#0277bd',
          revenueShareIsBold: body.revenueShareIsBold ?? true,
          revenueShareIsItalic: body.revenueShareIsItalic ?? false,
          revenueShareFontFamily: body.revenueShareFontFamily ?? 'Helvetica',

          employeeSignNameFontSize: body.employeeSignNameFontSize ?? 11,
          employeeSignNameFontColor: body.employeeSignNameFontColor ?? '#000000',
          employeeSignNameIsBold: body.employeeSignNameIsBold ?? true,
          employeeSignNameIsItalic: body.employeeSignNameIsItalic ?? false,
          employeeSignNameFontFamily: body.employeeSignNameFontFamily ?? 'Helvetica',

          employeeSignDateFontSize: body.employeeSignDateFontSize ?? 10,
          employeeSignDateFontColor: body.employeeSignDateFontColor ?? '#000000',
          employeeSignDateIsBold: body.employeeSignDateIsBold ?? false,
          employeeSignDateIsItalic: body.employeeSignDateIsItalic ?? false,
          employeeSignDateFontFamily: body.employeeSignDateFontFamily ?? 'Helvetica',
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Modèle de contrat sauvegardé avec succès.',
      template,
    })
  } catch (error: any) {
    console.error('[SAVE EMPLOYMENT TEMPLATE ERROR]', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to save agreement template' },
      { status: 500 }
    )
  }
}
