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
			include: {
				chapters: {
					include: {
						cloudinaryData: true,
					},
				},
			},
		});

		if (!course) {
			return new NextResponse("Course not found.", { status: 404 });
		}

		const hasPublishedChapter = course.chapters.some((chapter) => chapter.isPublished);

		if (
			!course.title ||
			!course.description ||
			!course.imageUrl ||
			!course.categoryId ||
			!hasPublishedChapter
		) {
			return new NextResponse("Required field(s) missing.", { status: 401 });
		}

		const publishedCourse = await db.course.update({
			where: {
				id: params.courseId,
				userId,
			},
			data: {
				isPublished: true,
			},
		});

		return NextResponse.json(publishedCourse);
	} catch (error) {
		console.log("[PUBLISH_COURSE]", error);
		return new NextResponse("Internal server error.", { status: 500 });
	}
}
