import { Controller, Post, Body, Get, Delete, Query } from '@nestjs/common'

import { CriarJogadorDto } from './dtos/criar-jogador.dto'
import { Jogador } from './interfaces/jogador.interface'
import { JogadoresService } from './jogadores.service'

@Controller('api/v1/jogadores')
export class JogadoresController {
  constructor(private readonly jogadoresService: JogadoresService) {}

  @Post('create')
  async createAndUpdatePlayer(
    @Body() criarJogadorDto: CriarJogadorDto
  ): Promise<void> {
    await this.jogadoresService.createAndUpdate(criarJogadorDto)
  }

  @Get('list')
  async consultarJogadores(
    @Query('email') email: string
  ): Promise<Jogador[] | Jogador> {
    if (email) {
      const searchPlayerEmail = await this.jogadoresService.getByEmail(email)
      return searchPlayerEmail
    }

    const searchPlayer = await this.jogadoresService.getAll()
    return searchPlayer
  }

  @Delete('delete')
  async deletarJogador(@Query('email') email: string): Promise<void> {
    await this.jogadoresService.deletarJogador(email)
  }
}
