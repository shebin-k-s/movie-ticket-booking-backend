import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Unique } from "typeorm";
import { Theater } from "./theater.entity";


@Entity('halls')
@Unique(["theater", "name"])
export class Hall {
    @PrimaryGeneratedColumn("uuid", { name: 'hall_id' })
    hallId: string;

    @Column()
    name: string;

    @Column({
        name: 'seat_map',
        type: "json"
    })
    seatMap: any;

    @ManyToOne(() => Theater)
    @JoinColumn({ name: 'theater_id' })
    theater: Theater;

}
