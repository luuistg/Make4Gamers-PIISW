type Props = {
  src: string;
  title: string;
  ratio?: string;
  className?: string;
};

export default function GameViewport({
  src,
  title,
  className = "",
}: Props) {
  return (
    <div className={`relative h-full w-full overflow-hidden bg-black ${className}`}>
      <iframe
        title={title}
        src={src}
        allow="fullscreen"
        className="absolute inset-0 h-full w-full border-0 bg-black"
      />
    </div>
  );
}
