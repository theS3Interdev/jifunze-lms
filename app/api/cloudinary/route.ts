import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
	api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
	api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: Request) {
	const body = await req.json();

	const { paramsToSign } = body;

	const signature = cloudinary.utils.api_sign_request(
		paramsToSign,
		process.env.CLOUDINARY_API_SECRET!,
	);

	return Response.json({ signature });
}
