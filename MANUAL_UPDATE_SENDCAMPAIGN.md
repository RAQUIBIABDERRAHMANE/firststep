# MANUAL UPDATE REQUIRED: Campaign Send Function

## Location
`d:\firststep\app\actions\campaigns.ts` - `sendCampaign` function

## What to do
The `sendCampaign` function needs to be updated to support email lists. Here's the logic to add:

### 1. After parsing selectedRecipients (around line 134), add:

```typescript
const emailListIds = JSON.parse(campaign.emailListIds || '[]')
```

### 2. Replace the simple user fetch with this merged recipient logic:

```typescript
// Collect all email recipients with their data
const recipientMap = new Map<string, {
    email: string
    companyName: string
    name: string
    registrationDate: Date | string
}>()

// 1. Add individually selected users
if (selectedRecipientIds.length > 0) {
    const users = await prisma.user.findMany({
        where: { id: { in: selectedRecipientIds } },
        select: { id: true, email: true, companyName: true, createdAt: true }
    })
    
    for (const u of users) {
        recipientMap.set(u.email, {
            email: u.email,
            companyName: u.companyName || '',
            name: u.companyName || '',
           registrationDate: u.createdAt
        })
    }
}

// 2. Add users from email lists
if (emailListIds.length > 0) {
    const listMembers = await prisma.emailListMember.findMany({
        where: { listId: { in: emailListIds } },
        include: {
            user: {
                select: { email: true, companyName: true, createdAt: true }
            }
        }
    })
    
    for (const member of listMembers) {
        if (member.user) {
            recipientMap.set(member.user.email, {
                email: member.user.email,
                companyName: member.user.companyName || '',
                name: member.user.companyName || '',
                registrationDate: member.user.createdAt
            })
        } else if (member.email) {
            recipientMap.set(member.email, {
                email: member.email,
                companyName: member.name || member.email.split('@')[0],
                name: member.name || member.email.split('@')[0],
                registrationDate: 'N/A'
            })
        }
    }
}

if (recipientMap.size === 0) {
    await prisma.campaign.update({
        where: { id },
        data: { status: 'DRAFT' }
    })
    return { success: false, message: 'No recipients selected' }
}

const recipients = Array.from(recipientMap.values())
```

### 3. Update the loop to use recipients instead of users:

```typescript
for (const recipient of recipients) {
    const userData = {
        email: recipient.email,
        companyName: recipient.companyName,
        name: recipient.name,
        registrationDate: recipient.registrationDate
    }
    // ... rest of the loop stays the same
```

### 4. Update the final stats:

```typescript
recipientCount: recipientMap.size,
```

## Key Benefits
- Merges recipients from individual selection AND email lists
- Deduplicates by email address (same person won't get two emails)
- Supports custom emails with fallback values for variables
- Uses Map for efficient deduplication
