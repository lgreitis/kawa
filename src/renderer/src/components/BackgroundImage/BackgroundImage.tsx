import { EMPTY_IMAGE } from "@renderer/constants";
import { ImageCrossfade } from "../ImageCrossfade";

interface IBackgroundImageProps {
  imdbId?: string;

  className?: string;
}

export const BackgroundImage: React.FC<IBackgroundImageProps> = (props) => {
  const { imdbId, className } = props;

  const imageSrc = imdbId
    ? `https://images.metahub.space/background/large/${imdbId}/img`
    : EMPTY_IMAGE;

  return <ImageCrossfade src={imageSrc} className={className} />;
};
