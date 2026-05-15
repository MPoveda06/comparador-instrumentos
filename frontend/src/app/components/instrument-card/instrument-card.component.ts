import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Instrument, CATEGORY_LABELS } from '../../models/instrument.model';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-instrument-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instrument-card.component.html',
  styleUrl: './instrument-card.component.scss',
})
export class InstrumentCardComponent {
  @Input() instrument!: Instrument;
  @Input() isInCompare = false;
  @Output() addToCompare = new EventEmitter<Instrument>();

  categoryLabels = CATEGORY_LABELS;

  constructor(public favs: FavoritesService, public auth: AuthService) {}

  get badge(): string {
    const badges = ['TRENDING', 'BEST SELLER', 'PRO CHOICE', 'LEGENDARY'];
    return badges[Math.floor(this.instrument.eloRating / 250) % badges.length];
  }

  onCompareClick(): void { this.addToCompare.emit(this.instrument); }

  onFavoriteClick(): void { this.favs.toggle(this.instrument.id); }
}
