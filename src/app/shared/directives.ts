import { Directive, ElementRef, inject, input, OnDestroy, OnInit } from '@angular/core';

/** Fades/slides an element in the first time it scrolls into view. */
@Directive({
  selector: '[reveal]',
  host: { class: 'reveal' },
})
export class Reveal implements OnInit, OnDestroy {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private io?: IntersectionObserver;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    if (!('IntersectionObserver' in window)) {
      node.classList.add('in');
      return;
    }
    this.io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('in');
          this.io?.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    this.io.observe(node);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}

/** Counts a number up from 0 when it scrolls into view. */
@Directive({ selector: '[countUp]' })
export class CountUp implements OnInit, OnDestroy {
  readonly countUp = input.required<number>();
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private io?: IntersectionObserver;

  ngOnInit(): void {
    const node = this.el.nativeElement;
    const target = this.countUp();
    if (!('IntersectionObserver' in window)) {
      node.textContent = String(target);
      return;
    }
    node.textContent = '0';
    this.io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      this.io?.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / 1200);
        node.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    this.io.observe(node);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
