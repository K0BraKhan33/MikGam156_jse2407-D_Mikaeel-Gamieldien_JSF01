// /src/middleware.js

import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();

  // Check if the path is the root URL
  if (url.pathname === '/') {
    // Redirect to /products
    url.pathname = '/products';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
