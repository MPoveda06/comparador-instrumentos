import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { InstrumentsModule } from './instruments/instruments.module';
import { CompareModule } from './compare/compare.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    InstrumentsModule,
    CompareModule,
    SearchModule,
  ],
})
export class AppModule {}
