import * as mongoose from 'mongoose';

const CategoriaSchema = new mongoose.Schema(
  {
    categoria: { type: String, unique: true },
    descricao: { type: String },
    eventos: [
      {
        nome: String,
        operacao: String,
        valor: Number,
      },
    ],
    jogadores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Jogador',
      },
    ],
  },
  { timestamps: true, collection: 'categorias' },
);

export { CategoriaSchema };
