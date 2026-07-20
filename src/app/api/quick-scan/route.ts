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

    const responseTime = ((Date.now() - startTime) / 1000).toFixed(2) + 's';
    const isOnline = res.ok || (res.status >= 300 && res.status < 400);

    // בדיקת כותרות אבטחה (Security Headers)
    const hasXFrame = res.headers.has('x-frame-options');
    const hasHsts = res.headers.has('strict-transport-security');
    const hasContentType = res.headers.has('x-content-type-options');

    // חישוב דירוג אבטחה בסיסי
    let rating = 'B';
    if (hasXFrame && hasHsts && hasContentType) rating = 'A';
    else if (!hasXFrame && !hasHsts) rating = 'D';

    return NextResponse.json({
      success: true,
      realtime_data: {
        url: targetUrl,
        status: isOnline ? 'ONLINE' : 'OFFLINE',
        http_code: res.status,
        speed: responseTime,
        ssl_status: targetUrl.startsWith('https') ? 'תקף ומאובטח (SSL)' : 'לא מאובטח (HTTP)',
        security_rating: rating,
        headers_analysis: {
          'X-Frame-Options': hasXFrame,
          'Strict-Transport-Security': hasHsts,
          'X-Content-Type-Options': hasContentType,
        },
      },
      premium_locked_data: {
        historical_uptime_sla: '99.9%',
        load_variance_graph: 'Available in Premium',
        instant_channels_alerting: 'Available in Premium',
      },
    });
  } catch (error: unknown) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to reach host',
    }, { status: 500 });
  }
}