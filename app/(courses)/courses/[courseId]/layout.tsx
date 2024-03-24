import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/data/db";
import { getProgress } from "@/lib/actions/get-progress";

import { CoursesNavigationBar } from "./_components/courses-navigation-bar";
import { CoursesSidebar } from "./_components/courses-sidebar";

const CoursesLayout = async ({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { courseId: string };
}) => {
	const { userId } = auth();

	if (!userId) {
		return redirect("/");
	}

	const course = await db.course.findUnique({
		where: {
			id: params.courseId,
		},
		include: {
			chapters: {
				where: {
					isPublished: true,
				},
				include: {
					userProgress: {
						where: {
							userId,
						},
					},
				},
				orderBy: {
					position: "asc",
				},
			},
		},
	});

	if (!course) {
		return redirect("/");
	}

	const progressCount = await getProgress(userId, course.id);

	return (
		<div className="h-full">
			<div className="fixed inset-y-0 z-50 h-[80px] w-full md:pl-80">
				<CoursesNavigationBar course={course} progressCount={progressCount} />
			</div>

			<div className="fixed inset-y-0 z-50 hidden h-full w-80 flex-col md:flex">
				<CoursesSidebar course={course} progressCount={progressCount} />
			</div>

			<main className="h-full pt-[80px] md:pl-80">{children}</main>
		</div>
	);
};

export default CoursesLayout;
