import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge";

type InformationCardProps = {
	numberOfItems: number;
	variant?: "default" | "success";
	label: string;
	icon: LucideIcon;
};

export const InformationCard = ({
	variant,
	icon: Icon,
	numberOfItems,
	label,
}: InformationCardProps) => {
	return (
		<div className="flex items-center gap-x-2 rounded-md border p-3">
			<IconBadge variant={variant} icon={Icon} />

			<div>
				<p className="font-medium">{label}</p>

				<p className="text-sm text-gray-500">
					{numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
				</p>
			</div>
		</div>
	);
};
