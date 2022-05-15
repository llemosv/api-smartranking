import { Document } from 'mongoose';
import { Jogador } from 'src/jogadores/interfaces/jogador.interface';

interface Categoria extends Document {
  readonly categorias: string;
  descricao: string;
  eventos: Array<Evento>;
  jogadores: Array<Jogador>;
}

interface Evento {
  nome: string;
  operacao: string;
  valor: number;
}

export { Categoria, Evento };
