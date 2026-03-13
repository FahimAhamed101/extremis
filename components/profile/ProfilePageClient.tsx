"use client";

import Link from "next/link";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuthSession, setAuthSession } from "@/lib/auth/client";
import {
  AUTH_COOKIE_NAME,
  AUTH_STORAGE_EVENT,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from "@/lib/auth/constants";
import {
  apiBaseUrl,
  useGetCurrentUserQuery,
  useUpdateProfileMediaMutation,
  UserDto,
} from "@/lib/services/authApi";
import styles from "./ProfilePageClient.module.css";

type DetailItem = {
  label: string;
  value: string | null | undefined;
};

type UploadKind = "avatar" | "cover";

type UploadResponse = {
  kind: UploadKind | "upload";
  message?: string;
  url?: string;
};

function readCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const prefix = `${name}=`;
  const match = document.cookie.split("; ").find((item) => item.startsWith(prefix));
  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

function getClientAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || readCookie(AUTH_COOKIE_NAME);
}

function readStoredUser(): UserDto | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawUser) as UserDto;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function getFullName(user: UserDto | null): string {
  if (!user) {
    return "Guest User";
  }

  return `${user.firstName} ${user.lastName}`.trim() || user.email;
}

function getInitials(user: UserDto | null): string {
  if (!user) {
    return "GU";
  }

  const first = String(user.firstName || "").trim().charAt(0);
  const last = String(user.lastName || "").trim().charAt(0);
  const initials = `${first}${last}`.trim().toUpperCase();

  return initials || String(user.email || "GU").slice(0, 2).toUpperCase();
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "Not available";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function formatOptionalValue(value: string | null | undefined, fallback: string): string {
  const normalized = String(value || "").trim();
  return normalized || fallback;
}

function getCompletion(user: UserDto | null): number {
  if (!user) {
    return 0;
  }

  const fields = [
    user.firstName,
    user.lastName,
    user.email,
    user.researcherType,
    user.institute,
    user.department,
    user.position,
    user.gender,
    user.avatarUrl,
    user.coverImageUrl,
  ];
  const completed = fields.filter((field) => String(field || "").trim()).length;
  return Math.round((completed / fields.length) * 100);
}

function getMissingFields(user: UserDto | null): string[] {
  if (!user) {
    return [];
  }

  const fields: Array<[string, string | null | undefined]> = [
    ["Researcher type", user.researcherType],
    ["Institute", user.institute],
    ["Department", user.department],
    ["Position", user.position],
    ["Gender", user.gender],
    ["Profile photo", user.avatarUrl],
    ["Cover image", user.coverImageUrl],
  ];

  return fields
    .filter(([, value]) => !String(value || "").trim())
    .map(([label]) => label);
}

function getErrorMessage(error: unknown): string {
  if (error && typeof error === "object") {
    if ("data" in error) {
      const data = (error as { data?: { message?: unknown } }).data;
      if (data && typeof data.message === "string") {
        return data.message;
      }
    }

    if ("message" in error && typeof (error as { message?: unknown }).message === "string") {
      return String((error as { message?: unknown }).message);
    }
  }

  return "We could not load your profile from the backend.";
}

function renderDetailRows(items: DetailItem[]) {
  return items.map((item) => {
    const hasValue = Boolean(String(item.value || "").trim());
    const valueClassName = `${styles.detailValue} ${hasValue ? "" : styles.mutedValue}`.trim();

    return (
      <div className={styles.detailRow} key={item.label}>
        <span className={styles.detailLabel}>{item.label}</span>
        <span className={valueClassName}>{hasValue ? item.value : "Not added yet"}</span>
      </div>
    );
  });
}

export default function ProfilePageClient() {
  const router = useRouter();
  const [storedUser, setStoredUser] = useState<UserDto | null>(() => readStoredUser());
  const [uploadedUser, setUploadedUser] = useState<UserDto | null>(null);
  const [uploadingKind, setUploadingKind] = useState<UploadKind | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  const { data, error, isFetching, isLoading, refetch } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [updateProfileMedia] = useUpdateProfileMediaMutation();

  useEffect(() => {
    if (!data?.user || typeof window === "undefined") {
      return;
    }

    const token = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || undefined;
    setAuthSession(token, data.user);
  }, [data]);

  useEffect(() => {
    const status = error && typeof error === "object" && "status" in error
      ? (error as { status?: number | string }).status
      : null;

    if (status !== 401) {
      return;
    }

    clearAuthSession();
    setUploadedUser(null);
    setStoredUser(null);
    router.replace("/login");
  }, [error, router]);

  useEffect(() => {
    const handleStorage = () => {
      const nextUser = readStoredUser();
      setStoredUser(nextUser);
      if (!nextUser) {
        setUploadedUser(null);
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(AUTH_STORAGE_EVENT, handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(AUTH_STORAGE_EVENT, handleStorage);
    };
  }, []);

  const user = uploadedUser || data?.user || storedUser;

  const handleLogout = () => {
    clearAuthSession();
    setUploadedUser(null);
    setStoredUser(null);
    router.replace("/login");
    router.refresh();
  };

  const triggerUpload = (kind: UploadKind) => {
    if (kind === "avatar") {
      avatarInputRef.current?.click();
      return;
    }

    coverInputRef.current?.click();
  };

  const handleFileSelected = async (kind: UploadKind, event: ChangeEvent<HTMLInputElement>) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    setUploadError(null);
    setUploadingKind(kind);

    try {
      const uploadForm = new FormData();
      uploadForm.append("file", file);
      uploadForm.append("kind", kind);
      const authToken = getClientAuthToken();

      if (!authToken) {
        throw new Error("Authentication required.");
      }

      const uploadResponse = await fetch(`${apiBaseUrl}/api/uploads`, {
        method: "POST",
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        body: uploadForm,
      });

      const uploadPayload = (await uploadResponse.json()) as UploadResponse;
      if (!uploadResponse.ok || !uploadPayload.url) {
        throw new Error(uploadPayload.message || "Upload failed.");
      }

      const updatedProfile = await updateProfileMedia(
        kind === "avatar"
          ? { avatarUrl: uploadPayload.url }
          : { coverImageUrl: uploadPayload.url },
      ).unwrap();

      const token =
        typeof window !== "undefined"
          ? window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || undefined
          : undefined;

      setUploadedUser(updatedProfile.user);
      setStoredUser(updatedProfile.user);
      setAuthSession(token, updatedProfile.user);
      await refetch();
      setUploadedUser(null);
    } catch (uploadFailure) {
      setUploadError(
        uploadFailure instanceof Error ? uploadFailure.message : "File upload failed.",
      );
    } finally {
      input.value = "";
      setUploadingKind(null);
    }
  };

  if (!user && isLoading) {
    return (
      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.skeletonHero} />
          <div className={styles.skeletonGrid}>
            <div className={styles.skeletonCard} />
            <div className={styles.skeletonCard} />
          </div>
        </div>
      </section>
    );
  }

  if (!user && error) {
    return (
      <section className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <h2>Profile unavailable</h2>
            <p>{getErrorMessage(error)}</p>
            <div className={styles.actions}>
              <Link href="/" className={styles.primaryAction}>
                Return to newsfeed
              </Link>
              <button type="button" className={styles.logoutAction} onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const fullName = getFullName(user);
  const initials = getInitials(user);
  const completion = getCompletion(user);
  const missingFields = getMissingFields(user);
  const isUploadingAvatar = uploadingKind === "avatar";
  const isUploadingCover = uploadingKind === "cover";
  const heroStyle = user?.coverImageUrl
    ? {
        backgroundImage:
          `linear-gradient(135deg, rgba(8, 83, 140, 0.88) 0%, rgba(15, 155, 242, 0.78) 56%, rgba(102, 199, 255, 0.66) 100%), url("${user.coverImageUrl}")`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }
    : undefined;

  const heroStats = [
    {
      label: "Researcher Type",
      value: formatOptionalValue(user?.researcherType, "Complete your role"),
      meta: "Primary profile classification from your account record.",
    },
    {
      label: "Institute",
      value: formatOptionalValue(user?.institute, "Add your institute"),
      meta: "Your institution is surfaced anywhere this profile is referenced.",
    },
    {
      label: "Department",
      value: formatOptionalValue(user?.department, "Add your department"),
      meta: "Useful for collaboration filters and identity context.",
    },
    {
      label: "Profile Completion",
      value: `${completion}%`,
      meta: missingFields.length
        ? `${missingFields.length} detail${missingFields.length > 1 ? "s" : ""} still missing`
        : "All primary profile fields are filled in.",
    },
  ];

  const accountDetails: DetailItem[] = [
    { label: "Email address", value: user?.email },
    { label: "Joined", value: formatDate(user?.createdAt) },
    { label: "Gender", value: user?.gender },
    { label: "Member ID", value: user?.id },
  ];

  const professionalDetails: DetailItem[] = [
    { label: "Researcher type", value: user?.researcherType },
    { label: "Institute", value: user?.institute },
    { label: "Department", value: user?.department },
    { label: "Position", value: user?.position },
  ];

  return (
    <section className={styles.page}>
      <div className={styles.container}>
        <nav className={`sidebar ${styles.mobileSidebar}`}>
          <ul className="menu-slide">
            <li>
              <Link href="/">Newsfeed</Link>
            </li>
            <li>
              <Link href="/profile">Profile</Link>
            </li>
            <li>
              <button type="button" onClick={handleLogout}>
                Sign out
              </button>
            </li>
          </ul>
        </nav>

        <section className={styles.hero} style={heroStyle}>
          <input
            ref={avatarInputRef}
            className={styles.fileInput}
            type="file"
            accept="image/*"
            onChange={(event) => void handleFileSelected("avatar", event)}
          />
          <input
            ref={coverInputRef}
            className={styles.fileInput}
            type="file"
            accept="image/*"
            onChange={(event) => void handleFileSelected("cover", event)}
          />

          <div className={styles.heroTop}>
            <div className={styles.identityBlock}>
              <div className={styles.avatar}>
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt={fullName} className={styles.avatarImage} />
                ) : (
                  initials
                )}
              </div>
              <div className={styles.identityText}>
                <span className={styles.eyebrow}>Profile connected to backend</span>
                <h1 className={styles.name}>{fullName}</h1>
                <p className={styles.subline}>
                  {user?.email}
                  {user?.position ? ` | ${user.position}` : " | Add a position to complete your academic profile."}
                </p>
                <div className={styles.chips}>
                  <span className={styles.chip}>
                    <span className={styles.chipMuted}>Status</span> Active session
                  </span>
                  <span className={styles.chip}>
                    <span className={styles.chipMuted}>Joined</span> {formatDate(user?.createdAt)}
                  </span>
                  <span className={styles.chip}>
                    <span className={styles.chipMuted}>Type</span>{" "}
                    {formatOptionalValue(user?.researcherType, "Not specified")}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.heroPanel}>
              {isFetching ? <span className={styles.syncBadge}>Syncing</span> : null}
              <p className={styles.panelHeading}>Cloudinary media</p>
              <div className={styles.panelList}>
                <div className={styles.panelItem}>
                  <p className={styles.panelItemLabel}>Avatar status</p>
                  <p className={styles.panelItemValue}>
                    {user?.avatarUrl ? "Uploaded to Cloudinary" : "No avatar uploaded yet"}
                  </p>
                </div>
                <div className={styles.panelItem}>
                  <p className={styles.panelItemLabel}>Cover status</p>
                  <p className={styles.panelItemValue}>
                    {user?.coverImageUrl ? "Cover image connected" : "No cover image uploaded yet"}
                  </p>
                </div>
                <div className={styles.panelItem}>
                  <p className={styles.panelItemLabel}>Storage target</p>
                  <p className={styles.panelItemValue}>Cloudinary authenticated upload API</p>
                </div>
              </div>
              <div className={styles.mediaActions}>
                <button
                  type="button"
                  className={styles.mediaAction}
                  onClick={() => triggerUpload("avatar")}
                  disabled={Boolean(uploadingKind)}
                >
                  {isUploadingAvatar ? "Uploading avatar..." : "Upload avatar"}
                </button>
                <button
                  type="button"
                  className={styles.mediaAction}
                  onClick={() => triggerUpload("cover")}
                  disabled={Boolean(uploadingKind)}
                >
                  {isUploadingCover ? "Uploading cover..." : "Upload cover"}
                </button>
              </div>
              <p className={styles.uploadHint}>Images are uploaded through the server and then saved to your user profile.</p>
              {uploadError ? <p className={styles.uploadError}>{uploadError}</p> : null}
            </div>
          </div>

          <div className={styles.statsGrid}>
            {heroStats.map((stat) => (
              <div className={styles.statCard} key={stat.label}>
                <span className={styles.statLabel}>{stat.label}</span>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statMeta}>{stat.meta}</span>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <article className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Profile overview</h2>
                  <p className={styles.cardIntro}>
                    These fields are coming from your authenticated backend session and render the current public user
                    record.
                  </p>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.featureGrid}>
                  <div className={styles.featureCard}>
                    <span className={styles.featureLabel}>Display name</span>
                    <span className={styles.featureValue}>{fullName}</span>
                    <span className={styles.featureHint}>Used across the app header and profile surfaces.</span>
                  </div>
                  <div className={styles.featureCard}>
                    <span className={styles.featureLabel}>Account email</span>
                    <span className={styles.featureValue}>{user?.email}</span>
                    <span className={styles.featureHint}>Primary sign-in identity from the auth backend.</span>
                  </div>
                  <div className={styles.featureCard}>
                    <span className={styles.featureLabel}>Profile photo</span>
                    <span className={styles.featureValue}>
                      {user?.avatarUrl ? "Uploaded and synced" : "Waiting for upload"}
                    </span>
                    <span className={styles.featureHint}>Avatar uploads are stored in Cloudinary and persisted in MongoDB.</span>
                  </div>
                  <div className={styles.featureCard}>
                    <span className={styles.featureLabel}>Cover media</span>
                    <span className={styles.featureValue}>
                      {user?.coverImageUrl ? "Active cover image" : "Waiting for upload"}
                    </span>
                    <span className={styles.featureHint}>Cover uploads update the profile hero immediately after save.</span>
                  </div>
                </div>
              </div>
            </article>

            <article className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Professional details</h2>
                  <p className={styles.cardIntro}>Institutional data stored for this account.</p>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.detailList}>{renderDetailRows(professionalDetails)}</div>
              </div>
            </article>

            <article className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Account details</h2>
                  <p className={styles.cardIntro}>Session-aware information resolved from the backend.</p>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.detailList}>{renderDetailRows(accountDetails)}</div>
              </div>
            </article>
          </div>

          <div className={styles.sideColumn}>
            <article className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Profile strength</h2>
                  <p className={styles.cardIntro}>A quick completeness check based on the data currently stored.</p>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.completionValue}>{completion}%</div>
                <div className={styles.completionTrack}>
                  <div className={styles.completionBar} style={{ width: `${completion}%` }} />
                </div>
                {missingFields.length ? (
                  <div>
                    <ul className={styles.missingList}>
                      {missingFields.map((field) => (
                        <li className={styles.missingItem} key={field}>
                          <span className={styles.missingDot} />
                          Add {field.toLowerCase()}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className={styles.cardIntro}>All tracked profile fields are currently populated.</p>
                )}
              </div>
            </article>

            <article className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <h2 className={styles.cardTitle}>Session status</h2>
                  <p className={styles.cardIntro}>Useful checks while the frontend stays synced with auth state.</p>
                </div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.statusGrid}>
                  <div className={styles.statusTile}>
                    <h3>Authenticated route protection</h3>
                    <p>The page remains guarded by the same client auth check used across the main app routes.</p>
                  </div>
                  <div className={styles.statusTile}>
                    <h3>Backend-driven profile data</h3>
                    <p>The profile content is loaded from `/api/auth/me` instead of static template markup.</p>
                  </div>
                  <div className={styles.statusTile}>
                    <h3>Cloudinary upload flow</h3>
                    <p>Files now go through a server upload route before the resulting URL is saved back to your account.</p>
                  </div>
                </div>
                <div className={styles.actions}>
                  <Link href="/" className={styles.primaryAction}>
                    Back to newsfeed
                  </Link>
                  <button type="button" className={styles.secondaryAction} onClick={() => triggerUpload("avatar")}>
                    Change avatar
                  </button>
                  <button type="button" className={styles.logoutAction} onClick={handleLogout}>
                    Sign out
                  </button>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
