import { razorpay } from "../config/razorpay.config"
import crypto from "crypto";


export class PaymentService {


    static createOrder = async (bookingId: string, amount: number) => {

        const hash = crypto.createHash("sha1").update(bookingId).digest("hex").slice(20);
        const receipt = `bk_${hash}`;

        return await razorpay.orders.create({
            amount: (amount * 100),
            currency: "INR",
            receipt: receipt,
            notes: { bookingId }
        })

    }


    static verifyPaymentSignature = (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) => {

        const body = `${razorpayOrderId}|${razorpayPaymentId}`;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(JSON.stringify(body))
            .digest("hex")


        return expectedSignature === razorpaySignature;

    }

    static verifyWebhookSignature = (body: any, signature: string) => {
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
            .update(JSON.stringify(body))
            .digest("hex");

        return expectedSignature === signature;
    }


}