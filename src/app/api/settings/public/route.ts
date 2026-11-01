import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/data-service';

export const revalidate = 30;

export async function GET() {
  try {
    const s = await getSiteSettings();
    return NextResponse.json({
      success: true,
      settings: {
        phone: s.phone,
        whatsapp: s.whatsapp,
        email: s.email,
        address: s.address,
        secondaryAddress: s.secondaryAddress,
        additionalAddresses: s.additionalAddresses,
        socialLinks: s.socialLinks,
        storeName: s.storeName,
        brandNameAr: s.brandNameAr,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error fetching public settings';
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

