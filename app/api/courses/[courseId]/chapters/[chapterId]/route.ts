import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/data/db";

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } },
) {
	try {
		const { userId } = auth();

		const { isPublished, ...values } = await req.json();

		if (!userId) {
			return new NextResponse("Unauthorized access.", { status: 401 });
		}

		const ownCourse = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId,
			},
		});

		if (!ownCourse) {
			return new NextResponse("Unauthorized access.", { status: 401 });
		}

		const chapter = await db.chapter.update({
			where: {
				id: params.chapterId,
				courseId: params.courseId,
			},
			data: {
				...values,
			},
		});

		if (values.videoUrl) {
			const existingCloudinaryData = await db.cloudinaryData.findFirst({
				where: {
					chapterId: params.chapterId,
				},
			});

			if (existingCloudinaryData) {
				await db.cloudinaryData.delete({
					where: {
						id: existingCloudinaryData.id,
					},
				});
			}

			await db.cloudinaryData.create({
				data: {
					chapterId: params.chapterId,
					playbackId: values.playbackId,
					publicId: values.publicId,
					secureUrl: values.videoUrl,
				},
			});
		}

		return NextResponse.json(chapter);
	} catch (error) {
		console.log("[PATCH_CHAPTER]", error);
		return new NextResponse("Internal server error.", { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse("Unauthorized access.", { status: 401 });
		}

		const ownCourse = await db.course.findUnique({
			where: {
				id: params.courseId,
				userId,
			},
		});

		if (!ownCourse) {
			return new NextResponse("Unauthorized access.", { status: 401 });
		}

		const chapter = await db.chapter.findUnique({
			where: {
				id: params.chapterId,
				courseId: params.courseId,
			},
		});

		if (!chapter) {
			return new NextResponse("Chapter not found.", { status: 404 });
		}

		if (chapter.videoUrl) {
			const existingCloudinaryData = await db.cloudinaryData.findFirst({
				where: {
					chapterId: params.chapterId,
				},
			});

			if (existingCloudinaryData) {
				await db.cloudinaryData.delete({
					where: {
						id: existingCloudinaryData.id,
					},
				});
			}
		}

		const deletedChapter = await db.chapter.delete({
			where: {
				id: params.chapterId,
			},
		});

		const publishedChaptersInCourse = await db.chapter.findMany({
			where: {
				courseId: params.courseId,
				isPublished: true,
			},
		});

		if (!publishedChaptersInCourse.length) {
			await db.course.update({
				where: {
					id: params.courseId,
				},
				data: {
					isPublished: false,
				},
			});
		}

		return NextResponse.json(deletedChapter);
	} catch (error) {
		console.log("[DELETE_CHAPTER]", error);
		return new NextResponse("Internal server error.", { status: 500 });
	}
}
