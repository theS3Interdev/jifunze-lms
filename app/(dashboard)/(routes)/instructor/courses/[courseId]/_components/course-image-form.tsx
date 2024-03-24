"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CldImage, CldUploadWidget } from "next-cloudinary";
import axios from "axios";
import * as z from "zod";
import { Pencil, PlusCircle, ImageIcon } from "lucide-react";

import { Course } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type CourseImageFormProps = {
	initialData: Course;
	courseId: string;
};

const formSchema = z.object({
	imageUrl: z.string().min(1, {
		message: "The course image is required.",
	}),
});

export const CourseImageForm = ({ initialData, courseId }: CourseImageFormProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const router = useRouter();

	const { toast } = useToast();

	const toggleEdit = () => setIsEditing((current) => !current);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.patch(`/api/courses/${courseId}`, values);

			toast({
				title: "Course updated",
				description: "The course image has been successfully updated.",
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
				Course image
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && <>Cancel</>}

					{!isEditing && !initialData.imageUrl && (
						<>
							<PlusCircle className="mr-2 h-4 w-4" />
							Add an image
						</>
					)}

					{!isEditing && initialData.imageUrl && (
						<>
							<Pencil className="mr-2 h-4 w-4" />
							Edit image
						</>
					)}
				</Button>
			</div>

			{!isEditing &&
				(!initialData.imageUrl ? (
					<div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
						<ImageIcon className="h-10 w-10 text-slate-500" />
					</div>
				) : (
					<div className="relative mt-2 aspect-video">
						<CldImage
							src={initialData.imageUrl}
							alt="Upload"
							fill
							sizes="100vw"
							className="rounded-md object-cover"
						/>
					</div>
				))}

			{isEditing && (
				<div>
					<CldUploadWidget
						uploadPreset="jifunzeImages"
						signatureEndpoint="/api/cloudinary"
						options={{ sources: ["local"], maxFiles: 1 }}
						onSuccess={(result: any) => {
							if (result) {
								onSubmit({ imageUrl: result.info.secure_url });
							}
						}}
					>
						{({ open }) => {
							return (
								<Button onClick={() => open()} className="bg-blue-600">
									Upload Image
								</Button>
							);
						}}
					</CldUploadWidget>

					<div className="mt-4 text-xs text-muted-foreground">
						16:9 aspect ratio is recommended.
					</div>
				</div>
			)}
		</div>
	);
};
