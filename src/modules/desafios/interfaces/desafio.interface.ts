import { Document } from 'mongoose';
import { Jogador } from 'src/modules/jogadores/interfaces/jogador.interface';

import { DesafioStatus } from './desafio-status.enum';

interface Desafio extends Document {
  dataHoraDesafio: Date;
  status: DesafioStatus;
  dataHoraSolicitacao: Date;
  dataHoraResposta: Date;
  solicitante: Jogador;
  categoria: string;
  jogadores: Array<Jogador>;
  partida: Partida;
}

interface Partida extends Document {
  categoria: string;
  jogadores: Array<Jogador>;
  def: Jogador;
  resultado: Array<Resultado>;
}

interface Resultado {
  set: string;
}

export { Desafio, Partida, Resultado };
