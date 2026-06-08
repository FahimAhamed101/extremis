module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/lib/auth/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AUTH_COOKIE_NAME",
    ()=>AUTH_COOKIE_NAME,
    "AUTH_STORAGE_EVENT",
    ()=>AUTH_STORAGE_EVENT,
    "AUTH_TOKEN_STORAGE_KEY",
    ()=>AUTH_TOKEN_STORAGE_KEY,
    "AUTH_USER_STORAGE_KEY",
    ()=>AUTH_USER_STORAGE_KEY
]);
const AUTH_COOKIE_NAME = "auth_token";
const AUTH_TOKEN_STORAGE_KEY = "auth_token";
const AUTH_USER_STORAGE_KEY = "auth_user";
const AUTH_STORAGE_EVENT = "auth-storage-change";
}),
"[project]/lib/services/authApi.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apiBaseUrl",
    ()=>apiBaseUrl,
    "authApi",
    ()=>authApi,
    "useAddPostCommentMutation",
    ()=>useAddPostCommentMutation,
    "useCreatePostMutation",
    ()=>useCreatePostMutation,
    "useGetChatContactsQuery",
    ()=>useGetChatContactsQuery,
    "useGetChatConversationsQuery",
    ()=>useGetChatConversationsQuery,
    "useGetChatMessagesQuery",
    ()=>useGetChatMessagesQuery,
    "useGetCurrentUserQuery",
    ()=>useGetCurrentUserQuery,
    "useGetDiscoverPeopleQuery",
    ()=>useGetDiscoverPeopleQuery,
    "useGetFeedPostsQuery",
    ()=>useGetFeedPostsQuery,
    "useGetMyProfileQuery",
    ()=>useGetMyProfileQuery,
    "useGetOrCreateChatConversationMutation",
    ()=>useGetOrCreateChatConversationMutation,
    "useGetPostByIdQuery",
    ()=>useGetPostByIdQuery,
    "useGetProfileByIdQuery",
    ()=>useGetProfileByIdQuery,
    "useLoginMutation",
    ()=>useLoginMutation,
    "useMarkChatConversationReadMutation",
    ()=>useMarkChatConversationReadMutation,
    "useReactToPostMutation",
    ()=>useReactToPostMutation,
    "useSendChatMessageMutation",
    ()=>useSendChatMessageMutation,
    "useSharePostMutation",
    ()=>useSharePostMutation,
    "useSignupMutation",
    ()=>useSignupMutation,
    "useToggleFollowUserMutation",
    ()=>useToggleFollowUserMutation,
    "useTogglePostLikeMutation",
    ()=>useTogglePostLikeMutation,
    "useUpdateMyProfileMutation",
    ()=>useUpdateMyProfileMutation,
    "useUpdateProfileMediaMutation",
    ()=>useUpdateProfileMediaMutation,
    "useUploadProfileAssetMutation",
    ()=>useUploadProfileAssetMutation
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/react/rtk-query-react.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/query/rtk-query.modern.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/constants.ts [app-ssr] (ecmascript)");
;
;
const rawApiBaseUrl = String(("TURBOPACK compile-time value", "http://localhost:4000") || "").trim();
function normalizeApiRoot(value) {
    const normalizedApiBaseUrl = String(value || "").trim().replace(/\/+$/, "");
    if (!normalizedApiBaseUrl) {
        return "";
    }
    return normalizedApiBaseUrl.endsWith("/api") ? normalizedApiBaseUrl : `${normalizedApiBaseUrl}/api`;
}
function resolveApiRoot() {
    const configuredApiRoot = normalizeApiRoot(rawApiBaseUrl);
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    if (configuredApiRoot) {
        return configuredApiRoot;
    }
    return "/api";
}
const resolvedApiRoot = resolveApiRoot();
const apiBaseUrl = resolvedApiRoot.endsWith("/api") ? resolvedApiRoot.slice(0, -4) : resolvedApiRoot;
const cloudinaryCloudName = String(("TURBOPACK compile-time value", "") || "").trim();
const cloudinaryUploadPreset = String(("TURBOPACK compile-time value", "") || "").trim();
function readCookie(name) {
    if (typeof document === "undefined") {
        return null;
    }
    const prefix = `${name}=`;
    const match = document.cookie.split("; ").find((item)=>item.startsWith(prefix));
    return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}
