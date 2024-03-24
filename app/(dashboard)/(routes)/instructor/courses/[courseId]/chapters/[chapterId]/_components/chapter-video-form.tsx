"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { CldUploadWidget } from "next-cloudinary";
import * as z from "zod";
import { Pencil, PlusCircle, Video } from "lucide-react";

import { Chapter, CloudinaryData } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { VideoPlayer } from "@/components/video-player";

type ChapterVideoFormProps = {
	initialData: Chapter & { CloudinaryData?: CloudinaryData | null };
	courseId: string;
	chapterId: string;
};

const formSchema = z.object({
	videoUrl: z.string().min(1),
	playbackId: z.string().min(1),
	publicId: z.string().min(1),
});

export const ChapterVideoForm = ({
	initialData,
	courseId,
	chapterId,
}: ChapterVideoFormProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const router = useRouter();

	const { toast } = useToast();

	const toggleEdit = () => setIsEditing((current) => !current);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);

			toast({
				title: "Chapter updated",
				description: "The chapter video has been updated successfully.",
				duration: 5000,
				className: "success-toast",
			});

			toggleEdit();

			router.refresh();
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
		<div className="mt-6 rounded-md border bg-slate-100 p-4">
			<div className="flex items-center justify-between font-medium">
				Chapter video
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && <>Cancel</>}

					{!isEditing && !initialData.videoUrl && (
						<>
							<PlusCircle className="mr-2 h-4 w-4" />
							Add a video
						</>
					)}

					{!isEditing && initialData.videoUrl && (
						<>
							<Pencil className="mr-2 h-4 w-4" />
							Edit video
						</>
					)}
				</Button>
			</div>

			{!isEditing &&
				(!initialData.videoUrl ? (
					<div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
						<Video id="empty" className="h-10 w-10 text-slate-500" />
					</div>
				) : (
					<div className="relative mt-2 aspect-video">
						<VideoPlayer
							id={initialData.playbackId!}
							publicId={initialData.publicId!}
							width={0}
							height={0}
						/>
					</div>
				))}

			{isEditing && (
				<div>
					<CldUploadWidget
						uploadPreset="jifunzeVideos"
						signatureEndpoint="/api/cloudinary"
						options={{ sources: ["local"], maxFiles: 1 }}
						onSuccess={(result: any) => {
							if (result) {
								onSubmit({
									videoUrl: result.info.secure_url,
									playbackId: result.info.id,
									publicId: result.info.public_id,
								});
							}
						}}
					>
						{({ open }) => {
							return (
								<Button onClick={() => open()} className="bg-blue-600">
									Upload Video
								</Button>
							);
						}}
					</CldUploadWidget>

					<div className="mt-4 text-xs text-muted-foreground">
						Upload this chapter&apos;s video.
					</div>
				</div>
			)}

			{initialData.videoUrl && !isEditing && (
				<div className="mt-2 text-xs text-muted-foreground">
					Videos may take a few minutes to process. Refresh the page if video
					doesn&apos;t load.
				</div>
			)}
		</div>
	);
};
