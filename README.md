# Baby Sports Trading Cards

Transform your baby's photos into professional sports trading cards using AI! This serverless application allows parents to create, customize, and order printed sports cards featuring their little ones as star athletes.

## Features

- **AI-Powered Card Generation**: Uses Google Vertex AI / Imagen to transform baby photos into professional sports cards
- **Multiple Sports**: Football, Basketball, Baseball, Soccer, Hockey, and Tennis
- **Flexible Pricing Tiers**:
  - Starter: $1 for 5 cards
  - Pro: $4.95 for 40 cards
  - Ultimate: $9.95 for 100 cards
- **Intuitive Onboarding**: Simple 4-step process after payment
- **Before/After Slider**: Interactive demo on landing page with vertical divider
- **Print Fulfillment**: Order physical cards with easy-to-manage admin dashboard
- **Serverless Architecture**: Deployed with SST on AWS for scalability and cost-effectiveness

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS
- **Backend**: AWS Lambda, API Gateway
- **Database**: DynamoDB
- **Storage**: S3
- **Payments**: Stripe
- **AI**: Google Vertex AI / Imagen API
- **Infrastructure**: SST (Serverless Stack)

## Architecture

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
    ┌────┴────┐
    │  Stripe │
    │ Payment │
    └────┬────┘
         │
┌────────▼────────────────────┐
│   API Gateway + Lambda      │
│  - Session Management       │
│  - Card Generation          │
│  - Order Processing         │
└─────┬───────────────┬───────┘
      │               │
┌─────▼────┐    ┌────▼─────┐
│ DynamoDB │    │    S3    │
│ Sessions │    │  Images  │
│  Orders  │    │   Cards  │
└──────────┘    └──────────┘
      │
┌─────▼──────────┐
│  Vertex AI     │
│ Image Gen API  │
└────────────────┘
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- AWS Account with credentials configured
- Stripe Account
- Google Cloud Account with Vertex AI enabled

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd baby-trading-card-app
```

2. Install dependencies:
```bash
npm install
cd packages/web && npm install && cd ../..
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- Stripe keys (get from https://stripe.com/dashboard)
- Google Cloud Project ID and API key
- AWS region (default: us-east-1)

4. Configure Stripe webhook:
```bash
stripe listen --forward-to localhost:3000/api/webhook
```
Copy the webhook signing secret to `.env` as `STRIPE_WEBHOOK_SECRET`

### Development

Run the development server:
```bash
npm run dev
```

This will:
- Start SST in dev mode
- Launch Next.js on http://localhost:3000
- Set up AWS resources in your account
- Enable hot reloading

### Deployment

Deploy to production:
```bash
npm run deploy
```

This will deploy:
- Next.js app to AWS (via SST)
- Lambda functions
- DynamoDB tables
- S3 buckets
- All infrastructure

## Project Structure

```
baby-trading-card-app/
├── packages/
│   ├── web/                    # Next.js frontend
│   │   ├── app/               # App router pages
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── create/        # Onboarding flow
│   │   │   ├── order/         # Print order form
│   │   │   ├── admin/         # Admin dashboard
│   │   │   └── api/           # API routes
│   │   ├── components/        # React components
│   │   └── public/            # Static assets
│   └── functions/             # Lambda functions
├── sst.config.ts              # SST infrastructure
├── package.json
└── README.md
```

## Key Components

### Landing Page (`packages/web/app/page.tsx`)
- Hero section with CTA
- Before/after slider demo
- Pricing cards
- Features showcase

### Before/After Slider (`packages/web/components/BeforeAfterSlider.tsx`)
- Interactive vertical divider
- Touch and mouse support
- Shows transformation from baby photo to sports card

### Onboarding Flow (`packages/web/app/create/page.tsx`)
1. Photo upload
2. Sport selection (based on plan tier)
3. Card customization (name, number, colors)
4. Card generation and download

### Admin Dashboard (`packages/web/app/admin/page.tsx`)
- View all print orders
- Update order status
- Export orders to CSV
- Download card files

## API Endpoints

### `/api/create-checkout-session`
- **POST**: Create Stripe checkout session
- **Body**: `{ planId, price, credits }`
- **Returns**: `{ sessionId }`

### `/api/webhook`
- **POST**: Stripe webhook handler
- Creates session in DynamoDB after successful payment

### `/api/session`
- **GET**: Retrieve session data
- **Query**: `session_id` or `id`
- **Returns**: Session object with credits and plan info

### `/api/generate-card`
- **POST**: Generate AI sports card
- **FormData**: photo, sport, babyName, jerseyNumber, colors, sessionId
- **Returns**: `{ success, imageUrl, cardId }`

### `/api/orders`
- **GET**: List all orders (admin)
- **POST**: Create new print order
- **PATCH**: Update order status

## Environment Variables

Required environment variables (see `.env.example`):

- `STRIPE_SECRET_KEY`: Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `GOOGLE_CLOUD_PROJECT_ID`: Google Cloud project ID
- `GOOGLE_CLOUD_API_KEY`: Google Cloud API key for Vertex AI
- `NEXT_PUBLIC_APP_URL`: Frontend URL
- `AWS_REGION`: AWS region for deployment

## AI Image Generation

The app uses Google Vertex AI's Imagen model to generate sports cards. The prompt includes:
- Baby photo URL
- Selected sport
- Baby's name
- Jersey number
- Team colors
- Professional trading card styling

**Note**: You mentioned "gemini nano banana" but this doesn't appear to be a real Google AI service. The implementation uses Vertex AI Imagen instead. If you have a specific AI service in mind, please provide details and I can update the integration.

## Pricing Tiers

| Plan | Price | Cards | Features |
|------|-------|-------|----------|
| Starter | $1 | 5 | 1 sport, basic customization |
| Pro | $4.95 | 40 | 3 sports, multiple poses |
| Ultimate | $9.95 | 100 | All sports, premium templates |

## Print Fulfillment Workflow

1. User generates digital cards
2. User submits print order with shipping address
3. Order appears in admin dashboard
4. Admin updates status: pending → processing → shipped → delivered
5. Admin can export orders to CSV for batch processing

## Security Considerations

- Stripe webhooks are verified with signing secret
- S3 bucket should have appropriate CORS and access policies
- DynamoDB tables use IAM roles for access control
- API routes validate session ownership before operations
- No authentication required - sessions are identified by unique UUID

## Future Enhancements

- Email notifications (SendGrid/SES integration)
- Social sharing of generated cards
- Gallery of created cards
- Referral/discount system
- Team logo licensing and integration
- Multiple card templates per sport
- Batch upload for multiple photos
- Card editing and regeneration

## Support

For issues or questions, please open an issue on GitHub.

## License

ISC

---

Built with ❤️ using Next.js, SST, and AI
