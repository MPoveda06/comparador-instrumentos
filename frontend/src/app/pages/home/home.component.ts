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

const SORT_OPTIONS = [
  { key: 'elo', label: 'Mejor valorados' },
  { key: 'price_asc', label: 'Precio: menor a mayor' },
  { key: 'price_desc', label: 'Precio: mayor a menor' },
  { key: 'name', label: 'Nombre A-Z' },
];

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, InstrumentCardComponent, ComparatorBarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  allInstruments: Instrument[] = [];
  filteredInstruments: Instrument[] = [];
  compareList: Instrument[] = [];
  searchQuery = '';
  activeCategory = '';
  activeSort = 'elo';
  maxPrice = 5000;
  showFilters = false;
  loading = true;
  categories = CATEGORIES;
  sortOptions = SORT_OPTIONS;

  constructor(private instrumentService: InstrumentService) {}

  ngOnInit(): void {
    this.loadInstruments();
  }

  loadInstruments(): void {
    this.loading = true;
    this.instrumentService.getAll().subscribe({
      next: (res) => {
        this.allInstruments = res.instruments ?? [];
        this.applyFilters();
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }

  applyFilters(): void {
    let result = this.allInstruments.filter(i => {
      const matchCategory = !this.activeCategory || i.category === this.activeCategory;
      const matchPrice = i.price <= this.maxPrice;
      const matchSearch = !this.searchQuery ||
        i.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        i.brand.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCategory && matchPrice && matchSearch;
    });

    switch (this.activeSort) {
      case 'elo':        result.sort((a, b) => b.eloRating - a.eloRating); break;
      case 'price_asc':  result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'name':       result.sort((a, b) => a.name.localeCompare(b.name)); break;
    }

    this.filteredInstruments = [...result];
  }

  onSearch(): void { this.applyFilters(); }

  setCategory(key: string): void {
    this.activeCategory = key;
    this.applyFilters();
  }

  setSort(key: string): void {
    this.activeSort = key;
    this.applyFilters();
  }

  toggleFilters(): void { this.showFilters = !this.showFilters; }

  toggleCompare(instrument: Instrument): void {
    const exists = this.compareList.find(i => i.id === instrument.id);
    if (exists) {
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
