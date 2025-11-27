'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 1,
    credits: 5,
    features: [
      '5 sports cards',
      '1 sport selection',
      'Basic customization',
      'High-res downloads',
      'Email delivery',
    ],
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 4.95,
    credits: 40,
    features: [
      '40 sports cards',
      '3 sport selections',
      'Advanced customization',
      'Multiple poses',
      'Priority support',
      'High-res downloads',
    ],
    popular: true,
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    price: 9.95,
    credits: 100,
    features: [
      '100 sports cards',
      'All sports available',
      'Premium templates',
      'Bulk generation',
      'Priority support',
      'Commercial license',
    ],
    popular: false,
  },
]

export default function PricingCards() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleCheckout = async (planId: string, price: number, credits: number) => {
    setLoading(planId)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId, price, credits }),
      })

      const { sessionId } = await response.json()
      const stripe = await stripePromise

      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`relative bg-white rounded-2xl shadow-xl p-8 ${
            plan.popular ? 'ring-4 ring-blue-500 scale-105' : ''
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
              MOST POPULAR
            </div>
          )}

          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-5xl font-bold">${plan.price}</span>
            </div>
            <p className="text-gray-600 mt-2">{plan.credits} cards</p>
          </div>

          <ul className="space-y-3 mb-8">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <svg
                  className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => handleCheckout(plan.id, plan.price, plan.credits)}
            disabled={loading === plan.id}
            className={`w-full py-3 px-6 rounded-lg font-bold transition ${
              plan.popular
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading === plan.id ? 'Processing...' : 'Get Started'}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            ${(plan.price / plan.credits).toFixed(2)} per card
          </p>
        </div>
      ))}
    </div>
  )
}
