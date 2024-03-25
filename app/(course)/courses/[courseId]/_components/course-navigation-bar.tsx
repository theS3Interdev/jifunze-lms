import { Chapter, Course, UserProgress } from "@prisma/client";

import { NavigationBarRoutes } from "@/components/navigation-bar-routes";

import { CourseMobileSidebar } from "./course-mobile-sidebar";

type CourseNavigationBarProps = {
	course: Course & {
		chapters: (Chapter & {
			userProgress: UserProgress[] | null;
		})[];
	};
	progressCount: number;
};

export const CourseNavigationBar = ({
	course,
	progressCount,
}: CourseNavigationBarProps) => {
	return (
		<div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
			<CourseMobileSidebar course={course} progressCount={progressCount} />

			<NavigationBarRoutes />
		</div>
	);
};
