import { useMutation } from "@tanstack/react-query";
import { getMalUser } from "./malServices";

// Weird use of mutation, but it's the eaiest way to get user once.
export const useGetMalUserMutation = () =>
  useMutation({
    mutationFn: getMalUser,
  });
