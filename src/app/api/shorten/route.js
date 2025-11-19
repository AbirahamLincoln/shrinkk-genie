import { NextResponse } from 'next/server';

// This is a Serverless Function that runs on Vercel
export async function POST(request) {
  try {
    const body = await request.json();
    const { longUrl, customDomain, customAlias } = body;

    if (!longUrl) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // 1. Determine Short ID
    // Use custom alias if provided, otherwise generate random
    const shortId = customAlias && customAlias.trim() !== '' 
      ? customAlias.trim() 
      : Math.random().toString(36).substring(2, 8);

    // 2. TODO: SAVE TO DATABASE
    // Check for collision if using customAlias!
    // await db.insert({ id: shortId, url: longUrl });
    console.log(`[DB Mock] Saving: ${shortId} -> ${longUrl} (Domain: ${customDomain || 'default'})`);

    // 3. Construct the full short URL
    let shortUrl;
    
    if (customDomain && customDomain.trim() !== '') {
      // Ensure domain has protocol
      let domain = customDomain.trim();
      if (!/^https?:\/\//i.test(domain)) {
        domain = 'https://' + domain;
      }
      // Remove trailing slash if present
      domain = domain.replace(/\/$/, '');
      shortUrl = `${domain}/${shortId}`;
    } else {
      // Use current host
      const host = request.headers.get('host');
      const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
      shortUrl = `${protocol}://${host}/${shortId}`;
    }

    return NextResponse.json({ 
      shortUrl: shortUrl,
      id: shortId 
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}