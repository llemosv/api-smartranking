import { IsNotEmpty } from 'class-validator';

import { Jogador } from '../../jogadores/interfaces/jogador.interface';
import { Resultado } from '../interfaces/desafio.interface';

class AtribuirDesafioPartidaDto {
  @IsNotEmpty()
  def: Jogador;

  @IsNotEmpty()
  resultado: Array<Resultado>;
}

export { AtribuirDesafioPartidaDto };
