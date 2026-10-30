import { Component, computed, signal } from '@angular/core';
import { Reveal } from '../shared/directives';
import { formatLakh, openWhatsApp } from '../shared/utils';

const HEALTH_STEPS = [5, 7.5, 10, 15, 20, 25, 30, 50, 100];

@Component({
  selector: 'app-cover-calculator',
  imports: [Reveal],
  templateUrl: './cover-calculator.html',
  styleUrl: './cover-calculator.css',
})
export class CoverCalculator {
  protected readonly mode = signal<'term' | 'health'>('term');

  // Term life inputs (amounts in lakhs)
  protected readonly income = signal(6);
  protected readonly age = signal(30);
  protected readonly loans = signal(0);

  protected readonly multiplier = computed(() => {
    const a = this.age();
    return a <= 35 ? 20 : a <= 45 ? 15 : a <= 55 ? 12 : 10;
  });

  protected readonly termCover = computed(() => {
    const raw = this.income() * this.multiplier() + this.loans();
    const unit = raw >= 100 ? 25 : 5;
    return Math.max(25, Math.ceil(raw / unit) * unit);
  });

  // Health inputs
  protected readonly members = signal(2);
  protected readonly city = signal<'metro' | 'non-metro'>('metro');
  protected readonly eldest = signal(35);

  protected readonly healthCover = computed(() => {
    let c = this.city() === 'metro' ? 10 : 5;
    const m = this.members();
    if (m >= 3) c += 5;
    if (m >= 5) c += 5;
    if (this.eldest() >= 45) c += 5;
    if (this.eldest() >= 60) c += 5;
    return HEALTH_STEPS.find((s) => s >= c) ?? c;
  });

  protected readonly result = computed(() =>
    formatLakh(this.mode() === 'term' ? this.termCover() : this.healthCover()),
  );

  protected readonly fmt = formatLakh;

  protected num(e: Event): number {
    return Number((e.target as HTMLInputElement).value);
  }

  protected changeMembers(delta: number): void {
    this.members.update((m) => Math.min(8, Math.max(1, m + delta)));
  }

  protected discuss(): void {
    const msg =
      this.mode() === 'term'
        ? `Hello RML Insurances, I used your cover calculator. Age ${this.age()}, annual income ${formatLakh(this.income())}, loans ${formatLakh(this.loans())}. Suggested term cover: ${this.result()}. Please help me choose a plan.`
        : `Hello RML Insurances, I used your cover calculator. ${this.members()} member(s), ${this.city()} city, eldest age ${this.eldest()}. Suggested health cover: ${this.result()}. Please help me choose a plan.`;
    openWhatsApp(msg);
  }
}
