import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriasModule } from './modules/categorias/categorias.module';
import { DesafiosModule } from './modules/desafios/desafios.module';
import { JogadoresModule } from './modules/jogadores/jogadores.module';

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
    DesafiosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
