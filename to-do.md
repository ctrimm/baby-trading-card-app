# Baby Sports Trading Card App - To-Do List

## Questions to Resolve
- [ ] Confirm AI service: Google Gemini API vs Imagen for image generation
- [ ] Trading card design style and templates needed
- [ ] Authentication method (email/password, social login, or payment-first)
- [ ] Print fulfillment integration format (CSV export, admin dashboard, API webhook)
- [ ] Image requirements (formats, size limits, storage strategy)
- [ ] Team/sport selection scope and customization options

## Project Setup
- [ ] Set up SST project structure and configuration
- [ ] Install dependencies (SST, Next.js, React, etc.)
- [ ] Configure AWS resources in SST config
- [ ] Set up environment variables structure

## Infrastructure (AWS/SST)
- [ ] Configure S3 bucket for image storage
- [ ] Set up DynamoDB tables (users, orders, cards)
- [ ] Create Lambda functions for image processing
- [ ] Set up API Gateway endpoints
- [ ] Configure IAM roles and permissions

## Frontend
- [ ] Initialize Next.js application
- [ ] Create marketing landing page
- [ ] Build before/after image slider component (vertical divider)
- [ ] Design pricing cards ($1/5, $4.95/40, $9.95/100)
- [ ] Create responsive layout and styling

## Payment Integration
- [ ] Set up Stripe account integration
- [ ] Create Stripe checkout sessions
- [ ] Implement payment webhook handlers
- [ ] Handle payment success/failure flows

## Onboarding Flow
- [ ] Design post-payment onboarding UI
- [ ] Create step-by-step wizard (upload photo, select sport/team, customize)
- [ ] Implement photo upload with preview
- [ ] Build sport/team selection interface
- [ ] Add customization options (name, number, etc.)

## AI Image Generation
- [ ] Set up Google Gemini/Imagen API integration
- [ ] Create prompt engineering for sports card generation
- [ ] Implement image processing pipeline
- [ ] Add error handling and retries
- [ ] Optimize for cost and performance

## Card Generation
- [ ] Build card preview interface
- [ ] Implement batch generation for multiple cards
- [ ] Create download functionality
- [ ] Add regeneration options
- [ ] Track generation credits per purchase

## Order Management
- [ ] Create admin dashboard for print orders
- [ ] Build order export functionality
- [ ] Implement order status tracking
- [ ] Add email notifications for orders
- [ ] Design order data format for fulfillment

## Testing & Deployment
- [ ] Test payment flows end-to-end
- [ ] Test image generation quality
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
**Waiting for answers to questions before proceeding with implementation**
