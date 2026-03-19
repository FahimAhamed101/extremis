import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_STORAGE_KEY } from "@/lib/auth/constants";

const rawApiBaseUrl = String(process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").trim();
const normalizedApiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");
export const apiBaseUrl = normalizedApiBaseUrl.endsWith("/api")
  ? normalizedApiBaseUrl.slice(0, -4)
  : normalizedApiBaseUrl;

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

export type PostAudience =
  | "public"
  | "private"
  | "specific-friend"
  | "only-friends"
  | "joined-groups";

export type PostAttachmentType = "image" | "video" | "file";

export type PostCommentDto = {
  id: string;
  userId: string | null;
  name: string;
  image: string;
  time: string;
  message: string;
};

export type PostStats = {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  likedByViewer: boolean;
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
  name: string;
  subtitle: string;
  image: string;
  actionLabel: string;
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
  type: "article" | "premium" | "image" | "album" | "link" | "video" | "gif" | "custom";
  authorName: string;
  authorImage: string;
  activity: string;
  published: string;
  title?: string;
  description?: string;
  href?: string;
  image?: string;
  images?: string[];
  morePhotosCount?: number;
  ctaLabel?: string;
  ctaHref?: string;
  embedUrl?: string;
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
  authorName: string;
  authorHandle: string;
  authorImage: string;
  activity: string;
  published: string;
  content: string;
  attachmentUrl: string | null;
  attachmentType: PostAttachmentType | null;
  attachmentName: string | null;
  linkUrl: string | null;
  embedUrl: string | null;
  videoUrl: string | null;
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

export type CreatePostPayload = {
  content?: string;
  attachmentUrl?: string | null;
  attachmentType?: PostAttachmentType | null;
  attachmentName?: string | null;
  linkUrl?: string | null;
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

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["Auth", "Profile", "Posts"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${apiBaseUrl}/api`,
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token =
          window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || readCookie(AUTH_COOKIE_NAME);

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
    getFeedPosts: builder.query<FeedPostsResponse, void>({
      query: () => ({
        url: "/posts/feed",
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
    updateMyProfile: builder.mutation<ProfileDashboardResponse, UpdateMyProfilePayload>({
      query: (body) => ({
        url: "/profile/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Auth", "Profile"],
    }),
    uploadProfileAsset: builder.mutation<UploadProfileAssetResponse, UploadProfileAssetPayload>({
      query: ({ file, kind }) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("kind", kind);

        return {
          url: "/uploads",
          method: "POST",
          body: formData,
        };
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
  useGetFeedPostsQuery,
  useUpdateProfileMediaMutation,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUploadProfileAssetMutation,
  useCreatePostMutation,
  useTogglePostLikeMutation,
  useAddPostCommentMutation,
  useSharePostMutation,
} = authApi;
