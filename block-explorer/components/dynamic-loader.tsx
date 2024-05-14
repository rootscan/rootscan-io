import Image from 'next/image';

export default function Loader() {
  return (
    <div className="m-auto flex items-center gap-2 py-10 text-center">
      <Image
        src="/site-logos/rootscan-logo.png"
        width={190}
        height={190}
        priority
        unoptimized
        className="size-8 rounded-lg"
        alt="rootscan_logo"
      />
      Retrieving data
    </div>
  );
}
