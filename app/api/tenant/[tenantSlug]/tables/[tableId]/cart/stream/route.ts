import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ tenantSlug: string; tableId: string }> }
) {
    const { tableId } = await params
    const encoder = new TextEncoder()

    let lastCartHash = ''

    const stream = new ReadableStream({
        start(controller) {
            const send = (data: object) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
            }

            const interval = setInterval(async () => {
                try {
                    const session = await prisma.tableCartSession.findUnique({
                        where: { tableId },
                        select: { cartData: true, updatedAt: true }
                    })

                    const currentCart = session ? session.cartData : '[]'
                    const hash = `${currentCart}-${session?.updatedAt.getTime() || 0}`

                    if (hash !== lastCartHash) {
                        lastCartHash = hash
                        send({ cartData: currentCart, updatedAt: session?.updatedAt })
                    }
                } catch (err) {
                    console.error('[Cart SSE] Error checking cart session:', err)
                    clearInterval(interval)
                    controller.close()
                }
            }, 2000)

            req.signal.addEventListener('abort', () => {
                clearInterval(interval)
                try { controller.close() } catch {}
            })
        }
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no'
        }
    })
}
