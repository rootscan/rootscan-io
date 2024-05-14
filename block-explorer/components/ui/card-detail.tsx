import { ReactNode } from 'react';

const Wrapper = ({ children }: { children?: ReactNode }) => {
  return <div className="flex flex-col gap-1">{children}</div>;
};

const Title = ({ children }: { children?: ReactNode }) => {
  return <span className="text-muted-foreground">{children}</span>;
};

const Content = ({ children }: { children?: ReactNode }) => {
  return children;
};

const CardDetail = {
  Wrapper,
  Title,
  Content,
};

export default CardDetail;
