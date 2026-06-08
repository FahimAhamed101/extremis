module.exports = [
"[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/favicon.ico.mjs { IMAGE => \"[project]/app/favicon.ico (static in ecmascript, tag client)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[project]/app/courses/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CoursesPage,
    "metadata",
    ()=>metadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
;
;
;
const metadata = {
    title: "Courses"
};
function resolveCoursesTemplatePath() {
    const candidates = [
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), "content", "courses.txt"),
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(process.cwd(), "extremis", "content", "courses.txt")
    ];
    const foundPath = candidates.find((candidatePath)=>__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].existsSync(candidatePath));
    if (!foundPath) {
        throw new Error("courses.txt template was not found.");
    }
    return foundPath;
}
function normalizeTemplateHtml(html) {
    const bodyContent = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
    return bodyContent.replace(/<div[^>]*id=["']page-loader["'][^>]*>[\s\S]*?<\/div>\s*<!--\s*page loader\s*-->/gi, "").replace(/<div[^>]*id=["']page-loader["'][^>]*>[\s\S]*?<\/div>/gi, "").replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/\b(src|href)=["']images\//gi, '$1="/images/').replace(/\b(src|href)=["']js\//gi, '$1="/js/').replace(/\b(src|href)=["']css\//gi, '$1="/css/').replace(/url\((['"]?)images\//gi, "url($1/images/").replace(/\bhref=(['"])index\.html\1/gi, 'href="/"').replace(/\bhref=(['"])videos\.html\1/gi, 'href="/videos"').replace(/\bhref=(['"])courses\.html\1/gi, 'href="/courses"').replace(/\bhref=(['"])blog\.html\1/gi, 'href="/blog"').replace(/\bhref=(['"])messages\.html\1/gi, 'href="/messages"').replace(/\bhref=(['"])profile(?:-page2)?\.html\1/gi, 'href="/profile"').replace(/\bhref=(['"])sign-?in\.html\1/gi, 'href="/login"').replace(/\bhref=(['"])signup\.html\1/gi, 'href="/signup"');
}
const coursesTemplate = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].readFileSync(resolveCoursesTemplatePath(), "utf8");
const coursesMarkup = normalizeTemplateHtml(coursesTemplate);
function CoursesPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        dangerouslySetInnerHTML: {
            __html: coursesMarkup
        }
    }, void 0, false, {
        fileName: "[project]/app/courses/page.tsx",
        lineNumber: 51,
        columnNumber: 10
    }, this);
}
}),
"[project]/app/courses/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/courses/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__924f3f41._.js.map