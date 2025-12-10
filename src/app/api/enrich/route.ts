import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Extract domain from email
    const domain = email.split('@')[1]?.toLowerCase();

    if (!domain) {
      return NextResponse.json({
        full_name: null,
        job_title: null,
        company_name: null,
        company_size: null,
        industry: null,
      });
    }

    // TODO: Replace with actual BrightData or other enrichment API
    // For now, return mock data based on email domain
    
    try {
      // Example: Call BrightData API
      // const response = await fetch('https://api.brightdata.com/...', {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${process.env.BRIGHTDATA_API_KEY}` },
      //   body: JSON.stringify({ email })
      // });
      // const data = await response.json();

      // Mock response for development
      const mockData = {
        full_name: extractNameFromEmail(email),
        job_title: 'Software Engineer', // Would come from API
        company_name: domainToCompanyName(domain),
        company_size: '100-500',
        industry: 'Technology',
      };

      return NextResponse.json(mockData);
    } catch {
      // Return partial data even if enrichment fails
      return NextResponse.json({
        full_name: extractNameFromEmail(email),
        job_title: null,
        company_name: domainToCompanyName(domain),
        company_size: null,
        industry: null,
      });
    }
  } catch (error) {
    console.error('Enrich API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function extractNameFromEmail(email: string): string | null {
  const local = email.split('@')[0];
  // Try to extract name from formats like "john.doe" or "john_doe"
  if (local.includes('.')) {
    return local.split('.').map(capitalize).join(' ');
  }
  if (local.includes('_')) {
    return local.split('_').map(capitalize).join(' ');
  }
  // Just capitalize the first letter if no separator
  return capitalize(local);
}

function domainToCompanyName(domain: string): string {
  // Remove common TLDs and capitalize
  const name = domain.split('.')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}
