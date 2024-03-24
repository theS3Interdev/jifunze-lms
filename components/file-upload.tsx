"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import { useToast } from "@/components/ui/use-toast";

type FileUploadProps = {
	onChange: (url?: string, name?: string) => void;
	endpoint: keyof typeof ourFileRouter;
};

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
	const { toast } = useToast();

	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(res: any) => {
				onChange(res?.[0]);
			}}
			onUploadError={(error: Error) => {
				toast({
					title: "Something went wrong",
					description: `${error?.message}`,
					duration: 5000,
					className: "error-toast",
				});
			}}
		/>
	);
};
