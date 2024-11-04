import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient, removeOldestQuery } from "@tanstack/react-query-persist-client";

export const queryClient = new QueryClient();

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  retry: removeOldestQuery,
});

void persistQueryClient({
  queryClient,
  persister: localStoragePersister,
});
