import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { v4 as uuidv4 } from 'uuid'

const s3Client = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' })
const dynamoClient = new DynamoDBClient({})
const docClient = DynamoDBDocumentClient.from(dynamoClient)

// This will call the AI service to generate the card
async function generateSportsCard(params: {
  photoUrl: string
  sport: string
  babyName: string
  jerseyNumber: string
  primaryColor: string
  secondaryColor: string
}) {
  // TODO: Integrate with Google Vertex AI / Imagen
  // For now, return a placeholder

  const prompt = `Create a professional ${params.sport} trading card featuring a baby.
  The card should have:
  - Baby's photo transformed into a sports player
  - Name: ${params.babyName}
  - Jersey number: ${params.jerseyNumber}
  - Team colors: ${params.primaryColor} and ${params.secondaryColor}
  - Professional trading card design with stats and team branding
  - Realistic ${params.sport} uniform and equipment
  - High quality, vibrant, collector's item style`

  console.log('Generating card with prompt:', prompt)

  // Call Google Cloud Vertex AI Imagen API
  try {
    const response = await fetch(
      `https://us-central1-aiplatform.googleapis.com/v1/projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/locations/us-central1/publishers/google/models/imagegeneration:predict`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GOOGLE_CLOUD_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: prompt,
            },
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: '3:4',
          },
        }),
      }
    )

    const data = await response.json()

    // Extract the generated image
    if (data.predictions && data.predictions[0]) {
      return data.predictions[0].bytesBase64Encoded
    }

    throw new Error('No image generated')
  } catch (error) {
    console.error('Error calling AI service:', error)
    // Return placeholder for now
    return null
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const photo = formData.get('photo') as File
    const sport = formData.get('sport') as string
    const babyName = formData.get('babyName') as string
    const jerseyNumber = formData.get('jerseyNumber') as string
    const primaryColor = formData.get('primaryColor') as string
    const secondaryColor = formData.get('secondaryColor') as string
    const sessionId = formData.get('sessionId') as string

    if (!photo || !sport || !babyName || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Upload original photo to S3
    const photoId = uuidv4()
    const photoKey = `uploads/${sessionId}/${photoId}-${photo.name}`
    const photoBuffer = Buffer.from(await photo.arrayBuffer())

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.IMAGES_BUCKET_NAME,
        Key: photoKey,
        Body: photoBuffer,
        ContentType: photo.type,
      })
    )

    const photoUrl = `https://${process.env.IMAGES_BUCKET_NAME}.s3.amazonaws.com/${photoKey}`

    // Generate sports card using AI
    const generatedImageData = await generateSportsCard({
      photoUrl,
      sport,
      babyName,
      jerseyNumber,
      primaryColor,
      secondaryColor,
    })

    // Upload generated card to S3
    let cardUrl = photoUrl // Fallback to original for now

    if (generatedImageData) {
      const cardKey = `generated/${sessionId}/${photoId}-card.png`
      const cardBuffer = Buffer.from(generatedImageData, 'base64')

      await s3Client.send(
        new PutObjectCommand({
          Bucket: process.env.IMAGES_BUCKET_NAME,
          Key: cardKey,
          Body: cardBuffer,
          ContentType: 'image/png',
        })
      )

      cardUrl = `https://${process.env.IMAGES_BUCKET_NAME}.s3.amazonaws.com/${cardKey}`
    }

    // Update session credits
    await docClient.send(
      new UpdateCommand({
        TableName: process.env.SESSIONS_TABLE_NAME,
        Key: { id: sessionId },
        UpdateExpression: 'SET creditsRemaining = creditsRemaining - :dec, updatedAt = :now',
        ExpressionAttributeValues: {
          ':dec': 1,
          ':now': new Date().toISOString(),
        },
      })
    )

    return NextResponse.json({
      success: true,
      imageUrl: cardUrl,
      cardId: photoId,
    })
  } catch (error) {
    console.error('Error generating card:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to generate card' },
      { status: 500 }
    )
  }
}
