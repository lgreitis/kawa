import { useQuery } from "@tanstack/react-query";
import { getExtensions } from "./electronServices";

export const useGetExtensionsQuery = () =>
  useQuery({
    queryKey: ["electron", "extensions"],
    queryFn: () => getExtensions(),
  });
