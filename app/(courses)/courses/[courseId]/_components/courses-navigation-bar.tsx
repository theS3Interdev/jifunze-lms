import { Chapter, Course, UserProgress } from "@prisma/client";

import { NavigationBarRoutes } from "@/components/navigation-bar-routes";

import { CoursesMobileSidebar } from "./courses-mobile-sidebar";

type CoursesNavigationBarProps = {
	course: Course & {
		chapters: (Chapter & {
			userProgress: UserProgress[] | null;
		})[];
	};
	progressCount: number;
};

export const CoursesNavigationBar = ({
	course,
	progressCount,
}: CoursesNavigationBarProps) => {
	return (
		<div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
			<CoursesMobileSidebar course={course} progressCount={progressCount} />

			<NavigationBarRoutes />
		</div>
	);
};
