import { NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest) {
  // Получаем токен из cookies
  const token = request.cookies.get('jwt')?.value;
  const { pathname } = request.nextUrl;

  // Публичные маршруты (доступ без токена)
  const publicPaths = ['/login'];
  const isPublicPath = publicPaths.some(path => pathname === path || pathname.startsWith(`${path}/`));

  //Если нет токена и путь не публичный → редирект на логин
  if (!token && !isPublicPath) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Если есть токен и пытается зайти на логин → редирект на дашборд
  if (token && pathname === '/login') {
    const dashboardUrl = new URL('/', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Для API-запросов — пробрасываем дальше (токен добавится в apiClient)
  return NextResponse.next();
}

// Настройка: какие пути обрабатываем
export const config = {
  matcher: [
    /*
     * Матчим все пути, кроме:
     * - _next/static (статик файлы)
     * - _next/image (оптимизация изображений)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};