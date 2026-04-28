'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex-shrink-0"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          Copié
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          Copier
        </>
      )}
    </button>
  )
}
