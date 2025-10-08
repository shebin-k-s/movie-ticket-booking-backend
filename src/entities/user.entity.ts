import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Theater } from './theater.entity';

export enum UserRole {
    USER = "user",
    THEATER_ADMIN = "theater_admin",
    ADMIN = "admin"
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
    userId: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole;

    @OneToOne(() => Theater, { nullable: true })
    @JoinColumn({ name: 'theater_id' })
    theater: Theater

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
