// customer.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true})
  userId: string;

  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  address2?: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipcode: string;
}
