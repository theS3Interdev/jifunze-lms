"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CldVideoPlayer } from "next-cloudinary";
import { Loader2, Lock } from "lucide-react";

import { cn } from "@/lib/utils";

import { useConfettiStore } from "@/lib/hooks/use-confetti-store";

import { useToast } from "@/components/ui/use-toast";

import "next-cloudinary/dist/cld-video-player.css";

type VideoPlayerProps = {
	playbackId: string;
	publicId: string;
	courseId: string;
	chapterId: string;
	nextChapterId?: string;
	isLocked: boolean;
	completeOnEnd: boolean;
};

export const CourseVideoPlayer = ({
	playbackId,
	publicId,
	courseId,
	chapterId,
	nextChapterId,
	isLocked,
	completeOnEnd,
}: VideoPlayerProps) => {
	const [isReady, setIsReady] = useState(false);

	const router = useRouter();

	const { toast } = useToast();

	const confetti = useConfettiStore();

	const onEnd = async () => {
		try {
			if (completeOnEnd) {
				await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
					isCompleted: true,
				});

				if (!nextChapterId) {
					confetti.onOpen();
				}

				toast({
					title: "Progress updated",
					description: "Your progress has been updated successfully.",
					duration: 5000,
					className: "success-toast",
				});

				router.refresh();

				if (nextChapterId) {
					router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
				}
			}
		} catch {
			toast({
				title: "Something went wrong",
				description: "An unknown error has occurred.",
				duration: 5000,
				className: "error-toast",
			});
		}
	};
	return (
		<div className="relative aspect-video overflow-hidden rounded-lg border-2">
			{!isReady && !isLocked && (
				<div className="absolute inset-0 flex items-center justify-center bg-slate-800">
					<Loader2 className="h-8 w-8 animate-spin text-secondary" />
				</div>
			)}

			{isLocked && (
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary">
					<Lock className="h-8 w-8" />
					<p className="text-sm">This chapter is locked.</p>
				</div>
			)}

			{!isLocked && (
				<CldVideoPlayer
					id={playbackId}
					src={publicId}
					width={0}
					height={0}
					onPlay={() => setIsReady(true)}
					onEnded={onEnd}
					className={cn(!isReady && "hidden")}
				/>
			)}
		</div>
	);
};
