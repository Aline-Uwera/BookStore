import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  HttpStatus,
  HttpException,
  Res,
  UnprocessableEntityException,
  ParseIntPipe,
  NotFoundException,
  ValidationPipe,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Response } from 'express';
import { UserIdQuery } from './dto/user-id-query.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
    @Res() res: Response,
  ) {
    try {
      const existingCustomer = await this.customersService.findByUserId(
        createCustomerDto.userId,
      );
      if (existingCustomer) {
        throw new UnprocessableEntityException(
          'This user ID already exists in the system.',
        );
      }
      const customer = await this.customersService.create(createCustomerDto);
      res
        .status(HttpStatus.CREATED)
        .location(`/customers/${customer.id}`)
        .json(customer);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          { message: 'Illegal, missing, or malformed input' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  @Get(':id')
  async getCustomerById(@Param('id', new ParseIntPipe()) id: number) {
    const customer = await this.customersService.getCustomerById(id);

    if (!customer) {
      throw new NotFoundException('ID does not exist in the system');
    }
    return customer;
  }

  @Get()
  async getCustomerByUserId(@Query(ValidationPipe) userIdQuery: UserIdQuery) {
    const customer = await this.customersService.findByUserId(
      userIdQuery.userId,
    );

    if (!customer) {
      throw new NotFoundException('User-ID does not exist in the system');
    }
    return customer;
  }
}
