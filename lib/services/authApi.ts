import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_STORAGE_KEY } from "@/lib/auth/constants";

const rawApiBaseUrl = String(process.env.NEXT_PUBLIC_API_URL || "").trim();
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");
const envApiRoot = normalizedApiBaseUrl
  ? normalizedApiBaseUrl.endsWith("/api")
    ? normalizedApiBaseUrl
    : `${normalizedApiBaseUrl}/api`
  : "/api";

function resolveApiRoot() {
  if (typeof window === "undefined") {
    return envApiRoot;
  }

  const pageHost = String(window.location.hostname || "").trim().toLowerCase();
  const pageOrigin = String(window.location.origin || "").trim().toLowerCase();
  const isLocalPage = pageHost === "localhost" || pageHost === "127.0.0.1";

  if (!envApiRoot || envApiRoot === "/api") {
    return "/api";
  }

  try {
    const parsedApiRoot = new URL(envApiRoot);
    const apiOrigin = parsedApiRoot.origin.toLowerCase();

    // Prevent cross-origin API calls on deployed custom domains.
    if (!isLocalPage && apiOrigin !== pageOrigin) {
      return "/api";
    }

    return envApiRoot;
  } catch {
    return "/api";
  }
}

const resolvedApiRoot = resolveApiRoot();
export const apiBaseUrl = resolvedApiRoot.endsWith("/api")
  ? resolvedApiRoot.slice(0, -4)
  : resolvedApiRoot;
