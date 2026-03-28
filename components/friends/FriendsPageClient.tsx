"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuthSession } from "@/lib/auth/client";
import type { ProfilePersonCard } from "@/lib/services/authApi";
import {
  useGetDiscoverPeopleQuery,
  useToggleFollowUserMutation,
} from "@/lib/services/authApi";

function getErrorMessage(error: unknown) {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    error.data &&
    typeof error.data === "object" &&
    "message" in error.data &&
    typeof error.data.message === "string"
  ) {
    return error.data.message;
  }

  if (error && typeof error === "object" && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "We could not load researchers right now.";
}

export default function FriendsPageClient() {
  const router = useRouter();
  const { data, isLoading, isFetching, isError, error } = useGetDiscoverPeopleQuery({ limit: 30 });
  const [toggleFollowUser] = useToggleFollowUserMutation();
  const [pendingFollowUserId, setPendingFollowUserId] = useState<string | null>(null);
  const [followErrorMessage, setFollowErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const status =
      error && typeof error === "object" && "status" in error
        ? (error as { status?: number | string }).status
        : null;

    if (status !== 401) {
      return;
    }

    clearAuthSession();
    router.replace("/login");
  }, [error, router]);

  const people = useMemo(() => {
    const users = Array.isArray(data?.users) ? data.users : [];
    return users.filter((person) => String(person.id || "").trim());
  }, [data]);

  const handleToggleFollow = async (person: ProfilePersonCard) => {
    const personId = String(person.id || "").trim();
    if (!personId || !person.canFollow) {
      return;
    }

    setFollowErrorMessage(null);
    setPendingFollowUserId(personId);

    try {
      await toggleFollowUser(personId).unwrap();
    } catch (followError) {
      setFollowErrorMessage(getErrorMessage(followError));
    } finally {
      setPendingFollowUserId(null);
    }
  };

  return (
    <section>
      <div className="gap">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-wraper">
                <div className="friends-directory-header">
                  <div>
                    <h4 className="widget-title">Discover Researchers</h4>
                    <p>
                      Follow other users from here, then open their profile to read their posts and updates.
                    </p>
                  </div>
                  <span className="friends-directory-count">
                    {isLoading ? "Loading..." : `${people.length} researchers`}
                  </span>
                </div>

                {isError ? (
                  <p className="profile-follow-error">{getErrorMessage(error)}</p>
                ) : (
                  <div className="row friends-directory-grid">
                    {people.map((person) => {
                      const personId = String(person.id || "").trim();
                      const isUpdating = pendingFollowUserId === personId;
                      const profileHref = person.profileHref || `/profile/${personId}`;

                      return (
                        <div className="col-lg-4 col-md-6 col-sm-6" key={personId}>
                          <div className="friendz friends-directory-card">
                            <figure>
                              <Link href={profileHref} title={person.name}>
                                <img src={person.image} alt={person.name} />
                              </Link>
                            </figure>
                            <span>
                              <Link href={profileHref} title={person.name}>
                                {person.name}
                              </Link>
                            </span>
                            <ins>{person.subtitle}</ins>
                            <div className="friends-directory-actions">
                              <Link href={profileHref} title={`View ${person.name}`}>
                                View Profile
                              </Link>
                              {person.canFollow ? (
                                <button
                                  type="button"
                                  className="profile-follow-action friends-directory-follow"
                                  onClick={() => handleToggleFollow(person)}
                                  disabled={isUpdating}
                                >
                                  {isUpdating ? "Updating..." : person.actionLabel}
                                </button>
                              ) : (
                                <span className="friends-directory-status">{person.actionLabel}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {!isLoading && !people.length && !isError ? (
                  <p className="profile-page-two-empty">No other users are available yet.</p>
                ) : null}
                {isFetching && !isLoading ? (
                  <p className="profile-page-two-empty">Refreshing researchers...</p>
                ) : null}
                {followErrorMessage ? <p className="profile-follow-error">{followErrorMessage}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
