import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";

import { db } from "@/lib/data/db";

import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";

import { CourseActions } from "./_components/course-actions";
import { CourseAttachmentForm } from "./_components/course-attachment-form";
import { CourseCategoryForm } from "./_components/course-category-form";
import { CourseChapterForm } from "./_components/course-chapter-form";
import { CourseDescriptionForm } from "./_components/course-description-form";
import { CourseImageForm } from "./_components/course-image-form";
import { CoursePriceForm } from "./_components/course-price-form";
import { CourseTitleForm } from "./_components/course-title-form";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
	const { userId } = auth();

	if (!userId) {
		redirect("/");
	}

	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
			userId,
		},
		include: {
			attachments: {
				orderBy: {
					createdAt: "desc",
				},
			},
			chapters: {
				orderBy: {
					position: "asc",
				},
			},
		},
	});

	const categories = await db.category.findMany({
		orderBy: {
			name: "asc",
		},
	});

	if (!course) {
		redirect("/");
	}

	const requiredFields = [
		course.title,
		course.description,
		course.imageUrl,
		course.price,
		course.categoryId,
		course.chapters.some((chapter) => chapter.isPublished),
	];

	const totalFields = requiredFields.length;

	const completedFields = requiredFields.filter(Boolean).length;

	const completionText = `(${completedFields}/${totalFields})`;

	const isComplete = requiredFields.every(Boolean);

	return (
		<>
			{!course.isPublished && (
				<Banner label="This course has not been published. It will not be available for enrollment." />
			)}

			<div className="p-6">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-y-2">
						<h1 className="text-2xl font-medium">Course setup</h1>

						<span className="text-sm text-slate-700">
							Complete all fields {completionText}
						</span>
					</div>

					<CourseActions
						disabled={!isComplete}
						courseId={params.courseId}
						isPublished={course.isPublished}
					/>
				</div>

				<div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<div className="flex items-center gap-x-2">
							<IconBadge icon={LayoutDashboard} />

							<h2 className="text-xl">Customize your course</h2>
						</div>

						<CourseTitleForm initialData={course} courseId={course.id} />

						<CourseDescriptionForm initialData={course} courseId={course.id} />

						<CourseImageForm initialData={course} courseId={course.id} />

						<CourseCategoryForm
							initialData={course}
							courseId={course.id}
							options={categories.map((category) => ({
								label: category.name,
								value: category.id,
							}))}
						/>
					</div>

					<div className="space-y-6">
						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={ListChecks} />

								<h2 className="text-xl">Course chapters</h2>
							</div>

							<CourseChapterForm initialData={course} courseId={course.id} />
						</div>

						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={CircleDollarSign} />

								<h2 className="text-xl">Sell your course</h2>
							</div>

							<CoursePriceForm initialData={course} courseId={course.id} />
						</div>

						<div>
							<div className="flex items-center gap-x-2">
								<IconBadge icon={File} />

								<h2 className="text-xl">Resources and attachments</h2>
							</div>

							<CourseAttachmentForm initialData={course} courseId={course.id} />
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default CoursePage;
