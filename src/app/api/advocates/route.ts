import db from "../../../db";
import { advocates } from "../../../db/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");

  const offset = (page - 1) * pageSize;

  try {
    const allData = await db.select().from(advocates);

    if (Array.isArray(allData) && allData.length === 0) {
      return Response.json({
        results: [],
        total: 0,
        page,
        pageSize,
      });
    }

    // Apply search filter
    let filteredData = allData;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = allData.filter(
        (advocate) =>
          advocate.firstName.toLowerCase().includes(searchLower) ||
          advocate.lastName.toLowerCase().includes(searchLower) ||
          advocate.city.toLowerCase().includes(searchLower) ||
          advocate.degree.toLowerCase().includes(searchLower) ||
          String(advocate.specialties).toLowerCase().includes(searchLower) ||
          advocate.yearsOfExperience
            .toString()
            .toLowerCase()
            .includes(searchLower) ||
          advocate.phoneNumber
            .toString()
            .toLowerCase()
            .includes(searchLower.replace(/-\s\(\)/g, ""))
      );
    }

    // Apply pagination
    const total = filteredData.length;
    const results = filteredData.slice(offset, offset + pageSize);

    return Response.json({
      results,
      total,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Database query error:", error);

    // Fallback for development when database is not available
    return Response.json({
      results: [],
      total: 0,
      page,
      pageSize,
    });
  }
}
