import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { async } from 'rxjs';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel:Model<Pokemon>)
  {

  }

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      const pokemon= await this.pokemonModel.create(CreatePokemonDto);
      return pokemon;
    } catch (error) {
      if (error.code=== 11000) {
        throw new BadRequestException("Pokemon exist in bd ");
      }
      console.log(error);
      throw new InternalServerErrorException("Can't create pokemon xxx");  
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term:string) {
    let pokemon:Pokemon;
    if (!isNaN(+term)) {
      await this.pokemonModel.findOne({no:term});
    }

    if (!pokemon && isValidObjectId(term)) {
      await this.pokemonModel.findById({term});
    }
  
    if (!pokemon) {
      await this.pokemonModel.findOne({name:term});
    }

    if (!pokemon) {
      throw new NotFoundException("Pokemon  not found");
    }
    return pokemon;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
