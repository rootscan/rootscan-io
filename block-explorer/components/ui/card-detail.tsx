import { ReactNode } from 'react';

import { cn } from '@/lib/utils.ts';

const Wrapper = ({ children }: { children?: ReactNode }) => {
  return <div className="flex items-center gap-2">{children}</div>;
};

const Title = ({ children }: { children?: ReactNode }) => {
  return <div className="w-full max-w-[240px] text-sm text-text-secondary">{children}</div>;
};

const Content = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('flex font-semibold gap-2 items-center text-sm', className)} {...props} />;
};

const CardDetail = {
  Wrapper,
  Title,
  Content,
};

export default CardDetail;
