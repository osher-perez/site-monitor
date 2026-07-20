import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const startTime = Date.now();
    const res = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SiteMonitorScanner/1.0',
      },
      cache: 'no-store',
    });

    const responseTime = Date.now() - startTime;

    return NextResponse.json({
      url: targetUrl,
      status: res.status,
      status_text: res.statusText,
      response_time_ms: responseTime,
      is_up: res.ok,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to reach host';

    return NextResponse.json({
      url: targetUrl,
      status: 0,
      status_text: errorMessage,
      response_time_ms: 0,
      is_up: false,
      timestamp: new Date().toISOString(),
    });
  }
}