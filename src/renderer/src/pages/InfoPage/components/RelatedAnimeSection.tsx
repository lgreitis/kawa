import { type IMalAnimeDetailsResponse } from "@renderer/services/mal/malTypes";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface IRelatedAnimeSectionProps {
  malData: IMalAnimeDetailsResponse;
}

export const RelatedAnimeSection: React.FC<IRelatedAnimeSectionProps> = (props) => {
  const { malData } = props;
  const navigate = useNavigate();

  if (!malData.related_anime.length) {
    return;
  }

  return (
    <React.Fragment>
      <h3 className="mb-4 mt-3 text-2xl font-semibold">Related anime</h3>
      <div className="grid grid-cols-3 gap-4 overflow-hidden sm:grid-cols-4 2xl:grid-cols-6">
        {malData.related_anime.slice(0, 7).map((related) => (
          <button
            key={`${related.node.id}_${related.relation_type}`}
            className="relative flex flex-col text-left"
            onClick={() => navigate(`/info/${related.node.id}`)}
          >
            <img
              className="aspect-[2/3] h-full w-full rounded-2xl object-cover"
              src={related.node.main_picture.large ?? related.node.main_picture.medium}
            />
            <span className="line-clamp-2">{related.node.title}</span>
            <span className="text-sm text-zinc-300">{related.relation_type_formatted}</span>
          </button>
        ))}
        {malData.related_anime.length > 7 && (
          <button
            className="flex aspect-[2/3] items-center justify-center rounded-2xl bg-black/40"
            onClick={() => toast.error("Not implemented")}
          >
            <span>View more</span>
          </button>
        )}
      </div>
    </React.Fragment>
  );
};
