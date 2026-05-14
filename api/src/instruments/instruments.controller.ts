import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import type { CreateInstrumentDto } from './instrument.types';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly service: InstrumentsService) {}

  @Get()
  async findAll(@Query('category') category?: string, @Query('q') q?: string) {
    const instruments = q
      ? await this.service.search(q)
      : await this.service.findAll(category);
    return { instruments };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateInstrumentDto) {
    return this.service.create(dto);
  }
}
