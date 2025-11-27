import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
})

const dynamoClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')
  const uniqueId = searchParams.get('id')

  if (sessionId) {
    // Coming from Stripe checkout
    try {
      const stripeSession = await stripe.checkout.sessions.retrieve(sessionId)

      if (stripeSession.payment_status !== 'paid') {
        return NextResponse.json(
          { error: 'Payment not completed' },
          { status: 400 }
        )
      }

      // Check if session already exists in DB
      const result = await docClient.send(
        new QueryCommand({
          TableName: process.env.SESSIONS_TABLE_NAME,
          IndexName: 'stripeSessionIndex',
          KeyConditionExpression: 'stripeSessionId = :sid',
          ExpressionAttributeValues: {
            ':sid': sessionId,
          },
        })
      )

      if (result.Items && result.Items.length > 0) {
        return NextResponse.json(result.Items[0])
      }

      // Create new session
      const newSessionId = uuidv4()
      const email = stripeSession.customer_details?.email || ''
      const credits = parseInt(stripeSession.metadata?.credits || '5')
      const planId = stripeSession.metadata?.planId || 'starter'

      const sessionData = {
        id: newSessionId,
        email,
        credits,
        creditsRemaining: credits,
        planId,
        paymentStatus: 'paid',
        stripeSessionId: sessionId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
      }

      // Save to DynamoDB (would need to implement)
      // For now, return the data
      return NextResponse.json(sessionData)
    } catch (error) {
      console.error('Error fetching session:', error)
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
  }

  if (uniqueId) {
    // Fetching by unique ID
    try {
      const result = await docClient.send(
        new GetCommand({
          TableName: process.env.SESSIONS_TABLE_NAME,
          Key: { id: uniqueId },
        })
      )

      if (!result.Item) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }

      return NextResponse.json(result.Item)
    } catch (error) {
      console.error('Error fetching session:', error)
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }
  }

  return NextResponse.json({ error: 'Missing session parameter' }, { status: 400 })
}
