module.exports = [
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/auth/client.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearAuthSession",
    ()=>clearAuthSession,
    "hasClientAuthSession",
    ()=>hasClientAuthSession,
    "setAuthSession",
    ()=>setAuthSession
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/constants.ts [app-ssr] (ecmascript)");
"use client";
;
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
function isBrowser() {
    return ("TURBOPACK compile-time value", "undefined") !== "undefined";
}
function getSecureCookieFlag() {
    if (!isBrowser()) {
        return "";
    }
    //TURBOPACK unreachable
    ;
}
function writeCookie(name, value, maxAge) {
    if (!isBrowser()) {
        return;
    }
    //TURBOPACK unreachable
    ;
}
function clearCookie(name) {
    if (!isBrowser()) {
        return;
    }
    //TURBOPACK unreachable
    ;
}
function readCookie(name) {
    if (!isBrowser()) {
        return null;
    }
    //TURBOPACK unreachable
    ;
    const prefix = undefined;
    const match = undefined;
}
function dispatchAuthStorageEvent() {
    if (!isBrowser()) {
        return;
    }
    //TURBOPACK unreachable
    ;
}
function setAuthSession(token, user) {
    if (!isBrowser()) {
        return;
    }
    //TURBOPACK unreachable
    ;
}
function clearAuthSession() {
    if (!isBrowser()) {
        return;
    }
    //TURBOPACK unreachable
    ;
}
function hasClientAuthSession() {
    if (!isBrowser()) {
        return false;
    }
    //TURBOPACK unreachable
    ;
}
}),
"[project]/lib/utils/extractApiErrorMessage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractApiErrorMessage",
    ()=>extractApiErrorMessage
]);
function parseStringPayload(payload) {
    const trimmed = payload.trim();
    if (!trimmed) {
        return null;
    }
    try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed.message === "string" && parsed.message.trim()) {
            return parsed.message.trim();
        }
    } catch  {
    // keep raw text fallback
    }
    return trimmed;
}
function extractApiErrorMessage(error, fallback) {
    if (typeof error === "object" && error !== null) {
        const candidate = error;
        const payload = candidate.data;
        if (typeof payload === "string") {
            const parsed = parseStringPayload(payload);
            if (parsed) {
                return parsed;
            }
        }
        if (typeof payload === "object" && payload !== null && "message" in payload && typeof payload.message === "string") {
            const message = payload.message.trim();
            if (message) {
                return message;
            }
        }
        if (typeof candidate.error === "string" && candidate.error.trim()) {
            return candidate.error.trim();
        }
    }
    if (error instanceof Error && error.message.trim()) {
        return error.message.trim();
    }
    return fallback;
}
}),
"[project]/components/auth/LoginForm.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/authApi.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/client.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$extractApiErrorMessage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils/extractApiErrorMessage.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function LoginForm() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [login, { isLoading }] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useLoginMutation"])();
    const [status, setStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        text: "",
        error: false
    });
    const onSubmit = async (event)=>{
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const payload = {
            email: String(formData.get("email") || "").trim(),
            password: String(formData.get("password") || "")
        };
        try {
            const response = await login(payload).unwrap();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$client$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthSession"])(response.token, response.user);
            setStatus({
                text: "Login successful. Redirecting...",
                error: false
            });
            setTimeout(()=>{
                router.replace("/");
            }, 900);
        } catch (error) {
            setStatus({
                text: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2f$extractApiErrorMessage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["extractApiErrorMessage"])(error, "Login failed."),
                error: true
            });
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
        method: "post",
        className: "c-form",
        onSubmit: onSubmit,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "email",
                name: "email",
                placeholder: "Email@",
                required: true
            }, void 0, false, {
                fileName: "[project]/components/auth/LoginForm.tsx",
                lineNumber: 40,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "password",
                name: "password",
                placeholder: "xxxxxxxxxx",
                required: true
            }, void 0, false, {
                fileName: "[project]/components/auth/LoginForm.tsx",
                lineNumber: 41,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "checkbox",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        id: "remember-me",
                        defaultChecked: true
                    }, void 0, false, {
                        fileName: "[project]/components/auth/LoginForm.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                        htmlFor: "remember-me",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Remember Me"
                        }, void 0, false, {
                            fileName: "[project]/components/auth/LoginForm.tsx",
                            lineNumber: 45,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/auth/LoginForm.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/auth/LoginForm.tsx",
                lineNumber: 42,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "main-btn",
                type: "submit",
                disabled: isLoading,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                        className: "icofont-key"
                    }, void 0, false, {
                        fileName: "[project]/components/auth/LoginForm.tsx",
                        lineNumber: 49,
                        columnNumber: 9
                    }, this),
                    " ",
                    isLoading ? "Logging in..." : "Login"
                ]
            }, void 0, true, {
                fileName: "[project]/components/auth/LoginForm.tsx",
                lineNumber: 48,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                style: {
                    marginTop: "10px",
                    marginBottom: 0,
                    color: status.error ? "#d42626" : "#1a8f4d"
                },
                children: status.text
            }, void 0, false, {
                fileName: "[project]/components/auth/LoginForm.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/auth/LoginForm.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__b6a1c93c._.js.map