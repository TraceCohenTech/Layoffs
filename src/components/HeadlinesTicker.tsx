import { Quote, BarChart3, Newspaper } from 'lucide-react';
import type { Headline } from '../types';

interface HeadlinesTickerProps {
  headlines: Headline[];
}

function HeadlineItem({ headline }: { headline: Headline }) {
  const icon = headline.type === 'quote'
    ? <Quote className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
    : headline.type === 'stat'
      ? <BarChart3 className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
      : <Newspaper className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />;

  return (
    <span className="inline-flex items-center gap-2 px-6 whitespace-nowrap">
      {icon}
      <span className={`text-sm ${headline.type === 'quote' ? 'italic' : ''} text-slate-800`}>
        {headline.text}
      </span>
      {headline.company && (
        <span className="text-xs text-blue-700 font-medium">— {headline.company}</span>
      )}
      <span className="text-xs text-slate-400">{headline.source}, {headline.date}</span>
      <span className="text-slate-300 mx-4">|</span>
    </span>
  );
}

export function HeadlinesTicker({ headlines }: HeadlinesTickerProps) {
  return (
    <div className="relative rounded-xl border border-slate-200/80 bg-white mb-8 overflow-hidden">
      {/* Fade edges matching #f5f5f7 background */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="py-3 overflow-hidden">
        <div className="ticker-track">
          {headlines.map((h, i) => (
            <HeadlineItem key={`a-${i}`} headline={h} />
          ))}
          {headlines.map((h, i) => (
            <HeadlineItem key={`b-${i}`} headline={h} />
          ))}
        </div>
      </div>
    </div>
  );
}
