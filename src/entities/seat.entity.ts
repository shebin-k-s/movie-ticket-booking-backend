import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Show } from "./show.entity";

export enum SeatStatus {
    AVAILABLE = "AVAILABLE",
    BOOKED = "BOOKED"
}

@Entity('seats')
export class Seat {
    @PrimaryGeneratedColumn("uuid",{name:'seat_id'})
    seatId: string;

    @ManyToOne(() => Show)
    @JoinColumn({ name: 'show_id' })
    show: Show;

    @Column()
    row: string;

    @Column()
    number: number;

    @Column({
        type: "enum",
        enum: SeatStatus,
        default: SeatStatus.AVAILABLE
    })
    status: SeatStatus;

    @Column({ type: "int", name: 'position_x' })
    positionX: number;

    @Column({ type: "int", name: 'position_y' })
    positionY: number;


    @Column()
    type: string;

    @Column()
    price: number;
}
