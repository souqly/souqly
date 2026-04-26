'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  subtitle?: string;
}

// 'use client' : état accordion
export default function FAQ({
  items,
  title = 'Questions fréquentes',
  subtitle = 'Tout ce que vous devez savoir avant de commencer.',
}: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="bg-slate-900 py-20 sm:py-28" id="faq">
      <div className="mx-auto max-w-3xl px-5">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">FAQ</p>
          <h2 className="font-heading mt-3 text-3xl font-bold text-white sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-slate-400">{subtitle}</p>
        </div>

        <dl className="mt-12 space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-xl border border-white/10 bg-slate-800/40 transition-colors hover:border-white/20"
              >
                <dt>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                  >
                    <span className="font-medium text-white">{item.question}</span>
                    <ChevronDown
                      className={[
                        'h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200',
                        isOpen ? 'rotate-180' : '',
                      ].join(' ')}
                      aria-hidden="true"
                    />
                  </button>
                </dt>
                {isOpen && (
                  <dd className="px-6 pb-5 text-sm leading-7 text-slate-400">
                    {item.answer}
                  </dd>
                )}
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
