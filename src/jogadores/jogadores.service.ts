/* eslint-disable new-cap */
import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { CriarJogadorDto } from './dtos/criar-jogador.dto'
import { Jogador } from './interfaces/jogador.interface'

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>
  ) {}

  private readonly logger = new Logger(JogadoresService.name)

  async createAndUpdate(criaJogadorDto: CriarJogadorDto): Promise<void> {
    const { email } = criaJogadorDto

    const playerExists = await this.jogadorModel.findOne({ email }).exec()

    if (playerExists) {
      await this.update(criaJogadorDto)
    } else {
      await this.create(criaJogadorDto)
    }
  }

  private async create(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const player = new this.jogadorModel(criaJogadorDto)

    const save = await player.save()

    return save
  }

  async update(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const searchPlayer = await this.jogadorModel
      .findOneAndUpdate(
        { email: criaJogadorDto.email },
        { $set: criaJogadorDto }
      )
      .exec()

    return searchPlayer
  }

  async getAll(): Promise<Jogador[]> {
    const busca = await this.jogadorModel.find().exec()
    return busca
  }

  async getByEmail(email: string): Promise<Jogador> {
    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec()

    if (!jogadorEncontrado) {
      throw new NotFoundException(`Jogador com id ${email} não encontrado`)
    }

    return jogadorEncontrado
  }

  async deletarJogador(email: string): Promise<any> {
    const playerDelete = await this.jogadorModel.remove({ email }).exec()
    return playerDelete
  }
}
