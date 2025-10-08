import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { Hall } from "./hall.entity";
import { Movie } from "./movie.entity";
import { Seat } from "./seat.entity";

@Entity('shows')
export class Show {
    @PrimaryGeneratedColumn("uuid", { name: 'show_id' })
    showId: string;

    @ManyToOne(() => Hall)
    @JoinColumn({ 'name': 'hall_id' })
    hall: Hall;

    @ManyToOne(() => Movie,)
    @JoinColumn({ name: 'movie_id' })
    movie: Movie;

    @Column({ name: 'start_time', type: "timestamp" })
    startTime: Date;

    @Column({ name: 'base_price' })
    basePrice: number;

}
