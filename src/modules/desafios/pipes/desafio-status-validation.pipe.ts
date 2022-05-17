import { BadRequestException, PipeTransform } from '@nestjs/common';

import { DesafioStatus } from '../interfaces/desafio-status.enum';

class DesafioStatusValidacaoPipe implements PipeTransform {
  readonly allowedStatus = [DesafioStatus.ACEITO, DesafioStatus.NEGADO, DesafioStatus.CANCELADO];

  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.validStatus(status)) {
      throw new BadRequestException(`${status} é um status inválido`);
    }

    return value;
  }

  private validStatus(status: any) {
    const idx = this.allowedStatus.indexOf(status);
    // -1 se o elemento não for encontrado
    return idx !== -1;
  }
}

export { DesafioStatusValidacaoPipe };
