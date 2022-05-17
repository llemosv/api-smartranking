import { IsOptional } from 'class-validator';

import { DesafioStatus } from '../interfaces/desafio-status.enum';

class AtualizarDesafioDto {
  @IsOptional()
  dataHoraDesafio: Date;

  @IsOptional()
  status: DesafioStatus;
}

export { AtualizarDesafioDto };
