import {
    NextRequest,
    NextResponse,
} from "next/server";

import { auth0 } from "@/lib/auth0";

const BACKEND_URL =
    process.env.BACKEND_URL ||
    "http://127.0.0.1:8000";

const PROXY_SECRET =
    process.env.NIRMAN_PROXY_SECRET || "";

async function forward(
    request: NextRequest,
    context: {
        params: {
            path: string[];
        };
    }
) {
    try {
        /*
         * Check Auth0 session.
         */
        const session =
            await auth0.getSession(request);

        if (!session) {
            return NextResponse.json(
                {
                    detail: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        /*
         * Get Auth0 access token.
         */
        const tokenResult =
            await auth0.getAccessToken();

        const token =
            tokenResult.token;

        if (!token) {
            return NextResponse.json(
                {
                    detail:
                        "Access token missing",
                },
                {
                    status: 401,
                }
            );
        }

        /*
         * Read Buyer/Supplier role selected
         * during login.
         *
         * The browser sends this cookie to
         * this Next.js server automatically.
         */
        const roleCookie =
            request.cookies.get(
                "nirman_login_role"
            );

        let activeRole:
            | "buyer"
            | "supplier" =
            "buyer";

        if (
            roleCookie?.value ===
            "supplier"
        ) {
            activeRole =
                "supplier";
        }

        /*
         * Build backend URL.
         */
        const path =
            context.params.path.join("/");

        const sourceUrl =
            new URL(request.url);

        const targetUrl =
            `${BACKEND_URL}/${path}${sourceUrl.search}`;

        /*
         * Build headers sent to FastAPI.
         */
        const headers =
            new Headers();

        headers.set(
            "Authorization",
            `Bearer ${token}`
        );

        /*
         * Pass selected login role
         * to FastAPI.
         */
        headers.set(
            "X-Nirman-Role",
            activeRole
        );

        /*
         * Secret proves to FastAPI that
         * this request came through our
         * Next.js proxy.
         */
        if (PROXY_SECRET) {
            headers.set(
                "X-Nirman-Proxy-Secret",
                PROXY_SECRET
            );
        }

        /*
         * Preserve content type.
         */
        const contentType =
            request.headers.get(
                "content-type"
            );

        if (contentType) {
            headers.set(
                "Content-Type",
                contentType
            );
        }

        const method =
            request.method.toUpperCase();

        let body:
            | ArrayBuffer
            | undefined;

        if (
            ![
                "GET",
                "HEAD",
            ].includes(method)
        ) {
            body =
                await request.arrayBuffer();
        }

        console.log(
            `[Nirman Proxy] ${method} ${targetUrl} | Active role: ${activeRole}`
        );

        /*
         * Forward request to FastAPI.
         */
        const backendResponse =
            await fetch(
                targetUrl,
                {
                    method,
                    headers,
                    body,
                    cache:
                        "no-store",
                }
            );

        const responseBody =
            await backendResponse.arrayBuffer();

        const responseHeaders =
            new Headers();

        const backendContentType =
            backendResponse.headers.get(
                "content-type"
            );

        if (
            backendContentType
        ) {
            responseHeaders.set(
                "content-type",
                backendContentType
            );
        }

        console.log(
            `[Nirman Proxy] Backend response: ${backendResponse.status}`
        );

        return new NextResponse(
            responseBody,
            {
                status:
                    backendResponse.status,
                headers:
                    responseHeaders,
            }
        );
    } catch (error) {
        console.error(
            "Backend proxy error:",
            error
        );

        return NextResponse.json(
            {
                detail:
                    "Failed to call backend",

                error:
                    error instanceof
                        Error
                        ? error.message
                        : String(error),
            },
            {
                status: 500,
            }
        );
    }
}

export const GET =
    forward;

export const POST =
    forward;

export const PUT =
    forward;

export const PATCH =
    forward;

export const DELETE =
    forward;