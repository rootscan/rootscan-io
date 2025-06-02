import { Progress } from '@/components/ui/progress.tsx';

export default function GasUsage({ gasUsed, gasLimit }: { gasUsed: number; gasLimit: number }) {
  const randomWidth = Math.round((Number(gasUsed) / Number(gasLimit)) * 100);
  return <Progress value={randomWidth} />;
}
