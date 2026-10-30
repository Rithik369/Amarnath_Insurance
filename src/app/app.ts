import { Component, computed, inject, signal } from '@angular/core';
import { CountUp, Reveal } from './shared/directives';
import { formatPhone, openWhatsApp, Toast, waLink } from './shared/utils';
import { ClaimChecklist } from './sections/claim-checklist';
import { CoverCalculator } from './sections/cover-calculator';
import { RenewalReminder } from './sections/renewal-reminder';
import { FAQS, InsuranceType, PARTNERS, SERVICES, SITE, STATS, STEPS } from './site-data';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-root',
  imports: [Reveal, CountUp, CoverCalculator, ClaimChecklist, RenewalReminder],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: { '(window:scroll)': 'onScroll()' },
})
export class App {
  protected readonly toast = inject(Toast);

  protected readonly site = SITE;
  protected readonly services = SERVICES;
  protected readonly steps = STEPS;
  protected readonly faqs = FAQS;
  protected readonly stats = STATS;
  protected readonly partners = [...PARTNERS, ...PARTNERS];
  protected readonly year = new Date().getFullYear();
  protected readonly formatPhone = formatPhone;
  protected readonly generalWa = waLink(
    'Hello RML Insurances, I would like to know more about insurance.',
  );
  protected readonly reviewWa = waLink(
    'Hello RML Insurances, I would like a free review of my existing policy.',
  );

  protected readonly theme = signal<Theme>(
    document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light',
  );
  protected readonly menuOpen = signal(false);
  protected readonly scrolled = signal(false);
  protected readonly progress = signal(0);
  protected readonly showTop = signal(false);

  protected readonly activeTab = signal<InsuranceType>('Health');
  protected readonly activeService = computed(
    () => this.services.find((s) => s.type === this.activeTab())!,
  );
  protected readonly reviewView = signal<'covers' | 'excludes'>('covers');
  protected readonly openFaq = signal<number | null>(0);

  protected readonly quoteType = signal<InsuranceType>('Health');
  protected readonly quoteName = signal('');
  protected readonly quoteError = signal(false);

  protected onScroll(): void {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    this.scrolled.set(y > 10);
    this.showTop.set(y > 700);
    this.progress.set(max > 0 ? Math.min(100, (y / max) * 100) : 0);
  }

  protected toggleTheme(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    document.documentElement.dataset['theme'] = next;
    try {
      localStorage.setItem('rml-theme', next);
    } catch {
      // Storage may be blocked (private mode); the theme still applies for this visit.
    }
  }

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected toTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected toggleFaq(i: number): void {
    this.openFaq.update((cur) => (cur === i ? null : i));
  }

  protected askAbout(type: InsuranceType): void {
    this.quoteType.set(type);
    this.toTop();
    setTimeout(() => document.getElementById('qname')?.focus({ preventScroll: true }), 500);
  }

  protected sendQuote(event: Event): void {
    event.preventDefault();
    const name = this.quoteName().trim();
    if (!name) {
      this.quoteError.set(true);
      return;
    }
    this.quoteError.set(false);
    openWhatsApp(
      `Hello RML Insurances, I am ${name}. I would like a quote for ${this.quoteType()} insurance.`,
    );
    this.toast.show('✅ Opening WhatsApp with your request…');
  }
}
