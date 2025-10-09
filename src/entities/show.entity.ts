import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Screen } from "./screen.entity";
import { Movie } from "./movie.entity";

@Entity('shows')
export class Show {
    @PrimaryGeneratedColumn("uuid", { name: 'show_id' })
    showId: string;

    @ManyToOne(() => Screen, { eager: true })
    @JoinColumn({ name: 'screen_id' })
    screen: Screen;

    @ManyToOne(() => Movie, { eager: true })
    @JoinColumn({ name: 'movie_id' })
    movie: Movie;

    @Column({ name: 'start_time', type: "timestamp" })
    startTime: Date;

    @Column({ name: 'base_price', type: "decimal", precision: 10, scale: 2 })
    basePrice: number;
}
