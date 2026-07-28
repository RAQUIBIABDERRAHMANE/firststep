import 'dotenv/config'
import { createClient } from '@libsql/client'

async function syncTursoEmployment() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url || !authToken) {
    console.log('No Turso credentials found. Skipping Turso sync.')
    return
  }

  console.log('🌐 Connecting to Turso DB at:', url)
  const client = createClient({ url, authToken })

  try {
    console.log('1. Creating EmploymentApplication table...')
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "EmploymentApplication" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "fullName" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "cin" TEXT NOT NULL,
        "cvUrl" TEXT NOT NULL,
        "photoUrl" TEXT NOT NULL,
        "githubUrl" TEXT NOT NULL,
        "portfolioUrl" TEXT,
        "linkedinUrl" TEXT NOT NULL,
        "skills" TEXT NOT NULL DEFAULT '[]',
        "revenueShare" REAL NOT NULL DEFAULT 0,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "agreementPdfUrl" TEXT,
        "adminNotes" TEXT DEFAULT '[]',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ EmploymentApplication table created or exists')

    console.log('2. Creating EmploymentAgreementTemplate table...')
    await client.execute(`
      CREATE TABLE IF NOT EXISTS "EmploymentAgreementTemplate" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "dateX" REAL NOT NULL DEFAULT 200,
        "dateY" REAL NOT NULL DEFAULT 638,
        "employeeNameX" REAL NOT NULL DEFAULT 125,
        "employeeNameY" REAL NOT NULL DEFAULT 579,
        "employeeCinX" REAL NOT NULL DEFAULT 60,
        "employeeCinY" REAL NOT NULL DEFAULT 540,
        "startDateX" REAL NOT NULL DEFAULT 125,
        "startDateY" REAL NOT NULL DEFAULT 540,
        "revenueShareX" REAL NOT NULL DEFAULT 180,
        "revenueShareY" REAL NOT NULL DEFAULT 377,
        "employeeSignNameX" REAL NOT NULL DEFAULT 120,
        "employeeSignNameY" REAL NOT NULL DEFAULT 145,
        "employeeSignDateX" REAL NOT NULL DEFAULT 125,
        "employeeSignDateY" REAL NOT NULL DEFAULT 120,

        "fontSize" REAL NOT NULL DEFAULT 11,
        "fontColor" TEXT NOT NULL DEFAULT '#000000',

        "dateFontSize" REAL NOT NULL DEFAULT 11,
        "dateFontColor" TEXT NOT NULL DEFAULT '#000000',
        "dateIsBold" NUMERIC NOT NULL DEFAULT 0,
        "dateIsItalic" NUMERIC NOT NULL DEFAULT 0,
        "dateFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',

        "employeeNameFontSize" REAL NOT NULL DEFAULT 11,
        "employeeNameFontColor" TEXT NOT NULL DEFAULT '#000000',
        "employeeNameIsBold" NUMERIC NOT NULL DEFAULT 1,
        "employeeNameIsItalic" NUMERIC NOT NULL DEFAULT 0,
        "employeeNameFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',

        "employeeCinFontSize" REAL NOT NULL DEFAULT 10,
        "employeeCinFontColor" TEXT NOT NULL DEFAULT '#000000',
        "employeeCinIsBold" NUMERIC NOT NULL DEFAULT 0,
        "employeeCinIsItalic" NUMERIC NOT NULL DEFAULT 0,
        "employeeCinFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',

        "startDateFontSize" REAL NOT NULL DEFAULT 11,
        "startDateFontColor" TEXT NOT NULL DEFAULT '#000000',
        "startDateIsBold" NUMERIC NOT NULL DEFAULT 0,
        "startDateIsItalic" NUMERIC NOT NULL DEFAULT 0,
        "startDateFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',

        "revenueShareFontSize" REAL NOT NULL DEFAULT 11,
        "revenueShareFontColor" TEXT NOT NULL DEFAULT '#0277bd',
        "revenueShareIsBold" NUMERIC NOT NULL DEFAULT 1,
        "revenueShareIsItalic" NUMERIC NOT NULL DEFAULT 0,
        "revenueShareFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',

        "employeeSignNameFontSize" REAL NOT NULL DEFAULT 11,
        "employeeSignNameFontColor" TEXT NOT NULL DEFAULT '#000000',
        "employeeSignNameIsBold" NUMERIC NOT NULL DEFAULT 1,
        "employeeSignNameIsItalic" NUMERIC NOT NULL DEFAULT 0,
        "employeeSignNameFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',

        "employeeSignDateFontSize" REAL NOT NULL DEFAULT 10,
        "employeeSignDateFontColor" TEXT NOT NULL DEFAULT '#000000',
        "employeeSignDateIsBold" NUMERIC NOT NULL DEFAULT 0,
        "employeeSignDateIsItalic" NUMERIC NOT NULL DEFAULT 0,
        "employeeSignDateFontFamily" TEXT NOT NULL DEFAULT 'Helvetica',

        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ EmploymentAgreementTemplate table created or exists')

    // Add Enabled columns if missing
    const enabledCols = [
      'dateEnabled',
      'employeeNameEnabled',
      'employeeCinEnabled',
      'startDateEnabled',
      'revenueShareEnabled',
      'employeeSignNameEnabled',
      'employeeSignDateEnabled',
    ]

    for (const col of enabledCols) {
      try {
        await client.execute(`ALTER TABLE "EmploymentAgreementTemplate" ADD COLUMN "${col}" NUMERIC NOT NULL DEFAULT 1`)
        console.log(`✓ Added ${col} column to EmploymentAgreementTemplate`)
      } catch (colErr) {
        // Column may already exist
      }

    }

    console.log('🎉 Turso employment schema sync completed successfully!')

  } catch (e) {
    console.error('Failed to sync Turso schema:', e)
  }
}

syncTursoEmployment()
