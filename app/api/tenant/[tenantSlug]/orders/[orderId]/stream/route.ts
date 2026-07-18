import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ tenantSlug: string; orderId: string }> }
) {
    const { orderId } = await params
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
        start(controller) {
            const send = (data: object) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
            }

            const interval = setInterval(async () => {
                try {
                    const order = await prisma.restaurantOrder.findUnique({
                        where: { id: orderId },
                        select: { status: true, updatedAt: true }
                    })

                    if (!order) {
                        send({ status: 'NOT_FOUND' })
                        clearInterval(interval)
                        controller.close()
                        return
                    }

                    send({ status: order.status, updatedAt: order.updatedAt })

                    // Close stream once order reaches a terminal state
                    if (['SERVED', 'PAID', 'CANCELED'].includes(order.status)) {
                        clearInterval(interval)
                        setTimeout(() => controller.close(), 500)
                    }
                } catch (err) {
                    console.error('[SSE] Error fetching order status:', err)
                    clearInterval(interval)
                    controller.close()
                }
            }, 3000)

            // Clean up when the client disconnects
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
