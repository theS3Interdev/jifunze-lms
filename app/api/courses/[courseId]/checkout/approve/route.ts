import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";

import { db } from "@/lib/data/db";

export async function POST(req: Request) {
	try {
		const body = await req.json();

		const { order, courseId } = body;

		const user = await currentUser();

		if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
			return new NextResponse("Unauthorized access.", { status: 401 });
		}

		await db.purchase.create({
			data: {
				courseId: courseId,
				userId: user.id,
				orderId: order.orderID,
			},
		});

		return NextResponse.json({ message: "OK" });
	} catch (error) {
		console.log("[PAYPAL_APPROVE_ORDER]", error);
		return new NextResponse("Internal server error.", { status: 500 });
	}
}
