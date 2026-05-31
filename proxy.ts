import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ['/login'];
  const isPublicPath = publicPaths.some(path => pathname === path);

  // Если нет токена и путь не публичный → редирект на логин
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // УБИРАЕМ ЭТОТ БЛОК - пусть клиент сам решает куда редиректить
  // if (token && pathname === '/login') {
  //   const dashboardUrl = new URL('/', request.url);
  //   return NextResponse.redirect(dashboardUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};