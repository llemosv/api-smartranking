import { Model } from 'mongoose';

import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CategoriasService } from '../categorias/categorias.service';
import { JogadoresService } from '../jogadores/jogadores.service';
import { AtribuirDesafioPartidaDto } from './dtos/atribuir-desafio-partida.dto';
import { AtualizarDesafioDto } from './dtos/atualizar-desafio.dto';
import { CriarDesafioDto } from './dtos/criar-desafio.dto';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { Desafio, Partida } from './interfaces/desafio.interface';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,

    private readonly categoriasService: CategoriasService,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async create(criarDesafioDto: CriarDesafioDto): Promise<Desafio> {
    await Promise.all(
      criarDesafioDto.jogadores.map(async (jogadorDto) => {
        await this.jogadoresService.getById(jogadorDto._id);
      }),
    );

    const requesterIsPlayerMatch = criarDesafioDto.jogadores.filter(
      (player) => player._id === criarDesafioDto.solicitante,
    );

    if (requesterIsPlayerMatch.length === 0)
      throw new BadRequestException(`O solicitante deve ser um jogador da partida.`);

    const playerCategory = await this.categoriasService.getCategoryPlayer(criarDesafioDto.solicitante);

    if (!playerCategory) throw new BadRequestException(`O solicitante deve estar cadastrado em uma categoria.`);

    const createChallenge = new this.desafioModel(criarDesafioDto);
    createChallenge.categoria = playerCategory.categorias;
    createChallenge.dataHoraSolicitacao = new Date();
    createChallenge.status = DesafioStatus.PENDENTE;

    return createChallenge.save();
  }

  async getAll(): Promise<Desafio[]> {
    const challenges = this.desafioModel
      .find()
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();
    return challenges;
  }

  async getByPlayer(_id: any): Promise<Desafio | Desafio[]> {
    await this.jogadoresService.getById(_id);

    const search = await this.desafioModel
      .find()
      .where('jogadores')
      .in(_id)
      .populate('solicitante')
      .populate('jogadores')
      .populate('partida')
      .exec();

    return search;
  }

  async updateChallenge(_id: string, atualizarDesafioDto: AtualizarDesafioDto): Promise<void> {
    const challengeFound = await this.desafioModel.findById(_id).exec();

    if (!challengeFound) throw new NotFoundException(`Desafio ${_id} não cadastrado.`);

    if (atualizarDesafioDto.status) challengeFound.dataHoraResposta = new Date();

    challengeFound.status = atualizarDesafioDto.status;
    challengeFound.dataHoraDesafio = atualizarDesafioDto.dataHoraDesafio;

    await this.desafioModel.findOneAndUpdate({ _id }, { $set: challengeFound }).exec();
  }

  async assignMatchChallenge(_id: string, atribuirDesafioPartidaDto: AtribuirDesafioPartidaDto): Promise<void> {
    const challengeFound = await this.desafioModel.findById(_id).exec();

    if (!challengeFound) throw new NotFoundException(`Desafio ${_id} não cadastrado.`);

    const filterPlayer = challengeFound.jogadores.filter((player) => player._id == atribuirDesafioPartidaDto.def);

    if (filterPlayer.length === 0) throw new BadRequestException(`O jogador vencedor não faz parte do desafio!`);

    const createMatch = new this.partidaModel(atribuirDesafioPartidaDto);

    createMatch.categoria = challengeFound.categoria;
    createMatch.jogadores = challengeFound.jogadores;

    const result = await createMatch.save();

    challengeFound.status = DesafioStatus.REALIZADO;
    challengeFound.partida = result._id;

    try {
      await this.desafioModel.findOneAndUpdate({ _id }, { $set: challengeFound }).exec();
    } catch (error) {
      await this.partidaModel.deleteOne({ _id: result._id }).exec();

      throw new InternalServerErrorException();
    }
  }

  async delete(_id: string): Promise<void> {
    const challengeFound = await this.desafioModel.findById(_id).exec();

    if (!challengeFound) throw new NotFoundException(`Desafio ${_id} não cadastrado.`);

    challengeFound.status = DesafioStatus.CANCELADO;

    await this.desafioModel.findOneAndUpdate({ _id }, { $set: challengeFound }).exec();
  }
}
