import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";
import paypal from "@paypal/checkout-server-sdk";

import { db } from "@/lib/data/db";

import paypalClient from "@/lib/paypal";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
	const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

	try {
		const client = paypalClient();

		const user = await currentUser();

		if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
			return new NextResponse("Unauthorized access.", { status: 401 });
		}

		const course = await db.course.findUnique({
			where: {
				id: params.courseId,
				isPublished: true,
			},
		});

		const purchase = await db.purchase.findUnique({
			where: {
				userId_courseId: {
					userId: user.id,
					courseId: params.courseId,
				},
			},
		});

		if (purchase) {
			return new NextResponse("Already purchased the course.", { status: 400 });
		}

		if (!course) {
			return new NextResponse("Course not found.", { status: 404 });
		}

		let paymentCustomer = await db.paymentCustomer.findUnique({
			where: {
				userId: user.id,
			},
			select: {
				userEmail: true,
			},
		});

		if (!paymentCustomer) {
			paymentCustomer = await db.paymentCustomer.create({
				data: {
					userId: user.id,
					userEmail: user.emailAddresses?.[0]?.emailAddress,
				},
			});
		}

		const orderRequest = new paypal.orders.OrdersCreateRequest();

		orderRequest.requestBody({
			intent: "CAPTURE",
			purchase_units: [
				{
					amount: {
						currency_code: "USD",
						value: course.price!.toString(),
					},
				},
			],
			application_context: {
				return_url: appUrl + `/courses/${course.id}/?success=1`,
				cancel_url: appUrl + `/courses/${course.id}/?cancelled=1`,
				shipping_preference: "NO_SHIPPING",
				user_action: "PAY_NOW",
				brand_name: "Jifunze Learning Platform",
			},
		});

		const orderResponse = await client.execute(orderRequest);

		console.log("Order ID:", orderResponse.result?.id);

		return NextResponse.json({ id: orderResponse.result?.id });
	} catch (error) {
		console.log("[PAYPAL_CREATE_ORDER]", error);
		return new NextResponse("Internal server error.", { status: 500 });
	}
}
