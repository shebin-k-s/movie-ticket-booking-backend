import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, Unique } from "typeorm";
import { Theater } from "./theater.entity";


@Entity('screens')
@Unique(["theater", "name"])
export class Screen {
    @PrimaryGeneratedColumn("uuid", { name: 'screen_id' })
    screenId: string;

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
