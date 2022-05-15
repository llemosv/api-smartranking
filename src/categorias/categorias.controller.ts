import { Body, Controller, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';

import { CategoriasService } from './categorias.service';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.to';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Categoria } from './interfaces/categoria.interface';

@Controller('api/v1/categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Post('create')
  @UsePipes(ValidationPipe)
  async createCategory(@Body() criarCategoriaDto: CriarCategoriaDto): Promise<Categoria> {
    const category = await this.categoriasService.create(criarCategoriaDto);
    return category;
  }

  @Put('update/:categoria')
  @UsePipes(ValidationPipe)
  async updateCategory(
    @Body() atualizarCategoriaDto: AtualizarCategoriaDto,
    @Param('categoria') categoria: string,
  ): Promise<void> {
    await this.categoriasService.update(categoria, atualizarCategoriaDto);
  }

  @Get('list')
  async getAllCategories(): Promise<Categoria[]> {
    const categories = await this.categoriasService.getAll();
    return categories;
  }

  @Get('listCategoryByName/:categoria')
  async getCategoryByName(@Param('categoria') categoria: string): Promise<Categoria> {
    const formatter = categoria.toUpperCase();

    const searchCategory = await this.categoriasService.getByName(formatter);

    return searchCategory;
  }

  @Post('assignCategoryPlayer/:categoria/jogadores/:idJogador')
  async assignCategoryPlayer(@Param() params: string[]): Promise<void> {
    await this.categoriasService.assignCategory(params);
  }
}
