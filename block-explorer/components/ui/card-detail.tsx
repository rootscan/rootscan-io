import { ReactNode } from 'react';

import { cn } from '@/lib/utils.ts';

const Wrapper = ({ children }: { children?: ReactNode }) => {
  return <div className="flex flex-col gap-2 lg:flex-row">{children}</div>;
};

const Title = ({ children }: { children?: ReactNode }) => {
  return <div className="w-full max-w-[200px] shrink-0 text-sm text-text-secondary">{children}</div>;
};

const Content = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('flex flex-1 font-semibold gap-2 items-center text-sm w-full', className)} {...props} />;
};

const CardDetail = {
  Wrapper,
  Title,
  Content,
};

export default CardDetail;
