import { Model } from 'mongoose';

import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { Jogador } from './interfaces/jogador.interface';

@Injectable()
export class JogadoresService {
  constructor(@InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>) {}

  private readonly logger = new Logger(JogadoresService.name);

  async create(criaJogadorDto: CriarJogadorDto): Promise<Jogador> {
    const { email } = criaJogadorDto;

    const playerExists = await this.jogadorModel.findOne({ email }).exec();

    if (playerExists) {
      throw new BadRequestException(`O e-mail ${email} já possui um cadastro na nossa base de dados.`);
    }

    const createdPlayer = new this.jogadorModel(criaJogadorDto);

    const savePlayer = await createdPlayer.save();

    return savePlayer;
  }

  async update(_id: string, atualizarJogadorDto: AtualizarJogadorDto): Promise<void> {
    const playerExists = await this.jogadorModel.findOne({ _id }).exec();

    if (!playerExists) {
      throw new NotFoundException(`O id ${_id} não foi encontrado na nossa base de dados.`);
    }

    await this.jogadorModel.findOneAndUpdate({ _id }, { $set: atualizarJogadorDto }).exec();
  }

  async getAll(): Promise<Jogador[]> {
    const search = await this.jogadorModel.find().exec();
    return search;
  }

  async getById(_id: string): Promise<Jogador> {
    const playerFound = await this.jogadorModel.findOne({ _id }).exec();

    if (!playerFound) {
      throw new NotFoundException(`Jogador com o id ${_id} não encontrado.`);
    }

    return playerFound;
  }

  async deletePlayer(_id: string): Promise<any> {
    const playerFound = await this.jogadorModel.findOne({ _id }).exec();

    if (!playerFound) {
      throw new NotFoundException(`Jogador com o id ${_id} não encontrado.`);
    }

    const playerDelete = await this.jogadorModel.deleteOne({ _id }).exec();
    return playerDelete;
  }
}
