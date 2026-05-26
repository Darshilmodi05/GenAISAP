import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Create the response ONCE — never re-create it in cookie handlers
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Mutate the existing request and response cookies — do NOT create a new NextResponse
          request.cookies.set({ name, value, ...options });
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          // Mutate the existing request and response cookies — do NOT create a new NextResponse
          request.cookies.set({ name, value: '', ...options });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const isMockAuth = !supabaseUrl || 
    supabaseUrl.includes('mock.supabase.co') || 
    supabaseUrl.includes('demo.supabase.co') || 
    supabaseUrl.includes('your-project') || 
    supabaseUrl.includes('your_supabase');

  // Use getUser() instead of getSession() — getSession() reads from cookies which
  // could be tampered with; getUser() validates the token against the Supabase auth server.
  // This also avoids unnecessary token refresh cycles that trigger re-renders.
  const { data: { user } } = await supabase.auth.getUser();

  // If going to dashboard and no user exists, redirect to login
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    if (!isMockAuth) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = '/login';
      const redirectResponse = NextResponse.redirect(redirectUrl);
      // Copy cookies from mutated response to the redirect response
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });
      return redirectResponse;
    }
  }

  // If going to login and user exists, redirect to dashboard
  if (request.nextUrl.pathname === '/login' && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/dashboard/home';
    const redirectResponse = NextResponse.redirect(redirectUrl);
    // Copy cookies from mutated response to the redirect response
    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  }

  return response;
}

// Only run middleware on routes that need auth protection — not on API routes,
// static assets, or other paths. This prevents unnecessary edge function invocations.
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/register',
    '/verify',
  ],
};
