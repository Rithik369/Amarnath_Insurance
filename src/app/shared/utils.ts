import { Injectable, signal } from '@angular/core';
import { SITE } from '../site-data';

export function waLink(message: string): string {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function openWhatsApp(message: string): void {
  window.open(waLink(message), '_blank', 'noopener');
}

export function formatPhone(p: string): string {
  return `${p.slice(0, 5)} ${p.slice(5)}`;
}

/** Formats an amount given in lakhs as "₹50 Lakh" or "₹1.25 Crore". */
export function formatLakh(lakh: number): string {
  if (lakh >= 100) {
    return `₹${Math.round(lakh) / 100} Crore`;
  }
  return `₹${lakh} Lakh`;
}

@Injectable({ providedIn: 'root' })
export class Toast {
  readonly message = signal<string | null>(null);
  private timer?: ReturnType<typeof setTimeout>;

  show(message: string): void {
    this.message.set(message);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.message.set(null), 3200);
  }
}
