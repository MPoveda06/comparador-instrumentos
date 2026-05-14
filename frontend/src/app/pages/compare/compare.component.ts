import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CompareService } from '../../services/compare.service';
import { CompareResponse } from '../../models/instrument.model';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.scss',
})
export class CompareComponent implements OnInit {
  result: CompareResponse | null = null;
  loading = false;
  error = '';
  idA = '';
  idB = '';
  context = '';

  constructor(private compareService: CompareService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['a'] && params['b']) {
        this.idA = params['a'];
        this.idB = params['b'];
        this.runCompare();
      }
    });
  }

  runCompare(): void {
    if (!this.idA || !this.idB) { this.error = 'Introduce los IDs de los dos instrumentos'; return; }
    this.loading = true; this.error = ''; this.result = null;
    this.compareService.compare(this.idA, this.idB, this.context || undefined).subscribe({
      next: (res) => { this.result = res; this.loading = false; },
      error: () => { this.error = 'No se pudo completar la comparación.'; this.loading = false; },
    });
  }
}
