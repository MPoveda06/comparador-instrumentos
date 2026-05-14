import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { InstrumentsService } from './instruments.service';
import type { CreateInstrumentDto } from './instrument.types';

@Controller('instruments')
export class InstrumentsController {
  constructor(private readonly service: InstrumentsService) {}

  @Get()
  findAll(@Query('category') category?: string, @Query('q') q?: string) {
    if (q) return this.service.search(q);
    return this.service.findAll(category);
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
