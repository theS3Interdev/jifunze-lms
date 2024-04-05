import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";
import { CheckCircle, Clock } from "lucide-react";

import { getDashboardCourses } from "@/lib/actions/get-dashboard-courses";

import { CoursesList } from "@/components/courses-list";
import { InformationCard } from "./_components/information-card";

const HomePage = async () => {
	const { userId } = auth();

	if (!userId) {
		return redirect("/");
	}

	const { completedCourses, coursesInProgress } = await getDashboardCourses(userId);

	return (
		<div className="space-y-4 p-6">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<InformationCard
					icon={Clock}
					label="In Progress"
					numberOfItems={coursesInProgress.length}
				/>

				<InformationCard
					icon={CheckCircle}
					label="Completed"
					numberOfItems={completedCourses.length}
					variant="success"
				/>
			</div>

			<CoursesList items={[...coursesInProgress, ...completedCourses]} />
		</div>
	);
};

export default HomePage;
