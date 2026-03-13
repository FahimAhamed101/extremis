"use client";

import {
  AUTH_COOKIE_NAME,
  AUTH_STORAGE_EVENT,
  AUTH_TOKEN_STORAGE_KEY,
  AUTH_USER_STORAGE_KEY,
} from "@/lib/auth/constants";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function isBrowser() {
  return typeof window !== "undefined";
}

function getSecureCookieFlag() {
  if (!isBrowser()) {
    return "";
  }

  return window.location.protocol === "https:" ? "; Secure" : "";
}

function writeCookie(name: string, value: string, maxAge: number) {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${getSecureCookieFlag()}`;
}

function clearCookie(name: string) {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax${getSecureCookieFlag()}`;
}

function readCookie(name: string): string | null {
  if (!isBrowser()) {
    return null;
  }

  const prefix = `${name}=`;
  const match = document.cookie
    .split("; ")
    .find((item) => item.startsWith(prefix));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.slice(prefix.length));
}

function dispatchAuthStorageEvent() {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(new Event(AUTH_STORAGE_EVENT));
}

export function setAuthSession(token: string | undefined, user: unknown) {
  if (!isBrowser()) {
    return;
  }

  if (token) {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    writeCookie(AUTH_COOKIE_NAME, token, COOKIE_MAX_AGE_SECONDS);
  } else {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    clearCookie(AUTH_COOKIE_NAME);
  }

  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
  dispatchAuthStorageEvent();
}

export function clearAuthSession() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_USER_STORAGE_KEY);
  clearCookie(AUTH_COOKIE_NAME);
  dispatchAuthStorageEvent();
}

export function hasClientAuthSession() {
  if (!isBrowser()) {
    return false;
  }

  return Boolean(localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || readCookie(AUTH_COOKIE_NAME));
}
