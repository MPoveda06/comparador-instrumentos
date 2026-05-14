import { Controller, Post, Body, NotFoundException } from '@nestjs/common';
import { CompareService, updateRatings } from './compare.service';
import { InstrumentsService } from '../instruments/instruments.service';

@Controller('compare')
export class CompareController {
  constructor(
    private readonly compareService: CompareService,
    private readonly instrumentsService: InstrumentsService,
  ) {}

  @Post()
  async compare(@Body() body: { instrumentAId: string; instrumentBId: string; context?: string }) {
    const [a, b] = await Promise.all([
      this.instrumentsService.findOne(body.instrumentAId),
      this.instrumentsService.findOne(body.instrumentBId),
    ]);

    if (!a || !b) throw new NotFoundException('Instrumento no encontrado');

    const result = await this.compareService.compare(a, b, body.context);
    const { newRatingA, newRatingB } = updateRatings(a.eloRating, b.eloRating, result.winner);

    await Promise.all([
      this.instrumentsService.updateElo(a.id, newRatingA),
      this.instrumentsService.updateElo(b.id, newRatingB),
    ]);

    return {
      comparison: result,
      instruments: {
        a: { ...a, eloRating: newRatingA },
        b: { ...b, eloRating: newRatingB },
      },
    };
  }
}
