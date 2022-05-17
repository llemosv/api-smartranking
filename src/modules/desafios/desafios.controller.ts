import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';

import { DesafiosService } from './desafios.service';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { Desafio } from './interfaces/desafio.interface';
import { DesafioStatusValidacaoPipe } from './pipes/desafio-status-validation.pipe';

@Controller('api/v1/desafios')
class DesafiosController {
  constructor(private readonly desafiosService: DesafiosService) {}

  @Post('create')
  @UsePipes(ValidationPipe)
  async createChallenge(@Body() criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    const create = await this.desafiosService.create(criarDesafioDto);

    return create;
  }

  @Get('listAll')
  async getAll(): Promise<Desafio[]> {
    const challenges = await this.desafiosService.getAll();

    return challenges;
  }

  @Get('listByPlayer')
  async getByPlayer(@Query('idJogador') _id: any): Promise<Desafio | Desafio[]> {
    const playerChallenges = await this.desafiosService.getByPlayer(_id);

    return playerChallenges;
  }

  @Put('update/:desafio')
  async updateChallenge(
    @Body(DesafioStatusValidacaoPipe) atualizarDesafioDto: AtualizarDesafioDto,
    @Param('desafio') _id: string,
  ): Promise<void> {
    await this.desafiosService.updateChallenge(_id, atualizarDesafioDto);
  }

  @Post(':desafio/partida')
  async assignMatchChallenge(
    @Body(ValidationPipe) atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto,
    @Param('desafio') _id: string,
  ): Promise<void> {
    await this.desafiosService.assignMatchChallenge(_id, atribuirDesafioPartidaDto);
  }

  @Delete('delete/:_id')
  async delete(@Param('_id') _id: string): Promise<void> {
    await this.desafiosService.delete(_id);
  }
}

export { DesafiosController };
