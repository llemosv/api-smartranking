import { Model } from 'mongoose';
import { JogadoresService } from 'src/modules/jogadores/jogadores.service';

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.to';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Injectable()
export class CategoriasService {
  constructor(
    @InjectModel('Categoria') private readonly categoriaModel: Model<Categoria>,
    private readonly jogadoresService: JogadoresService,
  ) {}

  async create(criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
    const { categoria } = criarCategoriaDto;

    const categoryExists = await this.categoriaModel.findOne({ categoria }).exec();

    if (categoryExists) {
      throw new BadRequestException(`A categoria ${categoria} já existe na nossa base de dados.`);
    }

    const createdCategory = new this.categoriaModel(criarCategoriaDto);

    const saveCategory = await createdCategory.save();

    return saveCategory;
  }

  async update(categoria: string, atualizarCategoriaDto: AtualizarCategoriaDto): Promise<void> {
    const categoryExists = await this.categoriaModel.findOne({ categoria }).exec();

    if (!categoryExists) {
      throw new NotFoundException(`A categoria ${categoria.toUpperCase()} não foi encontrado na nossa base de dados.`);
    }

    await this.categoriaModel.findOneAndUpdate({ categoria }, { $set: atualizarCategoriaDto }).exec();
  }

  async getAll(): Promise<Categoria[]> {
    const categories = await this.categoriaModel.find().populate('jogadores').exec();
    return categories;
  }

  async getByName(categoria: string): Promise<Categoria> {
    const category = await this.categoriaModel.findOne({ categoria }).exec();

    if (!category) {
      throw new NotFoundException(`A categoria ${categoria} não foi encontrada.`);
    }

    return category;
  }

  async assignCategory(params: string[]): Promise<void> {
    // eslint-disable-next-line dot-notation
    const categoria = params['categoria'];
    const idJogador = params['idJogador'];

    await this.jogadoresService.getById(idJogador);

    const categoryExists = await this.categoriaModel.findOne({ categoria }).exec();
    const playerAlreadyRegistered = await this.categoriaModel
      .find({ categoria })
      .where('jogadores')
      .in(idJogador)
      .exec();

    if (!categoryExists) {
      throw new NotFoundException(`A categoria ${categoria} não foi encontrado na nossa base de dados.`);
    }
    if (playerAlreadyRegistered.length > 0) {
      throw new BadRequestException(`Jogador com o id ${idJogador} já está cadastrado na categoria ${categoria}.`);
    }

    categoryExists.jogadores.push(idJogador);
    await this.categoriaModel.findOneAndUpdate({ categoria }, { $set: categoryExists }).exec();
  }

  async getCategoryPlayer(_id: any): Promise<Categoria> {
    await this.jogadoresService.getById(_id);

    const playerCategory = await this.categoriaModel.findOne().where('jogadores').in(_id).exec();

    return playerCategory;
  }
}
