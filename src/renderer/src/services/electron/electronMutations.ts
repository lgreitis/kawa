import { useMutation } from "@tanstack/react-query";
import {
  addExtension,
  removeExtension,
  startMalAuthStart,
  submitMagnetUri,
} from "./electronServices";
import { queryClient } from "@renderer/queryClient";

export const useSubmitMagnetUriMutation = () =>
  useMutation({
    mutationFn: submitMagnetUri,
  });

export const useAddExtensionMutation = () =>
  useMutation({
    mutationFn: addExtension,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["electron", "extensions"] });
    },
  });

export const useRemoveExtensionMutation = () =>
  useMutation({
    mutationFn: removeExtension,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["electron", "extensions"] });
    },
  });

export const useStartMalAuthMutation = () =>
  useMutation({
    mutationFn: startMalAuthStart,
  });
