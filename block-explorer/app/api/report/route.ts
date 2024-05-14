export const dynamic = 'force-dynamic';
export async function GET(request: Request & { nextUrl: { searchParams: any } }) {
  const from = request?.nextUrl?.searchParams.get('from') as string;
  const to = request?.nextUrl?.searchParams.get('to') as string;
  const address = request?.nextUrl?.searchParams.get('address') as string;

  const BASE_URL = process.env.BASE_URL;

  const url = `${BASE_URL}/generateReport`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, address }),
  });
  const fileName = `report_${from}_${to}_${address}.csv`;
  const headers = {
    'content-disposition': `attachment; filename="${fileName}"`,
  };
  Object.entries(response.headers).forEach(([key, value]) => {
    headers[key] = value;
  });

  return new Response(response.body, {
    headers,
  });
}
