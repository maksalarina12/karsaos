'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'

export interface KarsaLogoProps {
  width?: number
  height?: number
  className?: string
  priority?: boolean
  showText?: boolean
  href?: string
}

export function KarsaLogo({
  width = 36,
  height = 36,
  className = '',
  priority = true,
  showText = false,
  href = '/',
}: KarsaLogoProps) {
  const logoContent = (
    <div className={`inline-flex items-center gap-2.5 group cursor-pointer ${className}`}>
      <Image
        src="/karsaos.png"
        alt="KarsaOS Logo"
        width={width}
        height={height}
        className="object-contain hover:opacity-90 hover:scale-105 transition-all duration-200"
        priority={priority}
      />
      {showText && (
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Karsa<span className="text-indigo-600 dark:text-indigo-400">OS</span>
          </span>
          <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-mono font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Strategi & Keuangan
          </span>
        </div>
      )}
    </div>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg"
      >
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
