import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/data/db";

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string; attachmentId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized access.", { status: 401 });
		}

		const courseOwner = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId: userId,
			},
		});

		if (!courseOwner) {
			return new NextResponse("Unauthorized access.", { status: 401 });
		}

		const attachment = await db.attachment.delete({
			where: {
				courseId: params.courseId,
				id: params.attachmentId,
			},
		});

		return NextResponse.json(attachment);
	} catch (error) {
		console.log("[DELETE_ATTACHMENT]", error);
		return new NextResponse("Internal server error.", { status: 500 });
	}
}
