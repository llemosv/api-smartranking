import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JogadoresModule } from './jogadores/jogadores.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://llemos:llemos@123@cluster0.fbdln.mongodb.net/smartranking?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      },
    ),
    JogadoresModule,
    CategoriasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
