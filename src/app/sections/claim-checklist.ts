import { Component, computed, signal } from '@angular/core';
import { CLAIM_DOCS, InsuranceType } from '../site-data';
import { Reveal } from '../shared/directives';
import { openWhatsApp } from '../shared/utils';

@Component({
  selector: 'app-claim-checklist',
  imports: [Reveal],
  templateUrl: './claim-checklist.html',
  styleUrl: './claim-checklist.css',
})
export class ClaimChecklist {
  protected readonly types = Object.keys(CLAIM_DOCS) as InsuranceType[];
  protected readonly type = signal<InsuranceType>('Health');
  protected readonly checked = signal<ReadonlySet<string>>(new Set());

  protected readonly docs = computed(() => CLAIM_DOCS[this.type()]);
  protected readonly done = computed(
    () => this.docs().filter((d) => this.checked().has(this.key(d))).length,
  );
  protected readonly percent = computed(() => Math.round((this.done() / this.docs().length) * 100));

  protected key(doc: string): string {
    return `${this.type()}|${doc}`;
  }

  protected toggle(doc: string): void {
    const k = this.key(doc);
    this.checked.update((s) => {
      const next = new Set(s);
      if (next.has(k)) next.delete(k);
      else next.add(k);
      return next;
    });
  }

  protected reset(): void {
    this.checked.update((s) => new Set([...s].filter((k) => !k.startsWith(`${this.type()}|`))));
  }

  protected askHelp(): void {
    const missing = this.docs().filter((d) => !this.checked().has(this.key(d)));
    const msg =
      `Hello RML Insurances, I need help with a ${this.type()} insurance claim.` +
      (missing.length ? ` I still need: ${missing.join(', ')}.` : ' I have all documents ready.');
    openWhatsApp(msg);
  }
}
