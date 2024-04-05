import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { isInstructor } from "@/lib/instructor";

const InstructorLayout = ({ children }: { children: React.ReactNode }) => {
	const { userId } = auth();

	if (!isInstructor(userId)) {
		return redirect("/");
	}

	return <main>{children}</main>;
};

export default InstructorLayout;
