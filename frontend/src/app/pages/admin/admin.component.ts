import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InstrumentService } from '../../services/instrument.service';
import { AuthService } from '../../services/auth.service';
import { Instrument } from '../../models/instrument.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  instruments: Instrument[] = [];
  loading = true;
  showForm = false;

  form = {
    name: '', brand: '', category: 'guitar' as Instrument['category'],
    price: 0, currency: 'EUR', imageUrl: '', sourceUrl: '', store: '',
  };

  constructor(
    private instrumentService: InstrumentService,
    public auth: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.instrumentService.getAll().subscribe({
      next: (res) => {
        this.instruments = res.instruments ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => { this.loading = false; this.cdr.detectChanges(); },
    });
  }

  submit(): void {
    this.instrumentService.create(this.form).subscribe({
      next: () => {
        this.showForm = false;
        this.resetForm();
        this.load();
      },
    });
  }

  resetForm(): void {
    this.form = { name: '', brand: '', category: 'guitar', price: 0, currency: 'EUR', imageUrl: '', sourceUrl: '', store: '' };
  }

  categories = ['guitar', 'bass', 'keyboard', 'drums', 'wind', 'string', 'other'];
}
