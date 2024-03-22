import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}
  async create(createCustomerDto: CreateCustomerDto) {
    const customer = this.customerRepository.create(createCustomerDto);
    const newCustomer = await this.customerRepository.save(customer);
    return newCustomer;
  }
  async findByUserId(userId: string): Promise<Customer | undefined> {
    const customer = await this.customerRepository.findOne({
      where: { userId },
    });
    return customer;
  }

  async getCustomerById(id: number): Promise<Customer | undefined> {
    const customer = await this.customerRepository.findOne({
      where: { id },
    });
    return customer;
  }

}