function getCloudinaryFolder(kind) {
    switch(kind){
        case "avatar":
            return "extremis/avatars";
        case "cover":
            return "extremis/covers";
        default:
            return "extremis/uploads";
    }
}
function getUploadResponseKind(kind) {
    if (kind === "avatar" || kind === "cover") {
        return kind;
    }
    return "upload";
}
const authApi = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$react$2f$rtk$2d$query$2d$react$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createApi"])({
    reducerPath: "authApi",
    tagTypes: [
        "Auth",
        "Profile",
        "Posts",
        "Chat"
    ],
    baseQuery: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$query$2f$rtk$2d$query$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["fetchBaseQuery"])({
        baseUrl: resolvedApiRoot,
        prepareHeaders: (headers)=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return headers;
        }
    }),
    endpoints: (builder)=>({
            signup: builder.mutation({
                query: (body)=>({
                        url: "/auth/signup",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    "Auth",
                    "Profile"
                ]
            }),
            login: builder.mutation({
                query: (body)=>({
                        url: "/auth/login",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    "Auth",
                    "Profile"
                ]
            }),
            getCurrentUser: builder.query({
                query: ()=>({
                        url: "/auth/me",
                        method: "GET"
                    }),
                providesTags: [
                    "Auth"
                ]
            }),
            getChatConversations: builder.query({
                query: (params)=>({
                        url: "/chat/conversations",
                        method: "GET",
                        params: {
                            page: params?.page ?? 1,
                            limit: params?.limit ?? 20
                        }
                    }),
                providesTags: [
                    "Chat"
                ]
            }),
            getChatContacts: builder.query({
                query: (params)=>({
                        url: "/chat/contacts",
                        method: "GET",
                        params: params?.search ? {
                            search: params.search
                        } : undefined
                    }),
                providesTags: [
                    "Chat"
                ]
            }),
            getOrCreateChatConversation: builder.mutation({
                query: (body)=>({
                        url: "/chat/conversations",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    "Chat"
                ]
            }),
            getChatMessages: builder.query({
                query: ({ conversationId, recipientId, before, limit = 200 })=>({
                        url: `/chat/conversations/${conversationId}/messages`,
                        method: "GET",
                        params: {
                            limit,
                            ...recipientId ? {
                                recipientId
                            } : {},
                            ...before ? {
                                before
                            } : {}
                        }
                    }),
                providesTags: [
                    "Chat"
                ]
            }),
            sendChatMessage: builder.mutation({
                query: ({ conversationId, recipientId, content })=>({
                        url: `/chat/conversations/${conversationId}/messages`,
                        method: "POST",
                        body: {
                            content,
                            recipientId
                        }
                    }),
                invalidatesTags: [
                    "Chat"
                ]
            }),
            markChatConversationRead: builder.mutation({
                query: (conversationId)=>({
                        url: `/chat/conversations/${conversationId}/read`,
                        method: "POST"
                    }),
                invalidatesTags: [
                    "Chat"
                ]
            }),
            getFeedPosts: builder.query({
                query: ()=>({
                        url: "/posts/feed",
                        method: "GET"
                    }),
                providesTags: [
                    "Posts"
                ]
            }),
            getPostById: builder.query({
                query: (postId)=>({
                        url: `/posts/${postId}`,
                        method: "GET"
                    }),
                providesTags: [
                    "Posts"
                ]
            }),
            updateProfileMedia: builder.mutation({
                query: (body)=>({
                        url: "/auth/me",
                        method: "PATCH",
                        body
                    }),
                invalidatesTags: [
                    "Auth",
                    "Profile"
                ]
            }),
            getMyProfile: builder.query({
                query: ()=>({
                        url: "/profile/me",
                        method: "GET"
                    }),
                providesTags: [
                    "Profile"
                ]
            }),
            getProfileById: builder.query({
                query: (userId)=>({
                        url: `/profile/${userId}`,
                        method: "GET"
                    }),
                providesTags: [
                    "Profile"
                ]
            }),
            getDiscoverPeople: builder.query({
                query: (params)=>({
                        url: "/profile/discover/people",
                        method: "GET",
                        params: params?.limit ? {
                            limit: params.limit
                        } : undefined
                    }),
                providesTags: [
                    "Profile"
                ]
            }),
            toggleFollowUser: builder.mutation({
                query: (userId)=>({
                        url: `/profile/${userId}/follow`,
                        method: "POST"
                    }),
                invalidatesTags: [
                    "Profile",
                    "Auth"
                ]
            }),
            updateMyProfile: builder.mutation({
                query: (body)=>({
                        url: "/profile/me",
                        method: "PATCH",
                        body
                    }),
                invalidatesTags: [
                    "Auth",
                    "Profile"
                ]
            }),
            uploadProfileAsset: builder.mutation({
                queryFn: async ({ file, kind })=>{
                    if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
                        return {
                            error: {
                                status: 500,
                                data: {
                                    message: "Cloudinary upload is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET."
                                }
                            }
                        };
                    }
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("upload_preset", cloudinaryUploadPreset);
                    formData.append("folder", getCloudinaryFolder(kind));
                    formData.append("public_id", `${kind}-${Date.now()}`);
                    try {
                        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`, {
                            method: "POST",
                            body: formData,
                            cache: "no-store"
                        });
                        const payload = await response.json().catch(()=>({}));
                        if (!response.ok || !payload.secure_url || !payload.public_id || !payload.resource_type) {
                            return {
                                error: {
                                    status: response.status || 500,
                                    data: {
                                        message: payload?.error?.message || "Cloudinary upload failed."
                                    }
                                }
                            };
                        }
                        return {
                            data: {
                                kind: getUploadResponseKind(kind),
                                publicId: payload.public_id,
                                resourceType: payload.resource_type,
                                url: payload.secure_url,
                                bytes: Number(payload.bytes || file.size),
                                width: payload.width ?? null,
                                height: payload.height ?? null,
                                originalFilename: payload.original_filename || file.name
                            }
                        };
                    } catch (error) {
                        return {
                            error: {
                                status: "FETCH_ERROR",
                                error: error instanceof Error && error.message ? error.message : "Upload request failed."
                            }
                        };
                    }
                }
            }),
            createPost: builder.mutation({
                query: (body)=>({
                        url: "/posts",
                        method: "POST",
                        body
                    }),
                invalidatesTags: [
                    "Posts",
                    "Profile"
                ]
            }),
            reactToPost: builder.mutation({
                query: ({ postId, reactionType })=>({
                        url: `/posts/${postId}/reactions`,
                        method: "POST",
                        body: {
                            reactionType
                        }
                    }),
                invalidatesTags: [
                    "Posts",
                    "Profile"
                ]
            }),
            togglePostLike: builder.mutation({
                query: (postId)=>({
                        url: `/posts/${postId}/like`,
                        method: "POST"
                    }),
                invalidatesTags: [
                    "Posts",
                    "Profile"
                ]
            }),
            addPostComment: builder.mutation({
                query: ({ postId, message })=>({
                        url: `/posts/${postId}/comments`,
                        method: "POST",
                        body: {
                            message
                        }
                    }),
                invalidatesTags: [
                    "Posts",
                    "Profile"
                ]
            }),
            sharePost: builder.mutation({
                query: (postId)=>({
                        url: `/posts/${postId}/share`,
                        method: "POST"
                    }),
                invalidatesTags: [
                    "Posts",
                    "Profile"
                ]
            })
        })
});
const { useSignupMutation, useLoginMutation, useGetCurrentUserQuery, useGetChatConversationsQuery, useGetChatContactsQuery, useGetOrCreateChatConversationMutation, useGetChatMessagesQuery, useSendChatMessageMutation, useMarkChatConversationReadMutation, useGetFeedPostsQuery, useGetPostByIdQuery, useUpdateProfileMediaMutation, useGetMyProfileQuery, useGetProfileByIdQuery, useGetDiscoverPeopleQuery, useToggleFollowUserMutation, useUpdateMyProfileMutation, useUploadProfileAssetMutation, useCreatePostMutation, useReactToPostMutation, useTogglePostLikeMutation, useAddPostCommentMutation, useSharePostMutation } = authApi;
}),
"[project]/lib/store.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "makeStore",
    ()=>makeStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@reduxjs/toolkit/dist/redux-toolkit.modern.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/authApi.ts [app-ssr] (ecmascript)");
;
;
const makeStore = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$reduxjs$2f$toolkit$2f$dist$2f$redux$2d$toolkit$2e$modern$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["configureStore"])({
        reducer: {
            [__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].reducerPath]: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].reducer
        },
        middleware: (getDefaultMiddleware)=>getDefaultMiddleware().concat(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"].middleware)
    });
}),
"[project]/app/providers.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-redux/dist/react-redux.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/store.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/services/authApi.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function Providers({ children }) {
    const bundleRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    // In development, Fast Refresh can preserve this component while the RTK Query
    // API slice module is replaced. Rebuild the store when that happens so the
    // reducer and middleware stay aligned with the latest endpoint definitions.
    if (!bundleRef.current || bundleRef.current.apiSlice !== __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"]) {
        bundleRef.current = {
            apiSlice: __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$services$2f$authApi$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["authApi"],
            store: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$store$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["makeStore"])()
        };
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$redux$2f$dist$2f$react$2d$redux$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"], {
        store: bundleRef.current.store,
        children: children
    }, void 0, false, {
        fileName: "[project]/app/providers.tsx",
        lineNumber: 31,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__dc0b57be._.js.map