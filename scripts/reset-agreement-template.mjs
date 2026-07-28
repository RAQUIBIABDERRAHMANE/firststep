import 'dotenv/config'
import { createClient } from '@libsql/client'

async function resetAgreementTemplate() {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN

  if (!url || !authToken) {
    console.log('No Turso credentials found. Skipping Turso reset.')
    return
  }

  const client = createClient({ url, authToken })

  try {
    await client.execute(`
      DELETE FROM "EmploymentAgreementTemplate";
    `)
    await client.execute(`
      INSERT INTO "EmploymentAgreementTemplate" (
        "id", "dateX", "dateY", "employeeNameX", "employeeNameY",
        "employeeCinX", "employeeCinY", "startDateX", "startDateY",
        "revenueShareX", "revenueShareY", "employeeSignNameX", "employeeSignNameY",
        "employeeSignDateX", "employeeSignDateY",
        "dateEnabled", "employeeNameEnabled", "employeeCinEnabled", "startDateEnabled",
        "revenueShareEnabled", "employeeSignNameEnabled", "employeeSignDateEnabled",
        "fontSize", "fontColor", "createdAt", "updatedAt"
      ) VALUES (
        'default_template', 235, 687, 125, 647,
        60, 627, 125, 607,
        180, 436, 120, 165,
        125, 120,
        1, 1, 1, 1,
        1, 1, 1,
        11, '#000000', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ Successfully reset EmploymentAgreementTemplate default coordinates in Turso database!')
  } catch (e) {
    console.error('Failed to reset template:', e)
  }
}

resetAgreementTemplate()
