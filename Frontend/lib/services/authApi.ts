import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_STORAGE_KEY } from "@/lib/auth/constants";

const rawApiBaseUrl = String(process.env.NEXT_PUBLIC_API_URL || "").trim();

function normalizeApiRoot(value: string): string {
  const normalizedApiBaseUrl = String(value || "").trim().replace(/\/+$/, "");

  if (!normalizedApiBaseUrl) {
    return "";
  }

  return normalizedApiBaseUrl.endsWith("/api")
    ? normalizedApiBaseUrl
    : `${normalizedApiBaseUrl}/api`;
}

function resolveApiRoot() {
  const configuredApiRoot = normalizeApiRoot(rawApiBaseUrl);

  if (typeof window !== "undefined") {
    const pageHost = String(window.location.hostname || "").trim().toLowerCase();
    const isLocalPage = pageHost === "localhost" || pageHost === "127.0.0.1";

    if (isLocalPage) {
      return configuredApiRoot || "http://localhost:4000/api";
    }

    if (configuredApiRoot) {
      return configuredApiRoot;
    }

    return "/api";
  }

  if (configuredApiRoot) {
    return configuredApiRoot;
  }

  return "/api";
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
  phoneNumber?: string;
  gender?: string;
  dateOfBirth?: string;
  location?: string;
  coordinates?: { lat: number; lng: number } | null;
  researcherType?: string;
  institute?: string;
  department?: string;
  position?: string;
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
  username?: string | null;
  researcherType: string | null;
  institute: string | null;
  department: string | null;
  position: string | null;
  gender: string | null;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  bio: string | null;
  location: string | null;
  coordinates?: { lat: number; lng: number } | null;
  dateOfBirth?: string | null;
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
  | "sponsor"
  | "bg";

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
  postType?: PostType;
  title?: string;
  content?: string;
  description?: string;
  attachmentUrl?: string | null;
  attachmentType?: PostAttachmentType | null;
  attachmentName?: string | null;
  image?: string | null;
  images?: string[];
  linkUrl?: string | null;
  videoUrl?: string | null;
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
  activityLabel?: string | null;
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
  kind: "avatar" | "cover" | "post" | "video";
};

export type UploadProfileAssetResponse = {
  kind: "avatar" | "cover" | "upload" | "video";
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
    case "video":
      return "extremis/videos";
    default:
      return "extremis/uploads";
  }
}

