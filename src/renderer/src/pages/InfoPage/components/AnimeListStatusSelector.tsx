import {
  CheckBadgeIcon,
  HandRaisedIcon,
  PencilSquareIcon,
  EyeIcon,
  ListBulletIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useUserMalAnimeListEntryQuery } from "@renderer/services/mal/malQueries";
import React from "react";
import { Dropdown } from "@renderer/components/Dropdown/Dropdown";
import { MAL_STATUS_TO_ENGLISH_TRANSLATION } from "@renderer/constants";
import { useUpdateUserMalAnimeList } from "@renderer/services/mal/malMutations";
import { MalAnimeStatus } from "@renderer/services/mal/malTypes";
import { toast } from "sonner";

interface IAnimeListStatusSelectorProps {
  malId: number;
}

export const AnimeListStatusSelector: React.FC<IAnimeListStatusSelectorProps> = (props) => {
  const { malId } = props;
  const { data: malUserEntry } = useUserMalAnimeListEntryQuery({ malId });

  const { mutateAsync } = useUpdateUserMalAnimeList();

  const updateAnimeListEntry = async (status: MalAnimeStatus) => {
    await mutateAsync({ malId: malId, status });
    toast.success(`Updated anime status to ${MAL_STATUS_TO_ENGLISH_TRANSLATION[status]}`);
  };

  const animeStatusOptions = [
    {
      label: "Watching",
      icon: EyeIcon,
      onClick: () => updateAnimeListEntry(MalAnimeStatus.Watching),
    },
    {
      label: "Completed",
      icon: CheckBadgeIcon,
      onClick: () => updateAnimeListEntry(MalAnimeStatus.Completed),
    },
    {
      label: "On hold",
      icon: HandRaisedIcon,
      onClick: () => updateAnimeListEntry(MalAnimeStatus.OnHold),
    },
    {
      label: "Dropped",
      icon: TrashIcon,
      onClick: () => updateAnimeListEntry(MalAnimeStatus.Dropped),
    },
    {
      label: "Plan to watch",
      icon: PencilSquareIcon,
      onClick: () => updateAnimeListEntry(MalAnimeStatus.PlanToWatch),
    },
  ];

  if (!malUserEntry) {
    return null;
  }

  return (
    <Dropdown
      as={(props) => (
        <button className="flex items-center" {...props}>
          <ListBulletIcon className="mr-1 h-5 w-5" />
          <span>
            {malUserEntry.my_list_status
              ? MAL_STATUS_TO_ENGLISH_TRANSLATION[malUserEntry.my_list_status.status]
              : "Add to list"}
          </span>
        </button>
      )}
      to="bottom start"
      origin="top-left"
      options={animeStatusOptions}
    />
  );
};
