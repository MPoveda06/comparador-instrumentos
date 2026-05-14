import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import axios from 'axios';

@Controller('search')
export class SearchController {
  @Get()
  async search(@Query('q') q: string) {
    if (!q) throw new BadRequestException('Falta el parámetro q');

    const response = await axios.post('https://api.tavily.com/search', {
      api_key: process.env.TAVILY_API_KEY,
      query: `${q} instrumento musical precio especificaciones tienda`,
      search_depth: 'basic',
      max_results: 10,
      include_domains: ['thomann.de', 'musicstore.de', 'amazon.es', 'reverb.com', 'sweetwater.com'],
    });

    return { results: response.data.results };
  }
}
