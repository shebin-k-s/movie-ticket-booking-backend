import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn, ManyToMany, JoinTable } from "typeorm";
import { User } from "./user.entity";
import { Show } from "./show.entity";
import { Seat } from "./seat.entity";

export enum paymentStatus {
    PENDING = 'pending',
    FAILED = 'failed',
    SUCCESS = 'success'
}

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn("uuid", { name: 'booking_id' })
    bookingId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Show)
    @JoinColumn({ name: 'show_id' })
    show: Show;

    @ManyToMany(() => Seat, { eager: true })
    @JoinTable({
        name: "booking_seats",
        joinColumn: { name: "booking_id", referencedColumnName: "bookingId" },
        inverseJoinColumn: { name: "seat_id", referencedColumnName: "seatId" },
    }) seats: Seat[];

    @Column({
        name: 'payment_status',
        enum: paymentStatus,
        default: paymentStatus.PENDING
    })
    paymentStatus: paymentStatus;

    @Column({ name: 'total_amount',default:0 })
    totalAmount: number;

    @Column({
        type: "timestamp",
        nullable: true
    })
    confirmedAt: Date | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;


}
