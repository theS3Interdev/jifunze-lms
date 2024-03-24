"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Trash } from "lucide-react";

import { ConfirmModal } from "@/components/modals/confirm-modal";
import { useConfettiStore } from "@/lib/hooks/use-confetti-store";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type CourseActionsProps = {
	disabled: boolean;
	courseId: string;
	isPublished: boolean;
};

export const CourseActions = ({
	disabled,
	courseId,
	isPublished,
}: CourseActionsProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const { toast } = useToast();

	const confetti = useConfettiStore();

	const onClick = async () => {
		try {
			setIsLoading(true);

			if (isPublished) {
				await axios.patch(`/api/courses/${courseId}/unpublish`);

				toast({
					title: "Course unpublished",
					description: "The course has been successfully unpublished.",
					duration: 5000,
					className: "success-toast",
				});
			} else {
				await axios.patch(`/api/courses/${courseId}/publish`);

				toast({
					title: "Course published",
					description: "The course has been published sucessfully.",
					duration: 5000,
					className: "success-toast",
				});

				confetti.onOpen();
			}

			router.refresh();
		} catch {
			toast({
				title: "Something went wrong",
				description: "An unknown error has occurred.",
				duration: 5000,
				className: "error-toast",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const onDelete = async () => {
		try {
			setIsLoading(true);

			await axios.delete(`/api/courses/${courseId}`);

			toast({
				title: "Course deleted",
				description: "The course has been sucessfully deleted.",
				duration: 5000,
				className: "success-toast",
			});

			router.refresh();

			router.push(`/instructor/courses`);
		} catch {
			toast({
				title: "Something went wrong",
				description: "An unknown error has occurred.",
				duration: 5000,
				className: "error-toast",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center gap-x-2">
			<Button
				onClick={onClick}
				disabled={disabled || isLoading}
				variant="outline"
				size="sm"
			>
				{isPublished ? "Unpublish" : "Publish"}
			</Button>

			<ConfirmModal onConfirm={onDelete}>
				<Button size="sm" disabled={isLoading}>
					<Trash className="h-4 w-4" />
				</Button>
			</ConfirmModal>
		</div>
	);
};
