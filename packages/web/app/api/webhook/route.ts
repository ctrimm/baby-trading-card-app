import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
})

const dynamoClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Create a new session in DynamoDB
    const sessionId = uuidv4()
    const email = session.customer_details?.email || ''
    const credits = parseInt(session.metadata?.credits || '5')
    const planId = session.metadata?.planId || 'starter'

    try {
      await docClient.send(
        new PutCommand({
          TableName: process.env.SESSIONS_TABLE_NAME,
          Item: {
            id: sessionId,
            email,
            credits,
            creditsRemaining: credits,
            planId,
            paymentStatus: 'paid',
            stripeSessionId: session.id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'active',
          },
        })
      )

      // TODO: Send email with unique link
      console.log(`Session created: ${sessionId} for ${email}`)
    } catch (error) {
      console.error('Error creating session:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
