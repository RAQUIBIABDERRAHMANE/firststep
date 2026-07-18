/**
 * lib/menu-analysis.ts
 * 
 * Apriori-inspired co-occurrence analysis for restaurant orders.
 * Finds dish pairs that are frequently ordered together and returns
 * the top N pairs sorted by co-occurrence frequency.
 */

export interface DishPair {
    dishA: string
    dishB: string
    nameA: string
    nameB: string
    count: number
    percentage: number // % of orders containing dishA that also have dishB
}

export interface OrderForAnalysis {
    id: string
    items: { dishId: string; name: string; quantity: number }[]
}

/**
 * Compute the top co-occurring dish pairs from a list of orders.
 * @param orders  - Array of orders with their items
 * @param topN    - Number of top pairs to return (default: 10)
 */
export function computeItemPairs(orders: OrderForAnalysis[], topN = 10): DishPair[] {
    // Count per-dish total order appearances
    const dishCounts = new Map<string, { name: string; count: number }>()
    // Count pair co-occurrences
    const pairCounts = new Map<string, number>()

    for (const order of orders) {
        // Deduplicate dish IDs within a single order (in case multiple of same item)
        const uniqueDishes = Array.from(
            new Map(order.items.map(i => [i.dishId, i.name])).entries()
        )

        for (const [dishId, name] of uniqueDishes) {
            const prev = dishCounts.get(dishId) ?? { name, count: 0 }
            dishCounts.set(dishId, { name, count: prev.count + 1 })
        }

        // Generate all unordered pairs (combinations of 2)
        for (let i = 0; i < uniqueDishes.length; i++) {
            for (let j = i + 1; j < uniqueDishes.length; j++) {
                const [idA] = uniqueDishes[i]
                const [idB] = uniqueDishes[j]
                // Always store pair in alphabetical order for consistency
                const key = [idA, idB].sort().join('::')
                pairCounts.set(key, (pairCounts.get(key) ?? 0) + 1)
            }
        }
    }

    const totalOrders = orders.length || 1

    // Build result array
    const pairs: DishPair[] = []
    for (const [key, count] of pairCounts.entries()) {
        const [dishA, dishB] = key.split('::')
        const infoA = dishCounts.get(dishA)
        const infoB = dishCounts.get(dishB)
        if (!infoA || !infoB) continue

        pairs.push({
            dishA,
            dishB,
            nameA: infoA.name,
            nameB: infoB.name,
            count,
            percentage: Math.round((count / totalOrders) * 100)
        })
    }

    // Sort by count descending, return top N
    return pairs.sort((a, b) => b.count - a.count).slice(0, topN)
}

/**
 * Format pair data into a structured summary string for the AI prompt.
 */
export function formatPairsForPrompt(pairs: DishPair[], totalOrders: number): string {
    if (pairs.length === 0) return 'Pas assez de données pour analyser les associations.'

    const lines = pairs.map((p, i) =>
        `${i + 1}. "${p.nameA}" + "${p.nameB}" — commandés ensemble ${p.count} fois (${p.percentage}% des commandes)`
    )

    return `Analyse de ${totalOrders} commandes :\n${lines.join('\n')}`
}
