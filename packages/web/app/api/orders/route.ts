import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, ScanCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const dynamoClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(dynamoClient)

export async function GET(req: NextRequest) {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: process.env.ORDERS_TABLE_NAME,
      })
    )

    return NextResponse.json({ orders: result.Items || [] })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, address, quantity, sessionId, cardUrls } = body

    const orderId = uuidv4()

    const order = {
      id: orderId,
      sessionId: sessionId || 'manual',
      email,
      cards: cardUrls?.length || 0,
      address: {
        name,
        line1: address.line1,
        line2: address.line2 || '',
        city: address.city,
        state: address.state,
        zip: address.zip,
      },
      quantity: quantity || 1,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      cardUrls: cardUrls || [],
    }

    await docClient.send(
      new PutCommand({
        TableName: process.env.ORDERS_TABLE_NAME,
        Item: order,
      })
    )

    // TODO: Send email notification to admin

    return NextResponse.json({ success: true, orderId })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { orderId, status } = await req.json()

    await docClient.send(
      new UpdateCommand({
        TableName: process.env.ORDERS_TABLE_NAME,
        Key: { id: orderId },
        UpdateExpression: 'SET #status = :status, updatedAt = :now',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
          ':now': new Date().toISOString(),
        },
      })
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    )
  }
}
