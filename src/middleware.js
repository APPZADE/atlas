import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    // Protect /admin routes (except login)
    if (path.startsWith('/admin') && path !== '/admin/login') {
        const token = request.cookies.get('admin_session');

        if (!token || token.value !== 'valid_admin_token') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
