import { PaginationResponse } from '@/types/api-types';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ServerActionResult } from './action-utils';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumber = (number: number) => {
  return Intl.NumberFormat('en-US', { maximumFractionDigits: 18 }).format(number);
};

export const formatNumberDollars = (number: number, maximumFractionDigits?: number) => {
  const USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: maximumFractionDigits || 4,
  });
  return USDollar.format(number);
};

export const getPaginationData = (data: PaginationResponse<unknown>): Omit<PaginationResponse<unknown>, 'docs'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { docs, ...rest } = data;
  return rest;
};

export const camelCaseToWords = (str) => {
  return str
    .match(/^[a-z]+|[A-Z][a-z]*/g)
    .map(function (x) {
      return x[0].toUpperCase() + x.substr(1).toLowerCase();
    })
    .join(' ');
};

export function handleRequestResult<T>(result: ServerActionResult<T>): T {
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.value;
}
