'use client'
import { Show, SignInButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { FileUp, Cpu, MessageCircle } from 'lucide-react'

const steps = [
  {
    icon: FileUp,
    number: '01',
    title: 'Upload PDF',
    description: 'Add your book file',
  },
  {
    icon: Cpu,
    number: '02',
    title: 'AI Processing',
    description: 'We analyze the document',
  },
  {
    icon: MessageCircle,
    number: '03',
    title: 'Voice Chat',
    description: 'Discuss with AI',
  },
]

export default function HeroSection() {
  return (
    <section className="bg-[var(--bg-secondary)] py-14 md:py-20 rounded-2xl">
      <div className="wrapper">

        {/* Top row — text + illustration */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">

          {/* Text content */}
          <div className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left gap-5">
            <span className="inline-flex items-center gap-2 bg-white border border-(--border-subtle) text-(--color-brand) text-sm font-semibold px-4 py-1.5 rounded-full shadow-soft-sm">
              ✦ AI-Powered Book Summaries
            </span>

            <h1 className="page-title-xl">
              Read Smarter.{' '}
              <span className="text-(--color-brand)">Discover More.</span>
            </h1>

            <p className="subtitle max-w-lg">
              Get AI-powered summaries of any book in seconds. Understand key
              insights, explore themes, and grow your reading list — all in one
              place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="btn-primary text-lg px-8 py-3.5">
                    Get Started — it&apos;s free
                  </button>
                </SignInButton>
              </Show>
              <Show when="signed-in">
                <Link href="/add-new" className="btn-primary text-lg px-8 py-3.5">
                  Add New Book
                </Link>
              </Show>
              <Link
                href="/library"
                className="btn-secondary text-lg px-8 py-3.5 border border-(--border-medium)"
              >
                Browse Library
              </Link>
            </div>
          </div>

          {/* Illustration */}
          <div className="flex-1 flex items-center justify-center w-full max-w-xs sm:max-w-sm lg:max-w-none">
            <div className="relative w-full max-w-[420px]">
              <div className="absolute inset-0 bg-[var(--bg-primary)] rounded-3xl blur-3xl opacity-60 scale-90" />
              <Image
                src="/hero-illustration.png"
                alt="Books, globe, and lamp illustration"
                width={480}
                height={400}
                priority
                className="relative drop-shadow-xl w-full h-auto"
              />
            </div>
          </div>

        </div>

        {/* How it works — 3 step cards */}
        <div className="mt-12 md:mt-16 hidden sm:block">
          <p className="text-center text-sm font-semibold uppercase tracking-widest text-(--text-secondary) mb-6">
            How it works
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              return (
                <div
                  key={step.number}
                  className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-soft relative overflow-hidden"
                >
                  {/* connector line between cards (desktop) */}
                  {index < steps.length - 1 && (
                    <span className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-4 h-px bg-(--border-medium) z-10" />
                  )}

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-(--accent-light) border border-(--border-subtle) flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-(--color-brand)" />
                    </div>
                    <span className="text-xs font-bold text-(--text-secondary) tracking-widest">
                      STEP {step.number}
                    </span>
                  </div>

                  <div>
                    <p className="library-step-title text-base">{step.title}</p>
                    <p className="library-step-description mt-0.5">{step.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
