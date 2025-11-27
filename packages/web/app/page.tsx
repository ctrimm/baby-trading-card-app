'use client'

import { useState } from 'react'
import BeforeAfterSlider from '@/components/BeforeAfterSlider'
import PricingCards from '@/components/PricingCards'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-500 to-blue-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Turn Your Baby into a Sports Star
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Create amazing AI-generated sports trading cards featuring your little one as their favorite team's MVP!
          </p>
          <a
            href="#pricing"
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition inline-block"
          >
            Get Started - From $1
          </a>
        </div>
      </section>

      {/* Before/After Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            See the Magic
          </h2>
          <div className="max-w-4xl mx-auto">
            <BeforeAfterSlider />
          </div>
          <p className="text-center mt-8 text-gray-600">
            Drag the slider to see the transformation from your baby photo to a professional sports card!
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Baby Sports Cards?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Magic</h3>
              <p className="text-gray-600">
                Advanced AI transforms your baby's photo into a professional sports card
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Super Fast</h3>
              <p className="text-gray-600">
                Get your cards in minutes, not days. Ready to download or print!
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🏈</div>
              <h3 className="text-xl font-bold mb-2">All Sports</h3>
              <p className="text-gray-600">
                Football, basketball, baseball, soccer - we've got them all!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            Choose Your Plan
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Create as many unique cards as you need. No subscriptions, pay once!
          </p>
          <PricingCards />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-bold mb-2">Choose a Plan</h3>
              <p className="text-gray-600 text-sm">Select how many cards you want to create</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-bold mb-2">Upload Photos</h3>
              <p className="text-gray-600 text-sm">Add your baby's photos and customize</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-bold mb-2">AI Generates</h3>
              <p className="text-gray-600 text-sm">Our AI creates amazing sports cards</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-bold mb-2">Download & Print</h3>
              <p className="text-gray-600 text-sm">Get digital cards or order prints!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Baby Sports Cards. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
