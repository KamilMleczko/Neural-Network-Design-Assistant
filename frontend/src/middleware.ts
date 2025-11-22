import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@/src/utils/supabase/server";

export async function middleware(request: NextRequest) {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect certain routes
  if (
    request.nextUrl.pathname.startsWith("/chat") ||
    request.nextUrl.pathname.startsWith("/predict")
  ) {
    if (!session) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/chat/:path*", "/predict/:path*"],
};
