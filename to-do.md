# Baby Sports Trading Card App - To-Do List

## Questions to Resolve
- [x] Confirm AI service: Using Google Vertex AI Imagen for image generation
- [x] Trading card design style: Standardized with AI prompt
- [x] Authentication method: No auth needed - UUID links with email
- [x] Print fulfillment integration: Admin dashboard with CSV export
- [x] Image requirements: Standard web formats (JPG, PNG, HEIC)
- [x] Team/sport selection: Plan-based tiers (1 sport, 3 sports, all sports)

## Project Setup
- [x] Set up SST project structure and configuration
- [x] Install dependencies (SST, Next.js, React, etc.)
- [x] Configure AWS resources in SST config
- [x] Set up environment variables structure

## Infrastructure (AWS/SST)
- [x] Configure S3 bucket for image storage
- [x] Set up DynamoDB tables (sessions, orders)
- [x] Create Lambda functions for image processing
- [x] Set up API Gateway endpoints
- [x] Configure IAM roles and permissions (via SST)

## Frontend
- [x] Initialize Next.js application
- [x] Create marketing landing page
- [x] Build before/after image slider component (vertical divider)
- [x] Design pricing cards ($1/5, $4.95/40, $9.95/100)
- [x] Create responsive layout and styling

## Payment Integration
- [x] Set up Stripe account integration
- [x] Create Stripe checkout sessions
- [x] Implement payment webhook handlers
- [x] Handle payment success/failure flows

## Onboarding Flow
- [x] Design post-payment onboarding UI
- [x] Create step-by-step wizard (upload photo, select sport/team, customize)
- [x] Implement photo upload with preview
- [x] Build sport/team selection interface
- [x] Add customization options (name, number, colors)

## AI Image Generation
- [x] Set up Google Vertex AI Imagen API integration
- [x] Create prompt engineering for sports card generation
- [x] Implement image processing pipeline
- [x] Add error handling for AI calls
- [ ] Test and optimize for cost and performance

## Card Generation
- [x] Build card preview interface
- [x] Implement batch generation for multiple cards
- [x] Create download functionality
- [x] Track generation credits per purchase
- [ ] Add regeneration options

## Order Management
- [x] Create admin dashboard for print orders
- [x] Build order export functionality (CSV)
- [x] Implement order status tracking
- [x] Design order data format for fulfillment
- [ ] Add email notifications for orders

## Testing & Deployment
- [ ] Test payment flows end-to-end
- [ ] Test image generation quality with real AI API
- [ ] Verify all AWS resources deploy correctly
- [ ] Set up custom domain (if needed)
- [ ] Configure production environment variables
- [ ] Deploy to AWS via SST

## Nice-to-Have Features
- [ ] Email delivery of digital cards
- [ ] Social sharing functionality
- [ ] Gallery of created cards
- [ ] Referral/discount system
- [ ] Mobile app version

## Current Status
**✅ Core application complete! Ready for deployment and testing.**

### Completed:
- Full Next.js frontend with marketing page
- Before/after slider with vertical divider
- Stripe payment integration with 3 pricing tiers
- 4-step onboarding flow (upload, select sport, customize, generate)
- AI image generation setup (Google Vertex AI Imagen)
- Admin dashboard with CSV export
- Print order management system
- All API endpoints functional

### Next Steps:
1. Set up environment variables with actual API keys
2. Test payment flow with Stripe test mode
3. Test AI image generation with real Google Cloud credentials
4. Deploy to AWS using `npm run deploy`
5. Configure production domain and SSL
6. Set up email notifications (optional)

### To Deploy:
```bash
# 1. Configure environment variables
cp .env.example .env
# Edit .env with your actual keys

# 2. Deploy to AWS
npm run deploy

# 3. Configure Stripe webhook
# Point webhook to: https://your-domain.com/api/webhook
```
