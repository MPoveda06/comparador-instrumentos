import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Instrument } from '../../models/instrument.model';

@Component({
  selector: 'app-comparator-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comparator-bar.component.html',
  styleUrl: './comparator-bar.component.scss',
})
export class ComparatorBarComponent {
  @Input() instruments: Instrument[] = [];
  @Output() remove = new EventEmitter<string>();
  @Output() clear = new EventEmitter<void>();

  constructor(private router: Router) {}

  get slots(): (Instrument | null)[] {
    return [this.instruments[0] ?? null, this.instruments[1] ?? null];
  }

  onCompare(): void {
    if (this.instruments.length === 2) {
      this.router.navigate(['/compare'], {
        queryParams: { a: this.instruments[0].id, b: this.instruments[1].id }
      });
    }
  }
}
