import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
  private coffees: Coffee[] = [
    {
      id: 1,
      name: 'Cappuccino',
      brand: 'Starbucks',
      flavors: ['vanilla', 'caramel'],
    },
  ];
  findAll() {
    return this.coffees;
  }
  findOne(id: number) {
    const coffee = this.coffees.find((coffee) => coffee.id === +id);
    if (!coffee) {
      throw new HttpException('Coffee not found', HttpStatus.NOT_FOUND);
    }
    return coffee;
  }
  create(coffee: CreateCoffeeDto) {
    return 'created';
  }
  update(id: string, UpdateCoffeeDto: UpdateCoffeeDto) {
    this.coffees[id] = UpdateCoffeeDto;
  }
  delete(id: number) {
    return this.coffees.splice(id, 1);
  }
}
