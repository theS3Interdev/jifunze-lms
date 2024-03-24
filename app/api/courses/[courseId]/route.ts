import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/data/db";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
	try {
		const { userId } = auth();

		const { courseId } = params;

		const values = await req.json();

		if (!userId) {
			return new NextResponse("Unauthorized access.", { status: 401 });
		}

		const course = await db.course.update({
			where: {
				id: courseId,
				userId,
			},
			data: {
				...values,
			},
		});

		return NextResponse.json(course);
	} catch (error) {
		console.log("[UPDATE_COURSE]", error);
		return new NextResponse("Internal server error.", { status: 500 });
	}
}
