import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    
    return NextResponse.json({ 
      isAuthenticated: session.isAuthenticated || false 
    });
  } catch (error) {
    return NextResponse.json({ isAuthenticated: false }, { status: 500 });
  }
}
