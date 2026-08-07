import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Advocate } from "../types/advocate";

interface AdvocatesResponse {
  results: Advocate[];
  total: number;
  page: number;
  pageSize: number;
}

interface UseAdvocatesParams {
  searchTerm: string;
  page: number;
  pageSize: number;
}

const fetchAdvocates = async ({
  searchTerm,
  page,
  pageSize,
}: UseAdvocatesParams): Promise<AdvocatesResponse> => {
  const response = await axios.get("/api/advocates", {
    params: {
      search: searchTerm,
      page,
      pageSize,
    },
  });
  console.log("Fetched advocates:", response.data);
  return response.data;
};

export const useAdvocates = (
  searchTerm: string,
  page: number,
  pageSize: number
) => {
  return useQuery({
    queryKey: ["advocates", searchTerm, page, pageSize],
    queryFn: () => fetchAdvocates({ searchTerm, page, pageSize }),
    placeholderData: keepPreviousData,
  });
};
