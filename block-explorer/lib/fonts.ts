import localFont from 'next/font/local';

export const fontLocal = localFont({
  src: [
    {
      path: '../public/fonts/ObjektivMk1/ObjektivMk1_Trial_Hair.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../public/fonts/ObjektivMk1/ObjektivMk1_Trial_Th.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../public/fonts/ObjektivMk1/ObjektivMk1_Trial_Lt.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/ObjektivMk1/ObjektivMk1_Trial_Rg.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/ObjektivMk1/ObjektivMk1_Trial_Md.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/ObjektivMk1/ObjektivMk1_Trial_SBd.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/ObjektivMk1/ObjektivMk1_Trial_Bd.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/ObjektivMk1/ObjektivMk1_Trial_XBd.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/ObjektivMk1/ObjektivMk1_Trial_Blk.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-local',
});
