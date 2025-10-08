import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity('movies')
export class Movie {
    @PrimaryGeneratedColumn("uuid", { name: 'movie_id' })
    movieId: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    genre: string;

    @Column({ type: "date" })
    releaseDate: Date;

    @Column()
    duration: number;

    @Column({ type: 'numeric', nullable: true })
    rating: number;

    @Column({ type: "text", nullable: true })
    description: string;

    @Column({ name: 'poster_url', nullable: true })
    posterUrl: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
