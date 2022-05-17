import { IsNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize, IsDateString } from 'class-validator';
import { Jogador } from 'src/modules/jogadores/interfaces/jogador.interface';

class CriarDesafioDto {
  @IsNotEmpty()
  @IsDateString()
  dataHoraDesafio: Date;

  @IsNotEmpty()
  solicitante: Jogador;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  jogadores: Jogador[];
}

export { CriarDesafioDto };
