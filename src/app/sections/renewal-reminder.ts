import { Component, computed, inject, signal } from '@angular/core';
import { InsuranceType, SERVICES, SITE } from '../site-data';
import { Reveal } from '../shared/directives';
import { formatPhone, openWhatsApp, Toast } from '../shared/utils';

const DAY = 24 * 60 * 60 * 1000;

function toInputDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function parseInputDate(v: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
}

@Component({
  selector: 'app-renewal-reminder',
  imports: [Reveal],
  templateUrl: './renewal-reminder.html',
  styleUrl: './renewal-reminder.css',
})
export class RenewalReminder {
  private readonly toast = inject(Toast);

  protected readonly types = SERVICES.map((s) => s.type);
  protected readonly type = signal<InsuranceType>('Motor');
  protected readonly name = signal('');
  protected readonly date = signal('');
  protected readonly today = toInputDate(new Date());
  protected readonly error = signal<string | null>(null);

  protected readonly daysLeft = computed(() => {
    const d = parseInputDate(this.date());
    if (!d) return null;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.round((d.getTime() - today.getTime()) / DAY);
  });

  private dueDate(): Date | null {
    const d = parseInputDate(this.date());
    const left = this.daysLeft();
    if (!this.name().trim()) {
      this.error.set('Please enter your name.');
      return null;
    }
    if (!d || left === null || left < 0) {
      this.error.set('Please pick a renewal date that is today or later.');
      return null;
    }
    this.error.set(null);
    return d;
  }

  private pretty(d: Date): string {
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  protected remindOnWhatsApp(): void {
    const d = this.dueDate();
    if (!d) return;
    openWhatsApp(
      `Hello RML Insurances, I am ${this.name().trim()}. My ${this.type()} insurance is due for renewal on ${this.pretty(d)}. Please remind me and share renewal options.`,
    );
  }

  protected addToCalendar(): void {
    const due = this.dueDate();
    if (!due) return;
    const remindOn = new Date(Math.max(due.getTime() - 7 * DAY, Date.now()));
    const ymd = (d: Date) => toInputDate(d).replaceAll('-', '');
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//RML Insurances//Renewal Reminder//EN',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@rmlinsurances`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${ymd(remindOn)}`,
      `DTEND;VALUE=DATE:${ymd(new Date(remindOn.getTime() + DAY))}`,
      `SUMMARY:Renew ${this.type()} insurance (due ${this.pretty(due)})`,
      `DESCRIPTION:Call RML Insurances on ${formatPhone(SITE.phones[0])} or WhatsApp for renewal help.`,
      'BEGIN:VALARM',
      'TRIGGER:PT9H',
      'ACTION:DISPLAY',
      `DESCRIPTION:Renew your ${this.type()} insurance`,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `renew-${this.type().toLowerCase().replace(' ', '-')}-insurance.ics`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.toast.show('📅 Reminder saved! Open the file to add it to your calendar.');
  }
}
