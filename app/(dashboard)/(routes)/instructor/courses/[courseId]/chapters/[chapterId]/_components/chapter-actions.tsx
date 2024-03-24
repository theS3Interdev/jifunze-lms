"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Trash } from "lucide-react";

import { ConfirmModal } from "@/components/modals/confirm-modal";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type ChapterActionsProps = {
	disabled: boolean;
	courseId: string;
	chapterId: string;
	isPublished: boolean;
};

export const ChapterActions = ({
	disabled,
	courseId,
	chapterId,
	isPublished,
}: ChapterActionsProps) => {
	const [isLoading, setIsLoading] = useState(false);

	const router = useRouter();

	const { toast } = useToast();

	const onClick = async () => {
		try {
			setIsLoading(true);

			if (isPublished) {
				await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/unpublish`);

				toast({
					title: "Chapter unpublished",
					description: "The chapter has been successfully unpublished.",
					duration: 5000,
					className: "success-toast",
				});
			} else {
				await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/publish`);

				toast({
					title: "Chapter published",
					description: "The chapter has been published successfully.",
					duration: 5000,
					className: "success-toast",
				});
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

			await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`);

			toast({
				title: "Chapter deleted",
				description: "The chapter has been successfully deleted.",
				duration: 5000,
				className: "success-toast",
			});

			router.refresh();

			router.push(`/instructor/courses/${courseId}`);
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
