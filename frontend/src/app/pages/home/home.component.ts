import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InstrumentService } from '../../services/instrument.service';
import { Instrument } from '../../models/instrument.model';
import { InstrumentCardComponent } from '../../components/instrument-card/instrument-card.component';
import { ComparatorBarComponent } from '../../components/comparator-bar/comparator-bar.component';

const CATEGORIES = [
  { key: '', label: 'Todos' },
  { key: 'guitar', label: 'Guitarras' },
  { key: 'bass', label: 'Bajos' },
  { key: 'keyboard', label: 'Teclados' },
  { key: 'drums', label: 'Baterías' },
  { key: 'wind', label: 'Viento' },
  { key: 'string', label: 'Cuerda' },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, InstrumentCardComponent, ComparatorBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  instruments: Instrument[] = [];
  compareList: Instrument[] = [];
  searchQuery = '';
  activeCategory = '';
  loading = true;
  categories = CATEGORIES;

  constructor(private instrumentService: InstrumentService) {}

  ngOnInit(): void {
    this.loadInstruments();
  }

  loadInstruments(): void {
    this.loading = true;
    this.instrumentService.getAll(this.activeCategory || undefined, this.searchQuery || undefined)
      .subscribe({
        next: (res) => { this.instruments = res.instruments ?? []; this.loading = false; },
        error: () => { this.loading = false; },
      });
  }

  onSearch(): void {
    this.loadInstruments();
  }

  setCategory(key: string): void {
    this.activeCategory = key;
    this.loadInstruments();
  }

  toggleCompare(instrument: Instrument): void {
    const idx = this.compareList.findIndex(i => i.id === instrument.id);
    if (idx >= 0) {
      this.compareList = this.compareList.filter(i => i.id !== instrument.id);
    } else if (this.compareList.length < 2) {
      this.compareList = [...this.compareList, instrument];
    }
  }

  isInCompare(id: string): boolean {
    return this.compareList.some(i => i.id === id);
  }

  removeFromCompare(id: string): void {
    this.compareList = this.compareList.filter(i => i.id !== id);
  }
}
