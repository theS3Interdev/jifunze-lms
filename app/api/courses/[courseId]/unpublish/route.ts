import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/data/db";

export async function PATCH(req: Request, { params }: { params: { courseId: string } }) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized access.", { status: 401 });
		}

		const course = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId,
			},
		});

		if (!course) {
			return new NextResponse("Course not found.", { status: 404 });
		}

		const unpublishedCourse = await db.course.update({
			where: {
				id: params.courseId,
				userId,
			},
			data: {
				isPublished: false,
			},
		});

		return NextResponse.json(unpublishedCourse);
	} catch (error) {
		console.log("[UNPUBLISH_COURSE]", error);
		return new NextResponse("Internal server error.", { status: 500 });
	}
}
