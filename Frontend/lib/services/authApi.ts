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
  username?: string;
  name?: string;
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

export type PostReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry" | "dislike";

export type PostReactionItem = {
  id: string;
  userId: string;
  name: string;
  handle?: string;
  image?: string;
  type: PostReactionType;
  createdAt?: string | null;
};

export type PostReactionsResponse = {
  message?: string;
  reactions: PostReactionItem[];
  reactionCounts: Record<PostReactionType, number>;
  topReactions: PostReactionType[];
  totalCount: number;
};

export type PostStats = {
  viewCount: number;
  likeCount: number;
  dislikeCount?: number;
  commentCount: number;
  shareCount: number;
  likedByViewer: boolean;
  dislikedByViewer?: boolean;
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
  reactions?: PostReactionItem[];
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
  reactions?: PostReactionItem[];
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
  groupId?: string | null;
};

export type CreatePostResponse = {
  message: string;
  post: FeedPost;
  timelinePost: ProfileTimelinePost;
};

export type UpdatePostPayload = {
  postId: string;
  title?: string;
  content?: string;
  description?: string;
  feeling?: string | null;
  location?: string | null;
  attachmentUrl?: string | null;
  attachmentType?: PostAttachmentType | null;
  attachmentName?: string | null;
  displayImageUrl?: string | null;
  videoUrl?: string | null;
  linkUrl?: string | null;
  activityLabel?: string | null;
  commentsOpen?: boolean;
  audience?: PostAudience;
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
  fullName?: string;
  username?: string;
  headline?: string;
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
  kind: "avatar" | "cover" | "post" | "video" | "story";
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
    case "story":
      return "extremis/stories";
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

export type EventCategory =
  | "Conferences"
  | "Workshops"
  | "Tech & AI"
  | "Social & Campus"
  | "Webinars";

export type EventRsvpStatus = "going" | "interested" | "none";

export type EventDto = {
  id: string;
  title: string;
  organizer: string;
  organizerAvatar: string;
  category: EventCategory | string;
  month: string;
  day: string;
  fullDate: string;
  time: string;
  location: string;
  isOnline: boolean;
  coverImage: string;
  description: string;
  interestedCount: number;
  goingCount: number;
  isInterested: boolean;
  isGoing: boolean;
  attendees: string[];
  date: string;
};

export type EventsResponse = {
  events: EventDto[];
};

export type GetEventResponse = {
  event: EventDto;
};

export type CreateEventPayload = {
  title: string;
  category: EventCategory | string;
  date: string;
  time: string;
  location: string;
  isOnline: boolean;
  description: string;
  coverImage?: string | null;
};

export type CreateEventResponse = {
  message: string;
  event: EventDto;
};

export type SetEventRsvpPayload = {
  eventId: string;
  status: EventRsvpStatus;
};

export type SetEventRsvpResponse = {
  message: string;
  event: EventDto;
};

export type SearchDepartmentDto = {
  name: string;
  shortName: string;
  faculty: string;
  membersCount: number;
};

export type SearchMemberDto = {
  id: string;
  name: string;
  handle: string;
  email: string;
  department: string;
  institute: string;
  position: string;
  avatarUrl: string;
  isFollowing?: boolean;
};

export type SearchPhotoDto = {
  id: string;
  src: string;
  title?: string | null;
  author?: string;
};

export type SearchVideoDto = {
  id: string;
  title: string;
  src: string;
  poster?: string;
  authorName: string;
  published: string;
  views: number;
};

export type SearchGroupDto = {
  id: string;
  name: string;
  handle: string;
  description: string;
  category: string;
  memberCount: number;
  memberCountDisplay: string;
  coverUrl: string;
  iconUrl: string;
  isMember?: boolean;
};

export type SearchResponse = {
  query: string;
  category: string;
  counts: {
    all: number;
    posts: number;
    departments: number;
    members: number;
    photos: number;
    videos: number;
    groups: number;
  };
  posts: FeedPost[];
  members: SearchMemberDto[];
  departments: SearchDepartmentDto[];
  photos: SearchPhotoDto[];
  videos: SearchVideoDto[];
  groups: SearchGroupDto[];
};

export type SidebarSponsor = {
  id: string;
  title: string;
  imageUrl: string | null;
  href: string;
  domain: string;
};

export type SidebarSponsorsResponse = {
  sponsors: SidebarSponsor[];
};

export type SidebarPeopleResponse = {
  people: ProfilePersonCard[];
};

export type SetFollowPayload = {
  userId: string;
  following: boolean;
};

export type GroupPostsResponse = {
  message?: string;
  posts: FeedPost[];
};

export type CreateGroupPayload = {
  name: string;
  description?: string;
  category?: string;
  isPrivate?: boolean;
};

export type CreateGroupResponse = {
  message: string;
  group: GroupDto;
};

export type MarkGroupReadPayload = {
  groupId: string;
  readThrough: string;
};

export type MarkGroupReadResponse = {
  message: string;
};

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Auth", "Profile", "Posts", "Chat", "Stories", "Groups", "Events", "Sidebar"],
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
      // A group post also changes the group feed, so Groups is refreshed too.
      invalidatesTags: (_result, _error, arg) =>
        arg?.groupId ? ["Posts", "Profile", "Groups"] : ["Posts", "Profile"],
    }),
    updatePost: builder.mutation<CreatePostResponse, UpdatePostPayload>({
      query: ({ postId, ...body }) => ({
        url: `/posts/${postId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Posts", "Profile", "Groups"],
    }),
    deletePost: builder.mutation<{ message: string; postId: string }, string>({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Posts", "Profile", "Groups"],
    }),
    getPostById: builder.query<GetPostResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}`,
        method: "GET",
      }),
      providesTags: ["Posts"],
    }),
    getPostReactions: builder.query<PostReactionsResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}/reactions`,
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
    // Accepts either a plain userId (legacy toggle callers) or a desired-state
    // payload so follow buttons cannot drift out of sync with the server.
    toggleFollowUser: builder.mutation<ToggleFollowUserResponse, string | SetFollowPayload>({
      query: (arg) => {
        const userId = typeof arg === "string" ? arg : arg.userId;
        const following = typeof arg === "string" ? undefined : arg.following;

        return {
          url: `/profile/${userId}/follow`,
          method: "POST",
          ...(following === undefined ? {} : { body: { following } }),
        };
      },
      invalidatesTags: ["Profile", "Auth", "Sidebar"],
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
              resourceType: file.type.startsWith("video/") ? "video" : "image",
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
    getMyGroups: builder.query<GroupsResponse, void>({
      query: () => "/groups/me",
      providesTags: ["Groups"],
    }),
    getSuggestedGroups: builder.query<GroupsResponse, void>({
      query: () => "/groups/discover",
      providesTags: ["Groups"],
    }),
    getGroupById: builder.query<{ message: string; group: GroupDto }, string>({
      query: (groupId) => `/groups/${groupId}`,
      providesTags: ["Groups"],
    }),
    joinGroup: builder.mutation<GroupActionResponse, string>({
      query: (groupId) => ({
        url: `/groups/${groupId}/join`,
        method: "POST",
      }),
      invalidatesTags: ["Groups"],
    }),
    leaveGroup: builder.mutation<GroupActionResponse, string>({
      query: (groupId) => ({
        url: `/groups/${groupId}/leave`,
        method: "POST",
      }),
      invalidatesTags: ["Groups"],
    }),
    createGroup: builder.mutation<CreateGroupResponse, CreateGroupPayload>({
      query: (body) => ({
        url: "/groups",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Groups"],
    }),
    getGroupPosts: builder.query<GroupPostsResponse, string | void>({
      query: (groupId) => ({
        url: "/groups/posts",
        method: "GET",
        params: groupId ? { groupId } : undefined,
      }),
      providesTags: ["Groups"],
    }),
    markGroupRead: builder.mutation<MarkGroupReadResponse, MarkGroupReadPayload>({
      query: ({ groupId, readThrough }) => ({
        url: `/groups/${groupId}/read`,
        method: "POST",
        body: { readThrough },
      }),
      invalidatesTags: ["Groups"],
    }),
    getEvents: builder.query<EventsResponse, { limit?: number; upcoming?: boolean } | void>({
      query: (params) => ({
        url: "/events",
        method: "GET",
        params: {
          ...(params?.limit != null ? { limit: params.limit } : {}),
          ...(params?.upcoming ? { upcoming: "true" } : {}),
        },
      }),
      providesTags: ["Events"],
    }),
    getEvent: builder.query<GetEventResponse, string>({
      query: (eventId) => ({
        url: `/events/${eventId}`,
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    createEvent: builder.mutation<CreateEventResponse, CreateEventPayload>({
      query: (body) => ({
        url: "/events",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Events"],
    }),
    setEventRsvp: builder.mutation<SetEventRsvpResponse, SetEventRsvpPayload>({
      query: ({ eventId, status }) => ({
        url: `/events/${eventId}/rsvp`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Events"],
    }),
    getSidebarSponsors: builder.query<SidebarSponsorsResponse, void>({
      query: () => ({
        url: "/sidebar/sponsors",
        method: "GET",
      }),
      providesTags: ["Sidebar"],
    }),
    getSidebarPeople: builder.query<SidebarPeopleResponse, void>({
      query: () => ({
        url: "/sidebar/people",
        method: "GET",
      }),
      providesTags: ["Sidebar"],
    }),
    pingHealth: builder.query<{ ok: boolean; service: string; db?: string; timestamp: string }, void>({
      query: () => "/health",
    }),
    searchEverything: builder.query<SearchResponse, { q?: string; category?: string; limit?: number } | void>({
      query: (params) => ({
        url: "/search",
        method: "GET",
        params: params || undefined,
      }),
      providesTags: ["Posts", "Profile", "Groups"],
    }),
  }),
});

export type GroupDto = {
  _id: string;
  id: string;
  name: string;
  handle: string;
  description?: string;
  category?: string;
  iconUrl?: string;
  coverUrl?: string;
  memberCountDisplay?: string;
  membersCount: number;
  isJoined: boolean;
  isPrivate?: boolean;
  notificationsCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type GroupsResponse = {
  message: string;
  groups: GroupDto[];
};

export type GroupActionResponse = {
  message: string;
  isJoined: boolean;
  group: GroupDto;
};

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
  useGetPostReactionsQuery,
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
  useUpdatePostMutation,
  useDeletePostMutation,
  useReactToPostMutation,
  useTogglePostLikeMutation,
  useAddPostCommentMutation,
  useSharePostMutation,
  useCreateOrderMutation,
  useGetStoriesQuery,
  useCreateStoryMutation,
  useViewStoryMutation,
  useDeleteStoryMutation,
  useGetMyGroupsQuery,
  useGetSuggestedGroupsQuery,
  useGetGroupByIdQuery,
  useJoinGroupMutation,
  useLeaveGroupMutation,
  useGetEventsQuery,
  useGetEventQuery,
  useCreateEventMutation,
  useSetEventRsvpMutation,
  usePingHealthQuery,
  useSearchEverythingQuery,
} = authApi;

