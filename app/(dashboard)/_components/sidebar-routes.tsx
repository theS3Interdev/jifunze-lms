"use client";

import { usePathname } from "next/navigation";
import { BarChart, Compass, Layout, List } from "lucide-react";

import { SidebarItem } from "@/app/(dashboard)/_components/sidebar-item";

const guestRoutes = [
	{
		icon: Layout,
		label: "Dashboard",
		href: "/",
	},
	{
		icon: Compass,
		label: "Browse",
		href: "/search",
	},
];

const instructorRoutes = [
	{
		icon: List,
		label: "Courses",
		href: "/instructor/courses",
	},
	{
		icon: BarChart,
		label: "Analytics",
		href: "/instructor/analytics",
	},
];

export const SidebarRoutes = () => {
	const pathname = usePathname();

	const isInstructorPage = pathname?.includes("/instructor");

	const routes = isInstructorPage ? instructorRoutes : guestRoutes;

	return (
		<div className="flex w-full flex-col">
			{routes.map((route) => (
				<SidebarItem
					key={route.href}
					icon={route.icon}
					label={route.label}
					href={route.href}
				/>
			))}
		</div>
	);
};
