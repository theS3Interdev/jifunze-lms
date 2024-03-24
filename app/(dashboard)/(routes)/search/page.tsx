import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { db } from "@/lib/data/db";

import { getCourses } from "@/lib/actions/get-courses";

import { SearchInput } from "@/components/search-input";
import { CourseList } from "@/components/course-list";
import { Categories } from "./_components/categories";

type SearchPageProps = {
	searchParams: {
		title: string;
		categoryId: string;
	};
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
	const { userId } = auth();

	if (!userId) {
		return redirect("/");
	}

	const categories = await db.category.findMany({
		orderBy: {
			name: "asc",
		},
	});

	const courses = await getCourses({
		userId,
		...searchParams,
	});

	return (
		<>
			<div className="block px-6 pt-6 md:mb-0 md:hidden">
				<SearchInput />
			</div>

			<div className="space-y-4 p-6">
				<Categories items={categories} />

				<CourseList items={courses} />
			</div>
		</>
	);
};

export default SearchPage;
