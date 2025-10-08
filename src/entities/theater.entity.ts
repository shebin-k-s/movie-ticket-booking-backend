import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user.entity";


@Entity('theaters')
export class Theater {
  @PrimaryGeneratedColumn("uuid", { name: 'theater_id' })
  theaterId: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column({})
  city: string;

  @Column({})
  state: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'managed_by' })
  managedBy: User

}
