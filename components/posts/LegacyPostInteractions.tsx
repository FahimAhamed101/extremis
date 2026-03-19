"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect } from "react";
import { AUTH_USER_STORAGE_KEY } from "@/lib/auth/constants";

type StoredUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string | null;
};

function parseCount(value: string | null | undefined, fallback = 0): number {
  const numeric = Number.parseInt(String(value || "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(numeric) ? numeric : fallback;
}

function readStoredUser(): StoredUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawUser) as StoredUser;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildCommentMarkup(message: string) {
  const user = readStoredUser();
  const firstName = String(user?.firstName || "").trim();
  const lastName = String(user?.lastName || "").trim();
  const name = `${firstName} ${lastName}`.trim() || String(user?.email || "You");
  const image = String(user?.avatarUrl || "/images/resources/user.jpg").trim() || "/images/resources/user.jpg";

  return `
    <li>
      <figure><img alt="" src="${escapeHtml(image)}" /></figure>
      <div class="commenter">
        <h5><a title="" href="#">${escapeHtml(name)}</a></h5>
        <span>Just now</span>
        <p>${escapeHtml(message)}</p>
      </div>
      <a title="Like" href="#"><i class="icofont-heart"></i></a>
      <a title="Reply" href="#" class="reply-coment"><i class="icofont-reply"></i></a>
    </li>
  `;
}

export default function LegacyPostInteractions() {
  useEffect(() => {
    const handleClick = async (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const withinReactPost = target.closest("[data-react-post='true']");
      if (withinReactPost) {
        return;
      }

      const likeLink = target.closest(".stat-tools .Like__link") as HTMLAnchorElement | null;
      if (likeLink) {
        event.preventDefault();
        const statTools = likeLink.closest(".stat-tools");
        const emojiCount = statTools?.querySelector(".emoji-state > p");
        const currentCount = parseCount(emojiCount?.textContent, 10);
        const isActive = likeLink.classList.toggle("is-active");
        likeLink.innerHTML = `<i class="icofont-like"></i> ${isActive ? "Liked" : "Like"}`;
        if (emojiCount) {
          emojiCount.textContent = String(Math.max(0, currentCount + (isActive ? 1 : -1)));
        }
        return;
      }

      const commentLink = target.closest(".stat-tools .comment-to") as HTMLAnchorElement | null;
      if (commentLink) {
        event.preventDefault();
        const statTools = commentLink.closest(".stat-tools");
        const commentBox = statTools?.querySelector(".new-comment") as HTMLElement | null;
        if (commentBox) {
          commentBox.style.display = commentBox.style.display === "block" ? "none" : "block";
        }
        return;
      }

      const shareLink = target.closest(".stat-tools .share-to") as HTMLAnchorElement | null;
      if (shareLink) {
        event.preventDefault();
        const postMeta = shareLink.closest(".post-meta");
        const shareCount = postMeta?.querySelector(".share-pst ins");
        const currentCount = parseCount(shareCount?.textContent, 205);
        if (shareCount) {
          shareCount.textContent = String(currentCount + 1);
        }

        if (navigator.clipboard?.writeText) {
          try {
            await navigator.clipboard.writeText(window.location.href);
          } catch {
            // Best effort only.
          }
        }
      }
    };

    const handleSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement | null;
      if (!form || form.closest("[data-react-post='true']")) {
        return;
      }

      if (!form.closest(".new-comment")) {
        return;
      }

      event.preventDefault();

      const input = form.querySelector("input[type='text']") as HTMLInputElement | null;
      const message = String(input?.value || "").trim();
      if (!message) {
        return;
      }

      const newComment = form.parentElement;
      const commentList = newComment?.querySelector(".comments-area > ul");
      if (commentList) {
        commentList.insertAdjacentHTML("beforeend", buildCommentMarkup(message));
      }

      const postMeta = form.closest(".post-meta");
      const commentCount = postMeta?.querySelector(".Recommend ins");
      if (commentCount) {
        commentCount.textContent = String(parseCount(commentCount.textContent, 54) + 1);
      }

      if (input) {
        input.value = "";
      }
      if (newComment instanceof HTMLElement) {
        newComment.style.display = "block";
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("submit", handleSubmit);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("submit", handleSubmit);
    };
  }, []);

  return null;
}
