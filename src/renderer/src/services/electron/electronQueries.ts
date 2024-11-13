import { useQuery } from "@tanstack/react-query";
import { getDownloadFolderSize, getExtensions } from "./electronServices";

export const useGetExtensionsQuery = () =>
  useQuery({
    queryKey: ["electron", "extensions"],
    queryFn: () => getExtensions(),
  });

export const useDownloadFolderSizeQuery = () =>
  useQuery({
    queryKey: ["electron", "torrent", "size"],
    queryFn: () => getDownloadFolderSize(),
  });
