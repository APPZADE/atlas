import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        // Hardcoded credentials: admin / admin
        if (username === 'admin' && password === 'admin') {
            const response = NextResponse.json({ success: true });

            // Set Cookie
            response.cookies.set('admin_session', 'valid_admin_token', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24 // 1 day
            });

            return response;
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (e) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
