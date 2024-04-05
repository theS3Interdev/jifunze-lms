import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs";

import { getAnalytics } from "@/lib/actions/get-analytics";

import { AnalyticsChart } from "./_components/analytics-chart";
import { AnalyticsDataCard } from "./_components/analytics-data-card";

const AnalyticsPage = async () => {
	const { userId } = auth();

	if (!userId) {
		return redirect("/");
	}

	const { data, totalRevenue, totalSales } = await getAnalytics(userId);

	return (
		<div className="p-6">
			<div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
				<AnalyticsDataCard label="Total Revenue" value={totalRevenue} shouldFormat />

				<AnalyticsDataCard label="Total Sales" value={totalSales} />
			</div>

			<AnalyticsChart data={data} />
		</div>
	);
};

export default AnalyticsPage;
