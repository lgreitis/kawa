interface IVideoControlBarTimeProps {
  time: number;
}

export const VideoControlBarTime: React.FC<IVideoControlBarTimeProps> = (props) => {
  const { time } = props;

  if (isNaN(time)) {
    return <span>00:00</span>;
  }

  return (
    <span>
      {Math.floor(time / 60)
        .toString()
        .padStart(2, "0")}
      :
      {Math.floor(time % 60)
        .toString()
        .padStart(2, "0")}
    </span>
  );
};
