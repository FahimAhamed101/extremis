"use client";

/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAuthSession } from "@/lib/auth/client";
import type { ChatParticipantDto, ProfilePersonCard } from "@/lib/services/authApi";
import {
  useGetChatContactsQuery,
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
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetDiscoverPeopleQuery({ limit: 30 });
  const {
    data: contactsData,
    isLoading: isContactsLoading,
    error: contactsError,
  } = useGetChatContactsQuery(undefined, {
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const [toggleFollowUser] = useToggleFollowUserMutation();
  const [pendingFollowUserId, setPendingFollowUserId] = useState<string | null>(null);
  const [followErrorMessage, setFollowErrorMessage] = useState<string | null>(null);
  const [followStateOverrides, setFollowStateOverrides] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const discoverStatus =
      error && typeof error === "object" && "status" in error
        ? (error as { status?: number | string }).status
        : null;
    const contactsStatus =
      contactsError && typeof contactsError === "object" && "status" in contactsError
        ? (contactsError as { status?: number | string }).status
        : null;
    const status = discoverStatus === 401 ? discoverStatus : contactsStatus;

    if (status !== 401) {
      return;
    }

    clearAuthSession();
    router.replace("/login");
  }, [contactsError, error, router]);

  const discoveredPeople = useMemo(() => {
    const users = Array.isArray(data?.users) ? data.users : [];
    return users.filter((person) => String(person.id || "").trim());
  }, [data]);

  const fallbackPeople = useMemo<ProfilePersonCard[]>(() => {
    const contacts = Array.isArray(contactsData?.data) ? contactsData.data : [];

    return contacts
      .filter((contact): contact is ChatParticipantDto => Boolean(String(contact?.id || "").trim()))
      .map((contact) => ({
        id: contact.id,
        profileHref: `/profile/${contact.id}`,
        name: contact.name,
        subtitle:
          String(contact.department || "").trim() ||
          String(contact.institute || "").trim() ||
          String(contact.roleLabel || "").trim() ||
          "Researcher",
        image: contact.avatarUrl,
        actionLabel: "Follow",
        canFollow: true,
        isFollowing: false,
      }));
  }, [contactsData]);

  const people = useMemo(() => {
    const source = discoveredPeople.length > 0 ? discoveredPeople : fallbackPeople;

    return source.map((person) => {
      const personId = String(person.id || "").trim();
      const override = personId ? followStateOverrides[personId] : undefined;
      const isFollowing = typeof override === "boolean" ? override : Boolean(person.isFollowing);

      return {
        ...person,
        isFollowing,
        canFollow: person.canFollow !== false,
        actionLabel: person.canFollow === false ? person.actionLabel : isFollowing ? "Following" : "Follow",
      };
    });
  }, [discoveredPeople, fallbackPeople, followStateOverrides]);

  const hasRenderablePeople = people.length > 0;
  const shouldShowError = !hasRenderablePeople && Boolean(isError || contactsError);
  const isBusyLoading = isLoading || (!hasRenderablePeople && isContactsLoading);

  const handleToggleFollow = async (person: ProfilePersonCard) => {
    const personId = String(person.id || "").trim();
    if (!personId || !person.canFollow) {
      return;
    }

    setFollowErrorMessage(null);
    setPendingFollowUserId(personId);

    try {
      const response = await toggleFollowUser(personId).unwrap();
      setFollowStateOverrides((current) => ({
        ...current,
        [personId]: Boolean(response.isFollowing),
      }));
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
                    {isBusyLoading ? "Loading..." : `${people.length} researchers`}
                  </span>
                </div>

                {shouldShowError ? (
                  <p className="profile-follow-error">{getErrorMessage(error || contactsError)}</p>
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

                {!isBusyLoading && !people.length && !shouldShowError ? (
                  <p className="profile-page-two-empty">No other users are available yet.</p>
                ) : null}
                {isFetching && !isBusyLoading ? (
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
