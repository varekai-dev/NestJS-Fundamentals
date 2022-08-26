import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
  ) {}

  async findAll(paginationQuery: PaginationQueryDto) {
    return this.coffeeRepository.find({
      skip: paginationQuery.offset,
      take: paginationQuery.limit,
      relations: ['flavors'],
    });
  }
  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id: +id },
      relations: ['flavors'],
    });
    if (!coffee) {
      throw new HttpException('Coffee not found', HttpStatus.NOT_FOUND);
    }
    return coffee;
  }
  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }
  async update(id: string, UpdateCoffeeDto: UpdateCoffeeDto) {
    const flavors = await Promise.all(
      UpdateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );

    const coffee = await this.coffeeRepository.preload({
      id: +id,
      ...UpdateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new HttpException('Coffee not found', HttpStatus.NOT_FOUND);
    }
    return this.coffeeRepository.save(coffee);
  }
  async remove(id: string) {
    const coffee = await this.coffeeRepository.findOneBy({ id: +id });
    return this.coffeeRepository.remove(coffee);
  }
  private async preloadFlavorByName(name: string): Promise<Flavor> {
    const flavor = await this.flavorRepository.findOneBy({ name });
    if (flavor) {
      return flavor;
    }
    return this.flavorRepository.create({ name });
  }
}