function getUploadResponseKind(kind: UploadProfileAssetPayload["kind"]): UploadProfileAssetResponse["kind"] {
  if (kind === "avatar" || kind === "cover" || kind === "video") {
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

export type NearbyPerson = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  username: string | null;
  avatarUrl: string;
  position: string | null;
  department: string | null;
  institute: string | null;
  location: string | null;
  coordinates: { lat: number; lng: number } | null;
  bio: string | null;
  disciplines: string[];
  skills: string[];
  distanceKm: number | null;
  distanceFormatted: string;
  isFollowing: boolean;
  canFollow: boolean;
  profileHref: string;
};

export type NearbyPeopleResponse = {
  message: string;
  origin: { lat: number; lng: number; location: string };
  radiusKm: number | null;
  totalCount: number;
  users: NearbyPerson[];
};

export type NearbyPeopleParams = {
  lat?: number;
  lng?: number;
  radius?: number | string;
  search?: string;
  q?: string;
  limit?: number;
};

export type TourismPlaceItem = {
  id: string;
  _id?: string;
  title: string;
  location: string;
  country: string;
  category: "nature" | "historic" | "beach" | "city" | "research" | "adventure";
  coordinates: { lat: number; lng: number };
  coverImage?: string | null;
  images: string[];
  videoUrl?: string | null;
  description: string;
  highlights: string[];
  bestTimeToVisit?: string;
  likesCount: number;
  isMyPost: boolean;
  author?: {
    _id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    username?: string;
  } | null;
  createdAt?: string;
};

export type TourismPlacesResponse = {
  message: string;
  total: number;
  places: TourismPlaceItem[];
};

export type CreateTourismPlacePayload = {
  title: string;
  location: string;
  country: string;
  category: string;
  lat: number;
  lng: number;
  coverImage?: string | null;
  images?: string[];
  videoUrl?: string | null;
  description: string;
  highlights?: string[];
  bestTimeToVisit?: string;
};

export type StoryItem = {
  id: string;
  authorId: string | null;
  authorName: string;
  authorAvatar: string;
  authorHeadline: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  caption: string;
  viewsCount: number;
  createdAt: string;
  isMine: boolean;
  isViewed: boolean;
};

export type StoriesResponse = {
  message: string;
  stories: StoryItem[];
};

export type CreateStoryPayload = {
  mediaUrl: string;
  mediaType?: "image" | "video";
  caption?: string;
};

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Auth", "Profile", "Posts", "Chat", "Stories"],
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
    createPost: builder.mutation<CreatePostResponse, CreatePostPayload>({
      query: (body) => ({
        url: "/posts",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts", "Profile"],
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
    getNearbyPeople: builder.query<NearbyPeopleResponse, NearbyPeopleParams | void>({
      query: (params) => ({
        url: "/profile/nearby",
        method: "GET",
        params: params
          ? {
              ...(params.lat != null ? { lat: params.lat } : {}),
              ...(params.lng != null ? { lng: params.lng } : {}),
              ...(params.radius != null ? { radius: params.radius } : {}),
              ...(params.search ? { search: params.search } : {}),
              ...(params.q ? { q: params.q } : {}),
              ...(params.limit ? { limit: params.limit } : {}),
            }
          : undefined,
      }),
      providesTags: ["Profile"],
    }),
    getTourismPlaces: builder.query<TourismPlacesResponse, { category?: string; search?: string; myOnly?: boolean } | void>({
      query: (params) => ({
        url: "/tourism",
        method: "GET",
        params: params
          ? {
              ...(params.category && params.category !== "all" ? { category: params.category } : {}),
              ...(params.search ? { search: params.search } : {}),
              ...(params.myOnly ? { myOnly: "true" } : {}),
            }
          : undefined,
      }),
      providesTags: ["Posts"],
    }),
    createTourismPlace: builder.mutation<{ message: string; place: TourismPlaceItem }, CreateTourismPlacePayload>({
      query: (body) => ({
        url: "/tourism",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
    updateTourismPlace: builder.mutation<{ message: string; place: TourismPlaceItem }, { id: string; body: Partial<CreateTourismPlacePayload> }>({
      query: ({ id, body }) => ({
        url: `/tourism/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Posts"],
    }),
    deleteTourismPlace: builder.mutation<{ message: string; id: string }, string>({
      query: (id) => ({
        url: `/tourism/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts"],
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
        let token: string | null = null;
        if (typeof window !== "undefined") {
          try {
            token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
          } catch {
            token = null;
          }
          if (!token) {
            token = readCookie(AUTH_COOKIE_NAME);
          }
        }

        // 1. Try uploading to backend /uploads endpoint
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("kind", kind);

          const headers: Record<string, string> = {};
          if (token) {
            headers["authorization"] = `Bearer ${token}`;
          }

          const backendRes = await fetch(`${resolvedApiRoot}/uploads`, {
            method: "POST",
            headers,
            body: formData,
          });

          if (backendRes.ok) {
            const data = await backendRes.json();
            if (data?.url) {
              return {
                data: {
                  kind: getUploadResponseKind(kind),
                  publicId: data.publicId || `${kind}-${Date.now()}`,
                  resourceType: data.resourceType || "image",
                  url: data.url,
                  bytes: Number(data.bytes || file.size),
                  width: data.width ?? null,
                  height: data.height ?? null,
                  originalFilename: data.originalFilename || file.name,
                },
              };
            }
          }
        } catch {
          // Backend endpoint failed or unreachable, continue to fallbacks
        }

        // 2. Try direct Cloudinary client-side upload if keys are present
        if (cloudinaryCloudName && cloudinaryUploadPreset) {
          try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", cloudinaryUploadPreset);
            formData.append("folder", getCloudinaryFolder(kind));
            formData.append("public_id", `${kind}-${Date.now()}`);

            const response = await fetch(
              `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/auto/upload`,
              {
                method: "POST",
                body: formData,
                cache: "no-store",
              }
            );

            const payload = (await response.json().catch(() => ({}))) as CloudinaryUploadResponse;
            if (response.ok && payload.secure_url) {
              return {
                data: {
                  kind: getUploadResponseKind(kind),
                  publicId: payload.public_id || `${kind}-${Date.now()}`,
                  resourceType: payload.resource_type || "image",
                  url: payload.secure_url,
                  bytes: Number(payload.bytes || file.size),
                  width: payload.width ?? null,
                  height: payload.height ?? null,
                  originalFilename: payload.original_filename || file.name,
                },
              };
            }
          } catch {
            // Client upload failed, continue to Data URL fallback
          }
        }

        // 3. Fallback to Data URL so avatar/cover updates immediately and persists to MongoDB
        try {
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          return {
            data: {
              kind: getUploadResponseKind(kind),
              publicId: `${kind}-${Date.now()}`,
              resourceType: "image",
              url: dataUrl,
              bytes: file.size,
              width: null,
              height: null,
              originalFilename: file.name,
            },
          };
        } catch (error) {
          return {
            error: {
              status: "FETCH_ERROR",
              error: error instanceof Error ? error.message : "Failed to process image.",
            },
          };
        }
      },
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
    getStories: builder.query<StoriesResponse, void>({
      query: () => ({
        url: "/stories",
        method: "GET",
      }),
      providesTags: ["Stories"],
    }),
    createStory: builder.mutation<{ message: string; story: StoryItem }, CreateStoryPayload>({
      query: (body) => ({
        url: "/stories",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Stories"],
    }),
    viewStory: builder.mutation<{ message: string; viewsCount: number }, string>({
      query: (storyId) => ({
        url: `/stories/${storyId}/view`,
        method: "POST",
      }),
    }),
    deleteStory: builder.mutation<{ message: string; id: string }, string>({
      query: (storyId) => ({
        url: `/stories/${storyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Stories"],
    }),
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderPayload>({
      query: (body) => ({
        url: "/orders",
        method: "POST",
        body,
      }),
    }),
  }),
});

export type CreateOrderPayload = {
  items: {
    itemId: string;
    name: string;
    price: number;
    qty: number;
    img?: string;
    type?: string;
  }[];
  billingDetails: {
    firstName: string;
    lastName: string;
    email: string;
    country?: string;
    state?: string;
    zipCode?: string;
    specialNotes?: string;
  };
  courier?: {
    name: string;
    cost: number;
    eta?: string;
  };
  payment?: {
    method: string;
    cardLast4?: string;
    cardHolder?: string;
    cryptoAddress?: string;
  };
  pricing: {
    subtotal: number;
    discount?: number;
    shipping?: number;
    tax?: number;
    grandTotal: number;
    couponCode?: string;
  };
};

export type CreateOrderResponse = {
  ok: boolean;
  message: string;
  order: {
    _id: string;
    orderNumber: string;
    status: string;
    pricing: {
      subtotal: number;
      discount: number;
      shipping: number;
      tax: number;
      grandTotal: number;
      couponCode: string;
    };
    createdAt: string;
  };
};

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
  useGetNearbyPeopleQuery,
  useGetTourismPlacesQuery,
  useCreateTourismPlaceMutation,
  useUpdateTourismPlaceMutation,
  useDeleteTourismPlaceMutation,
  useToggleFollowUserMutation,
  useUpdateMyProfileMutation,
  useUploadProfileAssetMutation,
  useCreatePostMutation,
  useReactToPostMutation,
  useTogglePostLikeMutation,
  useAddPostCommentMutation,
  useSharePostMutation,
  useCreateOrderMutation,
  useGetStoriesQuery,
  useCreateStoryMutation,
  useViewStoryMutation,
  useDeleteStoryMutation,
} = authApi;

