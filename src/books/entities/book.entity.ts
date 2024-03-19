import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Book {
  @PrimaryColumn({unique: true})
  ISBN: string;

  @Column()
  title: string;

  @Column()
  Author: string;

  @Column()
  description: string;

  @Column()
  genre: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  quantity: number;
}