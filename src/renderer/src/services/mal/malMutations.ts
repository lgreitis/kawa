import { useMutation } from "@tanstack/react-query";
import { getMalUser, updateUserMalAnimeList } from "./malServices";
import { queryClient } from "@renderer/queryClient";

// Weird use of mutation, but it's the eaiest way to get user once.
export const useGetMalUserMutation = () =>
  useMutation({
    mutationFn: getMalUser,
  });

export const useUpdateUserMalAnimeList = () =>
  useMutation({
    mutationFn: updateUserMalAnimeList,
    onSuccess: async (_data, variables, _context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["mal", "user", "@me", "animeList"] }),
        queryClient.invalidateQueries({ queryKey: ["mal", "user", "entry", variables.malId] }),
      ]);
    },
  });
