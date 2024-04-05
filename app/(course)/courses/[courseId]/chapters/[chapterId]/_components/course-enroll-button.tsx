"use client";

import axios from "axios";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

import { formatPrice } from "@/lib/format";

import { useToast } from "@/components/ui/use-toast";

type CourseEnrollButtonProps = {
	price: number;
	courseId: string;
};

export const CourseEnrollButton = ({ price, courseId }: CourseEnrollButtonProps) => {
	const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;

	const { toast } = useToast();

	const createOrder = async () => {
		try {
			const response = await axios.post(`/api/courses/${courseId}/checkout/orders`);

			const orderId = await response.data.id;

			return orderId;
		} catch (error) {
			toast({
				title: "Something went wrong",
				description: "Error: " + error,
				duration: 5000,
				className: "error-toast",
			});
		}
	};

	const onApproveOrder = async (order: any) => {
		try {
			const response = await axios.post(
				`/api/courses/${courseId}/checkout/approve`,
				{
					order,
					courseId,
				},
				{ headers: { "Content-Type": "application/json" } },
			);

			const approval = await response.data.message;

			console.log("Approval data: ", approval);

			toast({
				title: "Enrollment successful",
				description: "Your enrollment was completed successfully.",
				duration: 5000,
				className: "success-toast",
			});
		} catch (error) {
			toast({
				title: "Something went wrong",
				description: "Error: " + error,
				duration: 5000,
				className: "error-toast",
			});
		}
	};

	return (
		<section className="flex flex-col gap-2">
			<p className="text-center text-sm font-semibold">
				Enroll for {formatPrice(price)}
			</p>

			<PayPalScriptProvider options={{ clientId: paypalClientId }}>
				<PayPalButtons
					style={{
						color: "gold",
						layout: "horizontal",
						tagline: true,
						height: 34,
						label: "paypal",
					}}
					createOrder={createOrder}
					onApprove={onApproveOrder}
				/>
			</PayPalScriptProvider>
		</section>
	);
};
