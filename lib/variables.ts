/**
 * Campaign Variable Replacement Utility
 * Provides functions to replace template variables with actual data
 */

export interface VariableDefinition {
    key: string
    label: string
    description: string
    example: string
}

export const AVAILABLE_USER_VARIABLES: VariableDefinition[] = [
    {
        key: 'email',
        label: '{{email}}',
        description: "Recipient's email address",
        example: 'user@example.com',
    },
    {
        key: 'companyName',
        label: '{{companyName}}',
        description: "Recipient's company name",
        example: 'Acme Corporation',
    },
    {
        key: 'name',
        label: '{{name}}',
        description: "Recipient's company name (alias for companyName)",
        example: 'Acme Corporation',
    },
    {
        key: 'registrationDate',
        label: '{{registrationDate}}',
        description: 'Date when the user registered',
        example: 'January 15, 2026',
    },
]

/**
 * Format a value based on its type
 */
export function formatVariableValue(value: any, type?: string): string {
    if (value === null || value === undefined) {
        return ''
    }

    // Handle dates
    if (value instanceof Date || type === 'date') {
        const date = value instanceof Date ? value : new Date(value)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        })
    }

    // Handle numbers
    if (typeof value === 'number') {
        return value.toString()
    }

    // Default: convert to string
    return String(value)
}

/**
 * Replace all variables in a template string with actual data
 * Supports both {{variable}} and {variable} formats
 */
export function replaceVariables(
    template: string,
    data: Record<string, any>
): string {
    let result = template

    // Add 'name' alias for 'companyName' if not present
    const enrichedData = {
        ...data,
        name: data.name || data.companyName,
    }

    for (const [key, value] of Object.entries(enrichedData)) {
        // Determine the type based on the key
        const type = key.includes('Date') || key.includes('date') ? 'date' : undefined
        const formattedValue = formatVariableValue(value, type)

        // Replace both {{key}} and {key} formats
        const doubleRegex = new RegExp(`{{${key}}}`, 'g')
        const singleRegex = new RegExp(`{${key}}`, 'g')

        result = result.replace(doubleRegex, formattedValue)
        result = result.replace(singleRegex, formattedValue)
    }

    return result
}

/**
 * Extract all variables used in a template string
 */
export function extractVariables(template: string): string[] {
    const regex = /{{(\w+)}}|{(\w+)}/g
    const matches = template.matchAll(regex)
    const variables = new Set<string>()

    for (const match of matches) {
        const variable = match[1] || match[2]
        if (variable) {
            variables.add(variable)
        }
    }

    return Array.from(variables)
}
