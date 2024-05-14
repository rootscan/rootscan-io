import { ImageResponse } from 'next/og';

export type Props = {
  title?: string;
  params?: {
    id: string;
  };
};

export default async function OpengraphImage(props: Props): Promise<ImageResponse> {
  const font = fetch(new URL('/public/fonts/ObjektivMk1_Trial_Md.ttf', import.meta.url)).then((res) =>
    res.arrayBuffer(),
  );

  return new ImageResponse(
    (
      <div tw="flex h-full w-full flex-col items-center justify-center bg-black">
        <div tw="flex flex-col">
          <div tw="text-white text-[175px]">rootscan</div>
          {props?.title ? (
            <div tw="shrink text-white text-[80px] uppercase mt-10 p-2 text-black bg-white rounded-2xl justify-center">
              {props?.title}
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Inter',
          data: await font,
          style: 'normal',
          weight: 400,
        },
      ],
    },
  );
}
