import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth';
import { headers } from 'next/headers';

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    console.log('Proxying request:',request.url);

    const session = await auth.api.getSession({
        headers: await headers(),
    })
    const user = session?.user;
    if (!user) {
        // console.log('User is not authenticated. Redirecting to /home');
        return NextResponse.redirect(new URL('/login', request.url))
    }
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}