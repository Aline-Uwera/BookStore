import {
  Controller,
  Get,
  Post,
  Body,Query,
  Param,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Response } from 'express';


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
        return res
          .status(HttpStatus.UNPROCESSABLE_ENTITY)
          .json({ message: 'This user ID already exists in the system.' });
      }
      const customer = await this.customersService.create(createCustomerDto);
      return res
        .status(HttpStatus.CREATED)
        .location(`/customers/${customer.id}`)
        .json({ id: customer.id, ...createCustomerDto });
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
  async getCustomerById(@Param('id') id: string, @Res() res: Response) {
    try {
      const customer = await this.customersService.getCustomerById(
        parseInt(id, 10),
      );

      if (!customer) {
        throw new HttpException(
          { message: 'ID does not exist in the system' },
          HttpStatus.NOT_FOUND,
        );
      }
      return res.status(HttpStatus.OK).json(customer);
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

  @Get()
  async getCustomerByUserId(
    @Query('userId') userId: string,
    @Res() res: Response,
  ) {
    try {
      const decodedUserId = decodeURIComponent(userId);

      if (!userId) {
        throw new HttpException(
          { message: 'User-ID is required' },
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validating email format using a regular expression
      if (!/\S+@\S+\.\S+/.test(decodedUserId)) {
        throw new HttpException(
          { message: 'Invalid email format' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const customer = await this.customersService.findByUserId(decodedUserId);

      if (!customer) {
        throw new HttpException(
          { message: 'User-ID does not exist in the system' },
          HttpStatus.NOT_FOUND,
        );
      }

      return res.status(HttpStatus.OK).json(customer);
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
}
