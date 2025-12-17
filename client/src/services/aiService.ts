import axios from "axios";

export const getInsightsForUser = async (userName: string, token: string) => {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/assistant/insights",
      {
        params: { user_name: userName },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching insights:", error.response?.data || error.message);
    throw error.response?.data || { message: "Failed to fetch insights" };
  }
};
