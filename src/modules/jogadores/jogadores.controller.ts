import { Controller, Post, Body, Get, Delete, UsePipes, ValidationPipe, Param, Put } from '@nestjs/common';

import { ValidacaoParametrosPipe } from '../../common/pipes/validacao-parametros.pipe';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post('create')
  @UsePipes(ValidationPipe)
  async create(@Body() criarJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const create = await this.jogadoresService.create(criarJogadorDto);

    return create;
  }

  @Put('update/:_id')
  @UsePipes(ValidationPipe)
  async update(
    @Param('_id', ValidacaoParametrosPipe) _id: string,
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
  ): Promise<void> {
    await this.jogadoresService.update(_id, atualizarJogadorDto);
  }

  @Get('list')
  async getAllPlayers(): Promise<Jogador[]> {
    const searchPlayer = await this.jogadoresService.getAll();
    return searchPlayer;
  }

  @Get('listById/:_id')
  async getPlayerById(@Param('_id', ValidacaoParametrosPipe) _id: string): Promise<Jogador> {
    const searchPlayerId = await this.jogadoresService.getById(_id);
    return searchPlayerId;
  }

  @Delete('delete/:_id')
  async deletarJogador(@Param('_id', ValidacaoParametrosPipe) _id: string): Promise<void> {
    await this.jogadoresService.deletePlayer(_id);
  }
}
