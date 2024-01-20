import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';


export function middleware(request: NextRequest) {

  const path = request.nextUrl.pathname;

  const isPublicPath = path === '/login' ||
    path === '/signup' ||
    path === '/forgot-password' ||
    path === '/update-password' ||
    path === '/verify-account' ||
    path === '/resend-verification-email'
    ;

  const accesstoken = request.cookies.get('accessToken')?.value || '';


  if (isPublicPath && accesstoken) {
    return NextResponse.redirect(new URL('/', request.nextUrl))
  }

  if (!isPublicPath && !accesstoken) {
    return NextResponse.redirect(new URL('/login', request.nextUrl))
  }


};

export const config = {
  matcher: [
    '/',
    '/login',
    '/signup',
    '/forgot-password',
    '/update-password',
    '/verify-account',
    '/resend-verification-email',
    '/edit',
    '/search',
    '/messages',
    '/profile',
    '/profile/[id]',
    '/uploadFile',
    '/accessToken-expired'
  ]
}