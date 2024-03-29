const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
	try {
		await database.category.createMany({
			data: [
				{ name: "Business" },
				{ name: "Accounting & Finance" },
				{ name: "Computer Science" },
				{ name: "Productivity" },
				{ name: "Personal Development" },
				{ name: "Marketing" },
				{ name: "Teaching & Academics" },
			],
		});

		console.log("Course categories have been seeded successfully.");
	} catch (error) {
		console.log("Error seeding the course categories.", error);
	} finally {
		await database.$disconnect();
	}
}

main();
