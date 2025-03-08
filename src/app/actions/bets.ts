import axiosInstance from "@/lib/axios.config";
import { cookies } from "next/headers";

export async function getBets(payload: {
  page?: number;
  month?: number;
  year?: number;
  withVoid?: string;
}) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    const {
      page = 1,
      month = undefined,
      year = undefined,
      withVoid = true,
    } = payload;

    const response = await axiosInstance.get("/api/bets", {
      params: { page, month, year, withVoid },
      headers: {
        Cookie: `token=${token};`,
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching bets:", error);
    throw new Error("Failed to fetch bets");
  }

  //   const response = await fetch(
  //     `${baseUrl}/api/bets?page=${page}&month=${month}&year=${year}&withVoid=${withVoid}`,
  //     {
  //       headers: {
  //         Cookie: `token=${token};`,
  //       },
  //     }
  //   );

  //   if (!response.ok) {
  //     throw new Error("Oooops!");
  //   }
  //   const data = await response.json();
  //   return data;
}
