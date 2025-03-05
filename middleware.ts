import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const isLoggedIn = !!req.nextauth.token;

        if (isLoggedIn && pathname === "/") {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }

        if (!isLoggedIn && pathname.startsWith("/dashboard")) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => true, 
        },
    }
);

export const config = {
    matcher: ["/", "/dashboard"], 
};
