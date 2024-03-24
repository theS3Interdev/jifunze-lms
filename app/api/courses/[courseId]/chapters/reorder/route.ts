import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/data/db";

export async function PUT(req: Request, { params }: { params: { courseId: string } }) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized access.", { status: 401 });
		}

		const { list } = await req.json();

		const ownCourse = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId: userId,
			},
		});

		if (!ownCourse) {
			return new NextResponse("Unauthorized access.", { status: 401 });
		}

		for (let item of list) {
			await db.chapter.update({
				where: { id: item.id },
				data: { position: item.position },
			});
		}

		return new NextResponse("Reorder successful.", { status: 200 });
	} catch (error) {
		console.log("[REORDER_CHAPTERS]", error);
		return new NextResponse("Internal server error.", { status: 500 });
	}
}