const cloudinaryCloudName = String(process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "").trim();
const cloudinaryUploadPreset = String(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "").trim();

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${name}=`;
  const match = document.cookie.split("; ").find((item) => item.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

export type SignupPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  researcherType?: string;
  institute?: string;
  department?: string;
  position?: string;
  gender?: string;
  termsAccepted: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type UserDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  researcherType: string | null;
  institute: string | null;
  department: string | null;
  position: string | null;
  gender: string | null;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  bio: string | null;
  location: string | null;
  website: string | null;
  phoneNumber: string | null;
  skypeId: string | null;
  localTime: string | null;
  disciplines: string[];
  skills: string[];
  createdAt: string;
};

export type ChatRole = "student" | "ngo" | "medical" | "other";
export type ChatPresence = "online" | "away" | "offline";

export type ChatParticipantDto = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  status: ChatPresence;
  role: ChatRole;
  roleLabel: string;
  location: string | null;
  institute: string | null;
  department: string | null;
  phoneNumber: string | null;
  skypeId: string | null;
  localTime: string | null;
  conversationId?: string | null;
};

export type ChatConversationDto = {
  conversationId: string;
  lastMessageText: string | null;
  lastMessageSenderRole: ChatRole | null;
  lastMessageAt: string | null;
  unreadCount: number;
  participant: ChatParticipantDto;
};

export type ChatMessageDto = {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: ChatRole;
  content: string;
  readByViewer: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ChatConversationsResponse = {
  total: number;
  page: number;
  limit: number;
  data: ChatConversationDto[];
};

export type ChatContactsResponse = {
  data: ChatParticipantDto[];
};

export type ChatMessagesResponse = {
  conversationId?: string;
  data: ChatMessageDto[];
  limit: number;
};

export type GetOrCreateConversationPayload = {
  recipientId: string;
};

export type GetOrCreateConversationResponse = {
  message: string;
  conversationId: string;
  participant: ChatParticipantDto;
};

export type SendChatMessagePayload = {
  conversationId: string;
  recipientId: string;
  content: string;
};

export type MarkChatConversationReadResponse = {
  message: string;
};

export type PostAudience =
  | "public"
  | "private"
  | "specific-friend"
  | "only-friends"
  | "joined-groups";

export type PostAttachmentType = "image" | "video" | "file";
export type PostType =
  | "custom"
  | "article"
  | "premium"
  | "image"
  | "album"
  | "link"
  | "video"
  | "gif"
  | "audio"
  | "sponsor";

export type PostAudioSource = {
  url: string;
  mimeType?: string | null;
};

export type SponsorItemDto = {
  id: string;
  title: string;
  image: string | null;
  priceLabel?: string | null;
  href?: string | null;
  ctaLabel?: string | null;
  shareLabel?: string | null;
  likeLabel?: string | null;
};

export type PostCommentDto = {
  id: string;
  userId: string | null;
  name: string;
  image: string;
  time: string;
  message: string;
};

export type PostReactionType = "like" | "love" | "haha" | "wow" | "sad";

export type PostStats = {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  likedByViewer: boolean;
  viewerReaction?: PostReactionType | null;
  reactionCounts?: Record<PostReactionType, number>;
  topReactions?: PostReactionType[];
};

export type AuthResponse = {
  message: string;
  token?: string;
  user: UserDto;
};

export type CurrentUserResponse = {
  message?: string;
  user: UserDto;
};

export type UpdateProfileMediaPayload = {
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
};

export type ProfilePersonCard = {
  id?: string;
  profileHref?: string;
  name: string;
  subtitle: string;
  image: string;
  actionLabel: string;
  isFollowing?: boolean;
  canFollow?: boolean;
};

export type ProfileVideoCard = {
  href: string;
  image: string;
  name: string;
  meta: string;
  views: string;
};

export type ProfileComment = {
  name: string;
  image: string;
  time: string;
  message: string;
  link?: string;
};

export type ProfileTimelinePost = {
  id: string;
  type: PostType;
  authorId?: string | null;
  authorName: string;
  authorImage: string;
  activity: string;
  published: string;
  title?: string;
  content?: string;
  description?: string;
  href?: string;
  image?: string;
  images?: string[];
  morePhotosCount?: number;
  ctaLabel?: string;
  ctaHref?: string;
  embedUrl?: string;
  audioSources?: PostAudioSource[];
  sponsorItems?: SponsorItemDto[];
  gifPreview?: string;
  gifDataUrl?: string;
  fetchedImageLabel?: string;
  emojiCount?: string;
  commentsOpen?: boolean;
  attachmentUrl?: string | null;
  attachmentType?: PostAttachmentType | null;
  attachmentName?: string | null;
  linkUrl?: string | null;
  videoUrl?: string | null;
  audience?: PostAudience;
  scheduledFor?: string | null;
  createdAt?: string;
  status?: "published" | "scheduled";
  comments?: PostCommentDto[];
  stats?: PostStats;
};

export type FeedPost = {
  id: string;
  type: PostType;
  authorId: string | null;
  authorName: string;
  authorHandle: string;
  authorImage: string;
  activity: string;
  published: string;
  title?: string | null;
  content: string;
  description?: string;
  href?: string;
  image?: string | null;
  images?: string[];
  morePhotosCount?: number;
  attachmentUrl: string | null;
  attachmentType: PostAttachmentType | null;
  attachmentName: string | null;
  linkUrl: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  fetchedImageLabel?: string | null;
  embedUrl: string | null;
  videoUrl: string | null;
  audioSources?: PostAudioSource[];
  sponsorItems?: SponsorItemDto[];
  gifPreview?: string | null;
  gifDataUrl?: string | null;
  commentsOpen?: boolean;
  audience: PostAudience;
  activityFeed: boolean;
  myStory: boolean;
  scheduledFor: string | null;
  createdAt: string;
  status: "published" | "scheduled";
  comments: PostCommentDto[];
  stats: PostStats;
};

export type FeedPostsResponse = {
  message: string;
  posts: FeedPost[];
};

export type GetPostResponse = {
  message: string;
  post: FeedPost;
};

export type CreatePostPayload = {
  type?: PostType;
  title?: string;
  content?: string;
  description?: string;
  attachmentUrl?: string | null;
  attachmentType?: PostAttachmentType | null;
  attachmentName?: string | null;
  image?: string | null;
  images?: string[];
  linkUrl?: string | null;
  href?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  fetchedImageLabel?: string | null;
  gifPreviewUrl?: string | null;
  gifDataUrl?: string | null;
  audioSources?: PostAudioSource[];
  sponsorItems?: Array<{
    title: string;
    imageUrl?: string | null;
    priceLabel?: string | null;
    href?: string | null;
    ctaLabel?: string | null;
    shareLabel?: string | null;
    likeLabel?: string | null;
  }>;
  morePhotosCount?: number;
  commentsOpen?: boolean;
  activity?: string | null;
  audience?: PostAudience;
  activityFeed?: boolean;
  myStory?: boolean;
  scheduledFor?: string | null;
};

export type CreatePostResponse = {
  message: string;
  post: FeedPost;
  timelinePost: ProfileTimelinePost;
};

export type UpdatePostInteractionResponse = {
  message: string;
  post: FeedPost;
};

export type ReactToPostPayload = {
  postId: string;
  reactionType: PostReactionType;
};

export type AddPostCommentPayload = {
  postId: string;
  message: string;
};

export type ProfileEvent = {
  id: string;
  title: string;
  iconClass: string;
  themeClass: string;
  image: string;
  href?: string;
};

export type ProfileDashboard = {
  user: UserDto;
  fullName: string;
  handle: string;
  institute: string;
  department: string;
  position: string;
  researcherType: string;
  gender: string;
  avatarUrl: string;
  coverImageUrl: string;
  location: string;
  joined: string;
  completion: number;
  disciplines: string[];
  skills: string[];
  bio: string;
  headline: string;
  contact: {
    emailAddress: string;
    phoneNumber: string;
    skypeId: string;
    website: string;
    localTime: string;
  };
  analytics: {
    profileCompletion: number;
    researcherType: string;
    institute: string;
    joined: string;
    followerCount: number;
    followingCount: number;
  };
};

export type ProfileDashboardResponse = {
  message: string;
  profile: ProfileDashboard;
  timeline: ProfileTimelinePost[];
  network: {
    followers: ProfilePersonCard[];
    following: ProfilePersonCard[];
    suggestions: ProfilePersonCard[];
    whoIsFollowing: ProfilePersonCard[];
  };
  media: {
    videos: ProfileVideoCard[];
    researchImages: string[];
  };
  events: ProfileEvent[];
  comments: ProfileComment[];
};

export type UpdateMyProfilePayload = {
  firstName?: string;
  lastName?: string;
  researcherType?: string | null;
  institute?: string | null;
  department?: string | null;
  position?: string | null;
  gender?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  phoneNumber?: string | null;
  skypeId?: string | null;
  localTime?: string | null;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  disciplines?: string[] | string;
  skills?: string[] | string;
};

export type UploadProfileAssetPayload = {
  file: File;
  kind: "avatar" | "cover" | "post";
};

export type UploadProfileAssetResponse = {
  kind: "avatar" | "cover" | "upload";
  publicId: string;
  resourceType: string;
  url: string;
  bytes: number;
  width: number | null;
  height: number | null;
  originalFilename: string;
};

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  resource_type?: string;
  bytes?: number;
  width?: number | null;
  height?: number | null;
  original_filename?: string;
  error?: {
    message?: string;
  };
};

function getCloudinaryFolder(kind: UploadProfileAssetPayload["kind"]): string {
  switch (kind) {
    case "avatar":
      return "extremis/avatars";
    case "cover":
      return "extremis/covers";
    default:
      return "extremis/uploads";
  }
}

function getUploadResponseKind(kind: UploadProfileAssetPayload["kind"]): UploadProfileAssetResponse["kind"] {
  if (kind === "avatar" || kind === "cover") {
    return kind;
  }

  return "upload";
}

export type ToggleFollowUserResponse = {
  message: string;
  targetUserId: string;
  isFollowing: boolean;
};

export type DiscoverPeopleResponse = {
  message: string;
  users: ProfilePersonCard[];
};

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Auth", "Profile", "Posts", "Chat"],
  baseQuery: fetchBaseQuery({
    baseUrl: resolvedApiRoot,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        let token: string | null = null;

        try {
          token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
        } catch {
          token = null;
        }

        if (!token) {
          token = readCookie(AUTH_COOKIE_NAME);
        }

        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, SignupPayload>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),
    login: builder.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),
    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["Auth"],
    }),
    getChatConversations: builder.query<
      ChatConversationsResponse,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/chat/conversations",
        method: "GET",
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 20,
        },
      }),
      providesTags: ["Chat"],
    }),
    getChatContacts: builder.query<ChatContactsResponse, { search?: string } | void>({
      query: (params) => ({
        url: "/chat/contacts",
        method: "GET",
        params: params?.search ? { search: params.search } : undefined,
      }),
      providesTags: ["Chat"],
    }),
    getOrCreateChatConversation: builder.mutation<
      GetOrCreateConversationResponse,
      GetOrCreateConversationPayload
    >({
      query: (body) => ({
        url: "/chat/conversations",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat"],
    }),
    getChatMessages: builder.query<
      ChatMessagesResponse,
      { conversationId: string; recipientId?: string; before?: string; limit?: number }
    >({
      query: ({ conversationId, recipientId, before, limit = 200 }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: "GET",
        params: {
          limit,
          ...(recipientId ? { recipientId } : {}),
          ...(before ? { before } : {}),
        },
      }),
      providesTags: ["Chat"],
    }),
    sendChatMessage: builder.mutation<ChatMessageDto, SendChatMessagePayload>({
      query: ({ conversationId, recipientId, content }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: "POST",
        body: { content, recipientId },
      }),
      invalidatesTags: ["Chat"],
    }),
    markChatConversationRead: builder.mutation<
      MarkChatConversationReadResponse,
      string
    >({
      query: (conversationId) => ({
        url: `/chat/conversations/${conversationId}/read`,
        method: "POST",
      }),
      invalidatesTags: ["Chat"],
    }),
    getFeedPosts: builder.query<FeedPostsResponse, void>({
      query: () => ({
        url: "/posts/feed",
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),
    getPostById: builder.query<GetPostResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),
    updateProfileMedia: builder.mutation<CurrentUserResponse, UpdateProfileMediaPayload>({
      query: (body) => ({
        url: "/auth/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),
    getMyProfile: builder.query<ProfileDashboardResponse, void>({
      query: () => ({
        url: "/profile/me",
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    getProfileById: builder.query<ProfileDashboardResponse, string>({
      query: (userId) => ({
        url: `/profile/${userId}`,
        method: "GET",
      }),
      providesTags: ["Profile"],
    }),
    getDiscoverPeople: builder.query<DiscoverPeopleResponse, { limit?: number } | void>({
      query: (params) => ({
        url: "/profile/discover/people",
        method: "GET",
        params: params?.limit ? { limit: params.limit } : undefined,
      }),
      providesTags: ["Profile"],
    }),
    toggleFollowUser: builder.mutation<ToggleFollowUserResponse, string>({
      query: (userId) => ({
        url: `/profile/${userId}/follow`,
        method: "POST",
      }),
      invalidatesTags: ["Profile", "Auth"],
    }),
    updateMyProfile: builder.mutation<ProfileDashboardResponse, UpdateMyProfilePayload>({
      query: (body) => ({
        url: "/profile/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),
    uploadProfileAsset: builder.mutation<UploadProfileAssetResponse, UploadProfileAssetPayload>({
      queryFn: async ({ file, kind }) => {
        if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
          return {
            error: {
              status: 500,
              data: {
                message:
                  "Cloudinary upload is not configured. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.",
              },
            },
          };
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", cloudinaryUploadPreset);
        formData.append("folder", getCloudinaryFolder(kind));
        formData.append("public_id", `${kind}-${Date.now()}`);

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`,
            {
              method: "POST",
              body: formData,
              cache: "no-store",
            }
          );

          const payload = (await response
            .json()
            .catch(() => ({}))) as CloudinaryUploadResponse;

          if (!response.ok || !payload.secure_url || !payload.public_id || !payload.resource_type) {
            return {
              error: {
                status: response.status || 500,
                data: {
                  message: payload?.error?.message || "Cloudinary upload failed.",
                },
              },
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
              originalFilename: payload.original_filename || file.name,
            },
          };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error:
                error instanceof Error && error.message
                  ? error.message
                  : "Upload request failed.",
            },
          };
        }
      },
    }),
    createPost: builder.mutation<CreatePostResponse, CreatePostPayload>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts", "Profile"],
    }),
    reactToPost: builder.mutation<UpdatePostInteractionResponse, ReactToPostPayload>({
      query: ({ postId, reactionType }) => ({
        url: `/posts/${postId}/reactions`,
        method: "POST",
        body: { reactionType },
      }),
      invalidatesTags: ["Posts", "Profile"],
    }),
    togglePostLike: builder.mutation<UpdatePostInteractionResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: "POST",
      }),
      invalidatesTags: ["Posts", "Profile"],
    }),
    addPostComment: builder.mutation<UpdatePostInteractionResponse, AddPostCommentPayload>({
      query: ({ postId, message }) => ({
        url: `/posts/${postId}/comments`,
        method: "POST",
        body: { message },
      }),
      invalidatesTags: ["Posts", "Profile"],
    }),
    sharePost: builder.mutation<UpdatePostInteractionResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}/share`,
        method: "POST",
      }),
      invalidatesTags: ["Posts", "Profile"],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetCurrentUserQuery,
  useGetChatConversationsQuery,
  useGetChatContactsQuery,
  useGetOrCreateChatConversationMutation,
  useGetChatMessagesQuery,
  useSendChatMessageMutation,
  useMarkChatConversationReadMutation,
  useGetFeedPostsQuery,
  useGetPostByIdQuery,
  useUpdateProfileMediaMutation,
  useGetMyProfileQuery,
  useGetProfileByIdQuery,
  useGetDiscoverPeopleQuery,
  useToggleFollowUserMutation,
  useUpdateMyProfileMutation,
  useUploadProfileAssetMutation,
  useCreatePostMutation,
  useReactToPostMutation,
  useTogglePostLikeMutation,
  useAddPostCommentMutation,
  useSharePostMutation,
} = authApi;
