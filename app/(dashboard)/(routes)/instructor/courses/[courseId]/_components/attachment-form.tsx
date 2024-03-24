"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import * as z from "zod";
import { PlusCircle, File, Loader2, X } from "lucide-react";

import { Attachment, Course } from "@prisma/client";

import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type AttachmentFormProps = {
	initialData: Course & { attachments: Attachment[] };
	courseId: string;
};

const formSchema = z.object({
	url: z.string().min(1),
});

export const AttachmentForm = ({ initialData, courseId }: AttachmentFormProps) => {
	const [isEditing, setIsEditing] = useState(false);

	const [deletingId, setDeletingId] = useState<string | null>(null);

	const router = useRouter();

	const { toast } = useToast();

	const toggleEdit = () => setIsEditing((current) => !current);

	const onSubmit = async (values: z.infer<typeof formSchema>) => {
		try {
			await axios.post(`/api/courses/${courseId}/attachments`, values);

			toast({
				title: "Attachment added",
				description: "The attachment has been successfully created.",
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

	const onDelete = async (id: string) => {
		try {
			setDeletingId(id);

			await axios.delete(`/api/courses/${courseId}/attachments/${id}`);

			toast({
				title: "Attachment deleted",
				description: "The attachment has been successfully deleted.",
				duration: 5000,
				className: "success-toast",
			});

			router.refresh();
		} catch {
			toast({
				title: "Something went wrong",
				description: "An unknown error has occurred.",
				duration: 5000,
				className: "error-toast",
			});
		} finally {
			setDeletingId(null);
		}
	};

	return (
		<div className="mt-6 rounded-md border bg-slate-100 p-4">
			<div className="flex items-center justify-between font-medium">
				Course attachments
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && <>Cancel</>}

					{!isEditing && (
						<>
							<PlusCircle className="mr-2 h-4 w-4" />
							Add a file
						</>
					)}
				</Button>
			</div>

			{!isEditing && (
				<>
					{initialData.attachments.length === 0 && (
						<p className="mt-2 text-sm italic text-slate-500">No attachments yet</p>
					)}

					{initialData.attachments.length > 0 && (
						<div className="space-y-2">
							{initialData.attachments.map((attachment) => (
								<div
									key={attachment.id}
									className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
								>
									<File className="mr-2 h-4 w-4 flex-shrink-0" />

									<p className="line-clamp-1 text-xs">{attachment.name}</p>

									{deletingId === attachment.id && (
										<div>
											<Loader2 className="h-4 w-4 animate-spin" />
										</div>
									)}

									{deletingId !== attachment.id && (
										<button
											onClick={() => onDelete(attachment.id)}
											className="ml-auto transition hover:opacity-75"
										>
											<X className="h-4 w-4" />
										</button>
									)}
								</div>
							))}
						</div>
					)}
				</>
			)}

			{isEditing && (
				<div>
					<FileUpload
						endpoint="courseAttachment"
						onChange={(url) => {
							if (url) {
								onSubmit({ url: url });
							}
						}}
					/>

					<div className="mt-4 text-xs text-muted-foreground">
						Add anything your learners may need to complete the course.
					</div>
				</div>
			)}
		</div>
	);
};
