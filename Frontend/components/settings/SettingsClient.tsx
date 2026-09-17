"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import AppFooter from "@/components/layout/AppFooter";
import {
  useGetSettingsQuery,
  useUpdateAccountSettingsMutation,
  useUpdateNotificationSettingsMutation,
  useUpdatePrivacySettingsMutation,
  useUpdateBillingSettingsMutation,
  useRequestApiClientMutation,
  useRevokeApiClientMutation,
  useCloseAccountMutation,
} from "@/lib/services/authApi";
import { clearAuthSession } from "@/lib/auth/client";

type SettingsTab = "account" | "notification" | "privacy" | "billing" | "api" | "close";
type PaymentTab = "visa" | "paypal" | "bitcoin" | "swift";

export default function SettingsClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [activePaymentTab, setActivePaymentTab] = useState<PaymentTab>("visa");

  // Feedback notifications
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Queries and Mutations
  const { data: settingsData, isLoading, refetch } = useGetSettingsQuery();
  const [updateAccount, { isLoading: isUpdatingAccount }] = useUpdateAccountSettingsMutation();
  const [updateNotifications, { isLoading: isUpdatingNotifications }] = useUpdateNotificationSettingsMutation();
  const [updatePrivacy, { isLoading: isUpdatingPrivacy }] = useUpdatePrivacySettingsMutation();
  const [updateBilling, { isLoading: isUpdatingBilling }] = useUpdateBillingSettingsMutation();
  const [requestApiClient, { isLoading: isRequestingApi }] = useRequestApiClientMutation();
  const [revokeApiClient, { isLoading: isRevokingApi }] = useRevokeApiClientMutation();
  const [closeAccount, { isLoading: isClosingAccount }] = useCloseAccountMutation();

  // Tab 1: Account State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [designation, setDesignation] = useState("");
  const [bio, setBio] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");

  // Tab 2: Notification State
  const [subscriptions, setSubscriptions] = useState(true);
  const [recommendedResearches, setRecommendedResearches] = useState(true);
  const [activeComments, setActiveComments] = useState(true);
  const [replyComments, setReplyComments] = useState(true);
  const [emailAcademicUpdates, setEmailAcademicUpdates] = useState(true);
  const [promotionalRecommendations, setPromotionalRecommendations] = useState(false);

  // Tab 3: Privacy State
  const [searchEngineVisible, setSearchEngineVisible] = useState(true);
  const [showFollowersOnTimeline, setShowFollowersOnTimeline] = useState(true);
  const [showCoursesAndResearches, setShowCoursesAndResearches] = useState(true);

  // Tab 4: Billing State
  const [billFirstName, setBillFirstName] = useState("");
  const [billLastName, setBillLastName] = useState("");
  const [billCountry, setBillCountry] = useState("USA");
  const [billAddressLine1, setBillAddressLine1] = useState("");
  const [billAddressLine2, setBillAddressLine2] = useState("");
  const [billState, setBillState] = useState("");
  const [billCity, setBillCity] = useState("");
  const [billNotes, setBillNotes] = useState("");

  // Payment method fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardMonth, setCardMonth] = useState("Month");
  const [cardYear, setCardYear] = useState("2026");
  const [cardCvv, setCardCvv] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bitcoinAddress, setBitcoinAddress] = useState("");
  const [bankFirstName, setBankFirstName] = useState("");
  const [bankLastName, setBankLastName] = useState("");
  const [bankCountry, setBankCountry] = useState("USA");
  const [bankName, setBankName] = useState("");
  const [bankAddress, setBankAddress] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [bankAccountNo, setBankAccountNo] = useState("");

  // Tab 6: Close Account State
  const [closePassword, setClosePassword] = useState("");
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  // Populate state from loaded settings
  useEffect(() => {
    if (settingsData) {
      const { basicProfile, socialLinks, notificationSettings, privacySettings, billingAddress, paymentMethod } = settingsData;
      if (basicProfile) {
        setFirstName(basicProfile.firstName || "");
        setLastName(basicProfile.lastName || "");
        setDesignation(basicProfile.designation || "");
        setBio(basicProfile.bio || "");
      }
      if (socialLinks) {
        setFacebook(socialLinks.facebook || "");
        setTwitter(socialLinks.twitter || "");
        setInstagram(socialLinks.instagram || "");
        setYoutube(socialLinks.youtube || "");
      }
      if (notificationSettings) {
        setSubscriptions(notificationSettings.subscriptions ?? true);
        setRecommendedResearches(notificationSettings.recommendedResearches ?? true);
        setActiveComments(notificationSettings.activeComments ?? true);
        setReplyComments(notificationSettings.replyComments ?? true);
        setEmailAcademicUpdates(notificationSettings.emailAcademicUpdates ?? true);
        setPromotionalRecommendations(notificationSettings.promotionalRecommendations ?? false);
      }
      if (privacySettings) {
        setSearchEngineVisible(privacySettings.searchEngineVisible ?? true);
        setShowFollowersOnTimeline(privacySettings.showFollowersOnTimeline ?? true);
        setShowCoursesAndResearches(privacySettings.showCoursesAndResearches ?? true);
      }
      if (billingAddress) {
        setBillFirstName(billingAddress.firstName || "");
        setBillLastName(billingAddress.lastName || "");
        setBillCountry(billingAddress.country || "USA");
        setBillAddressLine1(billingAddress.addressLine1 || "");
        setBillAddressLine2(billingAddress.addressLine2 || "");
        setBillState(billingAddress.state || "");
        setBillCity(billingAddress.city || "");
        setBillNotes(billingAddress.notes || "");
      }
      if (paymentMethod) {
        setActivePaymentTab((paymentMethod.methodType as PaymentTab) || "visa");
        setCardNumber(paymentMethod.cardNumber || "");
        setCardMonth(paymentMethod.cardMonth || "Month");
        setCardYear(paymentMethod.cardYear || "2026");
        setCardCvv(paymentMethod.cardCvv || "");
        setPaypalEmail(paymentMethod.paypalEmail || "");
        setBitcoinAddress(paymentMethod.bitcoinAddress || "");
        setBankFirstName(paymentMethod.bankFirstName || "");
        setBankLastName(paymentMethod.bankLastName || "");
        setBankCountry(paymentMethod.bankCountry || "USA");
        setBankName(paymentMethod.bankName || "");
        setBankAddress(paymentMethod.bankAddress || "");
        setSwiftCode(paymentMethod.swiftCode || "");
        setBankAccountNo(paymentMethod.bankAccountNo || "");
      }
    }
  }, [settingsData]);

  const showBanner = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((prev) => (prev?.message === message ? null : prev));
    }, 4500);
  };

  // Submit Account Form
  const handleSaveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateAccount({
        firstName,
        lastName,
        designation,
        bio,
        socialLinks: { facebook, twitter, instagram, youtube },
      }).unwrap();
      showBanner("success", "Account settings saved successfully!");
      refetch();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to update account settings.";
      showBanner("error", msg);
    }
  };

  // Submit Notification Form
  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateNotifications({
        subscriptions,
        recommendedResearches,
        activeComments,
        replyComments,
        emailAcademicUpdates,
        promotionalRecommendations,
      }).unwrap();
      showBanner("success", "Notification preferences saved!");
      refetch();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to update notifications.";
      showBanner("error", msg);
    }
  };

  // Submit Privacy Form
  const handleSavePrivacy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updatePrivacy({
        searchEngineVisible,
        showFollowersOnTimeline,
        showCoursesAndResearches,
      }).unwrap();
      showBanner("success", "Privacy settings updated!");
      refetch();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to update privacy settings.";
      showBanner("error", msg);
    }
  };

  // Submit Billing Address Form
  const handleSaveBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBilling({
        billingAddress: {
          firstName: billFirstName,
          lastName: billLastName,
          country: billCountry,
          addressLine1: billAddressLine1,
          addressLine2: billAddressLine2,
          state: billState,
          city: billCity,
          notes: billNotes,
        },
        paymentMethod: {
          methodType: activePaymentTab,
          cardNumber,
          cardMonth,
          cardYear,
          cardCvv,
          paypalEmail,
          bitcoinAddress,
          bankFirstName,
          bankLastName,
          bankCountry,
          bankName,
          bankAddress,
          swiftCode,
          bankAccountNo,
        },
      }).unwrap();
      showBanner("success", "Billing and payment details saved successfully!");
      refetch();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to save billing information.";
      showBanner("error", msg);
    }
  };

  // Request new API client
  const handleRequestApiClient = async () => {
    try {
      await requestApiClient().unwrap();
      showBanner("success", "New affiliate API client credentials generated!");
      refetch();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to create API client.";
      showBanner("error", msg);
    }
  };

  // Revoke API client
  const handleRevokeApiClient = async (clientId: string) => {
    if (!window.confirm("Are you sure you want to revoke this API client? Applications using these keys will lose access.")) {
      return;
    }
    try {
      await revokeApiClient(clientId).unwrap();
      showBanner("success", "API client has been revoked.");
      refetch();
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Failed to revoke API client.";
      showBanner("error", msg);
    }
  };

  // Close Account
  const handleCloseAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!closePassword.trim()) {
      showBanner("error", "Please enter your password to proceed.");
      return;
    }
    try {
      await closeAccount({ password: closePassword }).unwrap();
      clearAuthSession();
      alert("Your Socimo account has been permanently closed. Redirecting to login...");
      router.replace("/login");
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message || "Incorrect password. Could not close account.";
      showBanner("error", msg);
    }
  };

  const apiClients = settingsData?.apiClients || [];

  return (
    <RequireAuth>
      <div className="theme-layout">
        <HomeHeader />

        {/* ================= HERO SECTION ================= */}
        <section>
          <div className="gap no-gap bluesh high-opacity">
            <div
              style={{
                backgroundImage: "url(/images/resources/top-bg.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="bg-image"
            ></div>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="post-subject">
                    <h1>Account Settings</h1>
                    <p> Choose your accounts options and privacy. </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= MAIN SETTINGS SECTION ================= */}
        <section>
          <div className="gap">
            <div className="container">
              {/* Feedback Alert */}
              {feedback && (
                <div
                  style={{
                    padding: "14px 20px",
                    marginBottom: "20px",
                    borderRadius: "8px",
                    backgroundColor: feedback.type === "success" ? "#ecfdf5" : "#fef2f2",
                    color: feedback.type === "success" ? "#065f46" : "#991b1b",
                    border: feedback.type === "success" ? "1px solid #a7f3d0" : "1px solid #fca5a5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontWeight: 500,
                  }}
                >
                  <span>
                    <i
                      className={feedback.type === "success" ? "icofont-check-circled" : "icofont-warning"}
                      style={{ marginRight: "8px", fontSize: "18px" }}
                    ></i>
                    {feedback.message}
                  </span>
                  <span
                    style={{ cursor: "pointer", fontSize: "18px" }}
                    onClick={() => setFeedback(null)}
                  >
                    &times;
                  </span>
                </div>
              )}

              {isLoading && (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <i className="icofont-spinner icofont-spin" style={{ fontSize: "36px", color: "#088dcd" }}></i>
                  <p style={{ marginTop: "10px", color: "#64748b" }}>Loading settings...</p>
                </div>
              )}

              <div className="row">
                {/* Navigation Tabs (Sidebar) */}
                <div className="col-lg-3 mb-4">
                  <nav className="responsive-tab">
                    <ul className="nav nav-tabs uk-list">
                      <li className="nav-item">
                        <a
                          className={activeTab === "account" ? "active" : ""}
                          href="#account"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("account");
                          }}
                        >
                          Account
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={activeTab === "notification" ? "active" : ""}
                          href="#notification"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("notification");
                          }}
                        >
                          Notification
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={activeTab === "privacy" ? "active" : ""}
                          href="#privacy"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("privacy");
                          }}
                        >
                          Privacy
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={activeTab === "billing" ? "active" : ""}
                          href="#billing"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("billing");
                          }}
                        >
                          Billing and Payout
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={activeTab === "api" ? "active" : ""}
                          href="#api"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("api");
                          }}
                        >
                          API Clients
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className={activeTab === "close" ? "active" : ""}
                          href="#close"
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveTab("close");
                          }}
                        >
                          Close Account
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>

                {/* Tab Contents */}
                <div className="col-lg-9">
                  <div className="main-wraper">
                    <div className="tab-content" id="components-nav">
                      {/* ================= TAB 1: ACCOUNT ================= */}
                      {activeTab === "account" && (
                        <div className="tab-pane active fade show" id="account">
                          <div className="uk-width">
                            <div className="setting-card">
                              <h2>Account Settings</h2>
                              <p className="mb-4">
                                This is your public presence on Socimo. You need an account to upload your paid courses, comment on courses, interact with research peers, or receive payouts.
                              </p>
                              <h6>Basic Profile</h6>
                              <p>Add information about yourself</p>
                              <form onSubmit={handleSaveAccount}>
                                <fieldset className="row merged-10">
                                  <div className="mb-4 col-lg-6">
                                    <input
                                      className="uk-input"
                                      type="text"
                                      placeholder="First Name"
                                      value={firstName}
                                      onChange={(e) => setFirstName(e.target.value)}
                                    />
                                  </div>
                                  <div className="mb-4 col-lg-6">
                                    <input
                                      className="uk-input"
                                      type="text"
                                      placeholder="Last Name"
                                      value={lastName}
                                      onChange={(e) => setLastName(e.target.value)}
                                    />
                                  </div>
                                  <div className="mb-4 col-lg-6">
                                    <input
                                      className="uk-input"
                                      type="text"
                                      placeholder="Your Designation"
                                      value={designation}
                                      onChange={(e) => setDesignation(e.target.value)}
                                    />
                                    <em>Add a professional headline like, &quot;Engineer&quot; or &quot;Architect.&quot;</em>
                                  </div>
                                  <div className="mb-4 col-lg-12">
                                    <textarea
                                      className="uk-textarea"
                                      rows={4}
                                      placeholder="Bio / About yourself"
                                      value={bio}
                                      onChange={(e) => setBio(e.target.value)}
                                    ></textarea>
                                  </div>
                                  <h6 className="mb-4">Social Profile Links</h6>
                                  <div className="mb-4 col-lg-12">
                                    <div className="social-links">
                                      <span>http://facebook.com/</span>
                                      <input
                                        type="text"
                                        placeholder="Facebook Username"
                                        value={facebook}
                                        onChange={(e) => setFacebook(e.target.value)}
                                      />
                                      <em>Add your Facebook username (e.g. johndoe).</em>
                                    </div>
                                  </div>
                                  <div className="mb-4 col-lg-12">
                                    <div className="social-links">
                                      <span>http://twitter.com/</span>
                                      <input
                                        type="text"
                                        placeholder="Twitter Username"
                                        value={twitter}
                                        onChange={(e) => setTwitter(e.target.value)}
                                      />
                                      <em>Add your Twitter/X username (e.g. johndoe).</em>
                                    </div>
                                  </div>
                                  <div className="mb-4 col-lg-12">
                                    <div className="social-links">
                                      <span>http://www.instagram.com/</span>
                                      <input
                                        type="text"
                                        placeholder="Instagram Username"
                                        value={instagram}
                                        onChange={(e) => setInstagram(e.target.value)}
                                      />
                                      <em>Add your Instagram username (e.g. johndoe).</em>
                                    </div>
                                  </div>
                                  <div className="mb-4 col-lg-12">
                                    <div className="social-links">
                                      <span>http://www.youtube.com/</span>
                                      <input
                                        type="text"
                                        placeholder="YouTube Username"
                                        value={youtube}
                                        onChange={(e) => setYoutube(e.target.value)}
                                      />
                                      <em>Add your YouTube username (e.g. johndoe).</em>
                                    </div>
                                  </div>
                                  <div className="mb-0 col-lg-12">
                                    <button
                                      type="submit"
                                      className="button primary circle"
                                      disabled={isUpdatingAccount}
                                    >
                                      {isUpdatingAccount ? "Saving..." : "Save Changes"}
                                    </button>
                                  </div>
                                </fieldset>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ================= TAB 2: NOTIFICATION ================= */}
                      {activeTab === "notification" && (
                        <div className="tab-pane active fade show" id="notification">
                          <div className="uk-width">
                            <div className="setting-card">
                              <h2>Notification</h2>
                              <p className="mb-4">Notifications - Choose when and how to be notified.</p>
                              <h6>Choose when and how to be notified</h6>
                              <form onSubmit={handleSaveNotifications}>
                                <div className="seting-mode">
                                  <input
                                    type="checkbox"
                                    hidden
                                    id="switch1"
                                    checked={subscriptions}
                                    onChange={(e) => setSubscriptions(e.target.checked)}
                                  />
                                  <label className="switch" htmlFor="switch1"></label>
                                  <i className="icofont-substitute"></i> <span>Subscriptions</span>
                                  <p>Notify me about activity from the profiles I&apos;m subscribed to</p>
                                </div>
                                <div className="seting-mode">
                                  <input
                                    type="checkbox"
                                    hidden
                                    id="switch2"
                                    checked={recommendedResearches}
                                    onChange={(e) => setRecommendedResearches(e.target.checked)}
                                  />
                                  <label className="switch" htmlFor="switch2"></label>
                                  <i className="icofont-at"></i> <span>Recommended Researches </span>
                                  <p>Notify me of courses and research papers I might like based on what I watch</p>
                                </div>
                                <div className="seting-mode">
                                  <input
                                    type="checkbox"
                                    hidden
                                    id="switch3"
                                    checked={activeComments}
                                    onChange={(e) => setActiveComments(e.target.checked)}
                                  />
                                  <label className="switch" htmlFor="switch3"></label>
                                  <i className="icofont-comment"></i> <span> Active Comments</span>
                                  <p>Notify me about activity on my comments on others’ courses and posts</p>
                                </div>
                                <div className="seting-mode">
                                  <input
                                    type="checkbox"
                                    hidden
                                    id="switch4"
                                    checked={replyComments}
                                    onChange={(e) => setReplyComments(e.target.checked)}
                                  />
                                  <label className="switch" htmlFor="switch4"></label>
                                  <i className="icofont-reply"></i> <span>Reply to My comments </span>
                                  <p>Notify me about replies to my comments</p>
                                </div>
                                <h6>Email Notifications</h6>
                                <div className="seting-mode">
                                  <input
                                    type="checkbox"
                                    hidden
                                    id="switch5"
                                    checked={emailAcademicUpdates}
                                    onChange={(e) => setEmailAcademicUpdates(e.target.checked)}
                                  />
                                  <label className="switch" htmlFor="switch5"></label>
                                  <i className="icofont-email"></i> <span>Send me Emails about academic activity and updates</span>
                                  <p>If this setting is turned off, Socimo may still send you messages regarding your account, required service announcements, legal notifications, and privacy matters</p>
                                </div>
                                <div className="seting-mode">
                                  <input
                                    type="checkbox"
                                    hidden
                                    id="switch6"
                                    checked={promotionalRecommendations}
                                    onChange={(e) => setPromotionalRecommendations(e.target.checked)}
                                  />
                                  <label className="switch" htmlFor="switch6"></label>
                                  <i className="icofont-foot-print"></i> <span>Promotional and helpful Recommendations</span>
                                  <p>Send me any promotional and recommendation email from academic partners</p>
                                </div>
                                <button
                                  type="submit"
                                  className="button primary circle"
                                  style={{ marginTop: "20px" }}
                                  disabled={isUpdatingNotifications}
                                >
                                  {isUpdatingNotifications ? "Saving..." : "Save Changes"}
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ================= TAB 3: PRIVACY ================= */}
                      {activeTab === "privacy" && (
                        <div className="tab-pane active fade show" id="privacy">
                          <div className="uk-width">
                            <div className="setting-card">
                              <h2>Privacy</h2>
                              <p className="mb-2">Modify your privacy settings here. </p>
                              <form onSubmit={handleSavePrivacy}>
                                <div className="seting-mode">
                                  <input
                                    type="checkbox"
                                    hidden
                                    id="switch7"
                                    checked={searchEngineVisible}
                                    onChange={(e) => setSearchEngineVisible(e.target.checked)}
                                  />
                                  <label className="switch" htmlFor="switch7"></label>
                                  <i className="icofont-search-stock"></i> <span>Show your profile on search engine.</span>
                                  <p>Allow Google and other public search engines to index your academic profile and published works</p>
                                </div>
                                <div className="seting-mode">
                                  <input
                                    type="checkbox"
                                    hidden
                                    id="switch8"
                                    checked={showFollowersOnTimeline}
                                    onChange={(e) => setShowFollowersOnTimeline(e.target.checked)}
                                  />
                                  <label className="switch" htmlFor="switch8"></label>
                                  <i className="icofont-users-social"></i> <span>Show Your followers on your timeline.</span>
                                  <p>Permit visitors to view your full follower and following network on your public timeline</p>
                                </div>
                                <div className="seting-mode">
                                  <input
                                    type="checkbox"
                                    hidden
                                    id="switch9"
                                    checked={showCoursesAndResearches}
                                    onChange={(e) => setShowCoursesAndResearches(e.target.checked)}
                                  />
                                  <label className="switch" htmlFor="switch9"></label>
                                  <i className="icofont-read-book-alt"></i> <span>Show your courses and researches. </span>
                                  <p>Display your registered research papers, datasets, and authored courses to colleagues</p>
                                </div>
                                <button
                                  type="submit"
                                  className="button primary circle"
                                  style={{ marginTop: "20px" }}
                                  disabled={isUpdatingPrivacy}
                                >
                                  {isUpdatingPrivacy ? "Saving..." : "Save Changes"}
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ================= TAB 4: BILLING & PAYOUT ================= */}
                      {activeTab === "billing" && (
                        <div className="tab-pane active fade show" id="billing">
                          <div className="uk-width">
                            <div className="setting-card">
                              <h2>Billing &amp; Payout</h2>
                              <p className="mb-4">Want to charge for a course or receive grants? Provide your payment info and address.</p>
                              <div className="set-address">
                                <form onSubmit={handleSaveBilling}>
                                  <fieldset className="row merged-10">
                                    <div className="mb-4 col-lg-6 col-md-6 col-sm-6">
                                      <input
                                        className="uk-input"
                                        type="text"
                                        placeholder="First Name"
                                        value={billFirstName}
                                        onChange={(e) => setBillFirstName(e.target.value)}
                                      />
                                    </div>
                                    <div className="mb-4 col-lg-6 col-md-6 col-sm-6">
                                      <input
                                        className="uk-input"
                                        type="text"
                                        placeholder="Last Name"
                                        value={billLastName}
                                        onChange={(e) => setBillLastName(e.target.value)}
                                      />
                                    </div>
                                    <div className="uk-margin col-lg-12 mb-4">
                                      <select
                                        className="uk-select"
                                        value={billCountry}
                                        onChange={(e) => setBillCountry(e.target.value)}
                                      >
                                        <option value="USA">USA</option>
                                        <option value="UK">UK</option>
                                        <option value="UAE">UAE</option>
                                        <option value="Canada">Canada</option>
                                        <option value="Germany">Germany</option>
                                        <option value="Australia">Australia</option>
                                      </select>
                                    </div>
                                    <div className="mb-4 col-lg-6 col-md-6 col-sm-6">
                                      <input
                                        className="uk-input"
                                        type="text"
                                        placeholder="Address Line"
                                        value={billAddressLine1}
                                        onChange={(e) => setBillAddressLine1(e.target.value)}
                                      />
                                    </div>
                                    <div className="mb-4 col-lg-6 col-md-6 col-sm-6">
                                      <input
                                        className="uk-input"
                                        type="text"
                                        placeholder="Address Line 2"
                                        value={billAddressLine2}
                                        onChange={(e) => setBillAddressLine2(e.target.value)}
                                      />
                                    </div>
                                    <div className="mb-4 col-lg-6 col-md-6 col-sm-6">
                                      <input
                                        className="uk-input"
                                        type="text"
                                        placeholder="State / Province"
                                        value={billState}
                                        onChange={(e) => setBillState(e.target.value)}
                                      />
                                    </div>
                                    <div className="mb-4 col-lg-6 col-md-6 col-sm-6">
                                      <input
                                        className="uk-input"
                                        type="text"
                                        placeholder="City"
                                        value={billCity}
                                        onChange={(e) => setBillCity(e.target.value)}
                                      />
                                    </div>
                                    <div className="mb-4 col-lg-12">
                                      <textarea
                                        className="uk-textarea"
                                        rows={4}
                                        placeholder="Notes / Additional Billing Info"
                                        value={billNotes}
                                        onChange={(e) => setBillNotes(e.target.value)}
                                      ></textarea>
                                    </div>
                                  </fieldset>

                                  {/* Payment Methods Sub-tabs */}
                                  <div className="payment-methods mt-4">
                                    <h4>Select Payment Method</h4>
                                    <div className="light-bg pd-20" style={{ borderRadius: "8px" }}>
                                      <ul className="uk-tab uk-light nav nav-tabs" style={{ marginBottom: "20px" }}>
                                        <li className="nav-item">
                                          <a
                                            className={activePaymentTab === "visa" ? "active" : ""}
                                            href="#visa"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setActivePaymentTab("visa");
                                            }}
                                          >
                                            <img src="/images/visa-master.png" alt="Credit Card" />
                                          </a>
                                        </li>
                                        <li className="nav-item">
                                          <a
                                            className={activePaymentTab === "paypal" ? "active" : ""}
                                            href="#paypal"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setActivePaymentTab("paypal");
                                            }}
                                          >
                                            <img src="/images/paypal.png" alt="PayPal" />
                                          </a>
                                        </li>
                                        <li className="nav-item">
                                          <a
                                            className={activePaymentTab === "bitcoin" ? "active" : ""}
                                            href="#bitcoin"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setActivePaymentTab("bitcoin");
                                            }}
                                          >
                                            <img src="/images/bitcoin.png" alt="Bitcoin" />
                                          </a>
                                        </li>
                                        <li className="nav-item">
                                          <a
                                            className={activePaymentTab === "swift" ? "active" : ""}
                                            href="#swift"
                                            onClick={(e) => {
                                              e.preventDefault();
                                              setActivePaymentTab("swift");
                                            }}
                                          >
                                            <img src="/images/bank.png" alt="Bank Swift" />
                                          </a>
                                        </li>
                                      </ul>

                                      <div className="tab-content">
                                        {/* Sub-tab 1: Visa / Credit Card */}
                                        {activePaymentTab === "visa" && (
                                          <div className="tab-pane active fade show" id="visa">
                                            <div className="credit-card billing">
                                              <h6>
                                                <i className="icofont-check-circled"></i> Credit Cards
                                              </h6>
                                              <figure>
                                                <img src="/images/resources/Credit-Card-Logos.jpg" alt="Cards" />
                                              </figure>
                                              <div className="row merged20">
                                                <div className="col-lg-12 mb-4">
                                                  <input
                                                    className="uk-input"
                                                    type="text"
                                                    placeholder="Card Number"
                                                    value={cardNumber}
                                                    onChange={(e) => setCardNumber(e.target.value)}
                                                  />
                                                </div>
                                                <div className="col-lg-4 mb-4">
                                                  <select
                                                    className="uk-select"
                                                    value={cardMonth}
                                                    onChange={(e) => setCardMonth(e.target.value)}
                                                  >
                                                    <option>Month</option>
                                                    <option>January</option>
                                                    <option>February</option>
                                                    <option>March</option>
                                                    <option>April</option>
                                                    <option>May</option>
                                                    <option>June</option>
                                                    <option>July</option>
                                                    <option>August</option>
                                                    <option>September</option>
                                                    <option>October</option>
                                                    <option>November</option>
                                                    <option>December</option>
                                                  </select>
                                                </div>
                                                <div className="col-lg-4 mb-4">
                                                  <select
                                                    className="uk-select"
                                                    value={cardYear}
                                                    onChange={(e) => setCardYear(e.target.value)}
                                                  >
                                                    <option>2025</option>
                                                    <option>2026</option>
                                                    <option>2027</option>
                                                    <option>2028</option>
                                                    <option>2029</option>
                                                    <option>2030</option>
                                                  </select>
                                                </div>
                                                <div className="col-lg-4 mb-4">
                                                  <input
                                                    className="uk-input"
                                                    type="password"
                                                    placeholder="Security Code (CVV)"
                                                    maxLength={4}
                                                    value={cardCvv}
                                                    onChange={(e) => setCardCvv(e.target.value)}
                                                  />
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        )}

                                        {/* Sub-tab 2: PayPal */}
                                        {activePaymentTab === "paypal" && (
                                          <div className="tab-pane active fade show" id="paypal">
                                            <div className="paypal-card">
                                              <p>Provide your PayPal email to receive automatic peer review payments and course sales payouts.</p>
                                              <div className="uk-fieldset">
                                                <div className="uk-margin">
                                                  <label>PayPal Email Address</label>
                                                  <input
                                                    className="uk-input"
                                                    type="email"
                                                    placeholder="Your PayPal Email"
                                                    value={paypalEmail}
                                                    onChange={(e) => setPaypalEmail(e.target.value)}
                                                  />
                                                </div>
                                              </div>
                                              <p style={{ marginTop: "16px" }}>PayPal accepted worldwide.</p>
                                              <figure>
                                                <img src="/images/resources/Credit-Card-Logos.jpg" alt="Cards" />
                                              </figure>
                                            </div>
                                          </div>
                                        )}

                                        {/* Sub-tab 3: Bitcoin */}
                                        {activePaymentTab === "bitcoin" && (
                                          <div className="tab-pane active fade show" id="bitcoin">
                                            <div className="paypal-card">
                                              <p>Instant crypto transfers for research grants and global micro-donations.</p>
                                              <div className="uk-fieldset">
                                                <div className="uk-margin">
                                                  <label>Insert Your Bitcoin Address</label>
                                                  <input
                                                    className="uk-input"
                                                    type="text"
                                                    placeholder="BTC Wallet Address"
                                                    value={bitcoinAddress}
                                                    onChange={(e) => setBitcoinAddress(e.target.value)}
                                                  />
                                                </div>
                                              </div>
                                              <p style={{ marginTop: "16px" }}>Crypto payouts are confirmed within minutes.</p>
                                              <figure>
                                                <img src="/images/resources/Credit-Card-Logos.jpg" alt="Cards" />
                                              </figure>
                                            </div>
                                          </div>
                                        )}

                                        {/* Sub-tab 4: Swift / Bank Account */}
                                        {activePaymentTab === "swift" && (
                                          <div className="tab-pane active fade show" id="swift">
                                            <h6>Your Direct Bank Account</h6>
                                            <span>Withdrawal minimum $500.00</span>
                                            <p className="mt-3">
                                              Receive payouts directly to your primary bank account via wire transfer.
                                            </p>
                                            <fieldset className="row">
                                              <div className="mb-4 col-lg-6">
                                                <input
                                                  className="uk-input"
                                                  type="text"
                                                  placeholder="First Name"
                                                  value={bankFirstName}
                                                  onChange={(e) => setBankFirstName(e.target.value)}
                                                />
                                              </div>
                                              <div className="mb-4 col-lg-6">
                                                <input
                                                  className="uk-input"
                                                  type="text"
                                                  placeholder="Last Name"
                                                  value={bankLastName}
                                                  onChange={(e) => setBankLastName(e.target.value)}
                                                />
                                              </div>
                                              <div className="uk-margin col-lg-12 mb-4">
                                                <select
                                                  className="uk-select"
                                                  value={bankCountry}
                                                  onChange={(e) => setBankCountry(e.target.value)}
                                                >
                                                  <option value="USA">USA</option>
                                                  <option value="UK">UK</option>
                                                  <option value="UAE">UAE</option>
                                                  <option value="Canada">Canada</option>
                                                  <option value="Germany">Germany</option>
                                                </select>
                                              </div>
                                              <div className="mb-4 col-lg-6">
                                                <input
                                                  className="uk-input"
                                                  type="text"
                                                  placeholder="Bank Name"
                                                  value={bankName}
                                                  onChange={(e) => setBankName(e.target.value)}
                                                />
                                              </div>
                                              <div className="mb-4 col-lg-6">
                                                <input
                                                  className="uk-input"
                                                  type="text"
                                                  placeholder="Bank Address"
                                                  value={bankAddress}
                                                  onChange={(e) => setBankAddress(e.target.value)}
                                                />
                                              </div>
                                              <div className="mb-4 col-lg-6">
                                                <input
                                                  className="uk-input"
                                                  type="text"
                                                  placeholder="Swift Code"
                                                  value={swiftCode}
                                                  onChange={(e) => setSwiftCode(e.target.value)}
                                                />
                                              </div>
                                              <div className="mb-0 col-lg-6">
                                                <input
                                                  className="uk-input"
                                                  type="text"
                                                  placeholder="Bank Account No."
                                                  value={bankAccountNo}
                                                  onChange={(e) => setBankAccountNo(e.target.value)}
                                                />
                                              </div>
                                            </fieldset>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-4">
                                    <button
                                      type="submit"
                                      className="button primary circle"
                                      disabled={isUpdatingBilling}
                                    >
                                      {isUpdatingBilling ? "Saving..." : "Save Billing & Payout Details"}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ================= TAB 5: API CLIENTS ================= */}
                      {activeTab === "api" && (
                        <div className="tab-pane active fade show" id="api">
                          <div className="setting-card">
                            <h2>API Clients</h2>
                            <p className="mb-4">
                              The Socimo Developer &amp; Affiliate API exposes platform functionalities to help developers build client applications, automated research synchronizers, and integrations.
                            </p>
                            <div className="api">
                              {apiClients.length === 0 ? (
                                <div className="uk-alert-danger" style={{ padding: "20px", borderRadius: "8px" }}>
                                  <p>
                                    <i className="icofont-error"></i> You don&apos;t have any active API clients yet.
                                  </p>
                                  <button
                                    type="button"
                                    onClick={handleRequestApiClient}
                                    className="button soft-primary"
                                    disabled={isRequestingApi}
                                    style={{ marginTop: "10px", cursor: "pointer" }}
                                  >
                                    {isRequestingApi ? "Generating..." : "Request affiliate Api client"}
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                                    <h5>Your API Clients ({apiClients.length})</h5>
                                    <button
                                      type="button"
                                      onClick={handleRequestApiClient}
                                      className="button soft-primary"
                                      disabled={isRequestingApi}
                                      style={{ cursor: "pointer" }}
                                    >
                                      + Create Client
                                    </button>
                                  </div>
                                  <div className="table-responsive">
                                    <table className="table table-bordered" style={{ background: "#fff", borderRadius: "8px" }}>
                                      <thead>
                                        <tr style={{ background: "#f8fafc" }}>
                                          <th>Name</th>
                                          <th>Client ID</th>
                                          <th>Client Secret</th>
                                          <th>Created</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {apiClients.map((client) => (
                                          <tr key={client.clientId}>
                                            <td style={{ fontWeight: 600 }}>{client.name}</td>
                                            <td>
                                              <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                                                {client.clientId}
                                              </code>
                                            </td>
                                            <td>
                                              <code style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                                                {client.clientSecret.slice(0, 8)}••••••••••••
                                              </code>
                                            </td>
                                            <td style={{ fontSize: "13px", color: "#64748b" }}>
                                              {new Date(client.createdAt).toLocaleDateString()}
                                            </td>
                                            <td>
                                              <button
                                                type="button"
                                                className="button danger circle"
                                                style={{ padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}
                                                onClick={() => handleRevokeApiClient(client.clientId)}
                                                disabled={isRevokingApi}
                                              >
                                                Revoke
                                              </button>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ================= TAB 6: CLOSE ACCOUNT ================= */}
                      {activeTab === "close" && (
                        <div className="tab-pane active fade show" id="close">
                          <div className="del-account">
                            <h2>Close Account</h2>
                            <p className="mb-4">
                              <b>Warning:</b> If you close your account, you will be unsubscribed from all your followers and peers, your research publications will be archived, and you will lose access forever.
                            </p>
                            <form onSubmit={handleCloseAccount}>
                              <div className="row">
                                <div className="mb-4 col-lg-6">
                                  <input
                                    className="uk-input"
                                    type="password"
                                    placeholder="Enter Your Password to confirm"
                                    value={closePassword}
                                    onChange={(e) => setClosePassword(e.target.value)}
                                  />
                                </div>
                                <div className="mb-0 col-lg-6">
                                  <button
                                    type="button"
                                    className="button danger icon-label circle"
                                    style={{ cursor: "pointer", border: "none" }}
                                    onClick={() => {
                                      if (!closePassword.trim()) {
                                        showBanner("error", "Please enter your password first.");
                                        return;
                                      }
                                      setShowCloseConfirm(true);
                                    }}
                                    disabled={isClosingAccount}
                                  >
                                    <i className="icofont-trash"></i> {isClosingAccount ? "Closing..." : "Delete Account"}
                                  </button>
                                </div>
                              </div>

                              {/* Confirmation Dialog */}
                              {showCloseConfirm && (
                                <div
                                  style={{
                                    marginTop: "20px",
                                    padding: "20px",
                                    background: "#fef2f2",
                                    border: "1px solid #f87171",
                                    borderRadius: "8px",
                                  }}
                                >
                                  <h6 style={{ color: "#b91c1c", marginBottom: "8px" }}>
                                    Are you absolutely sure?
                                  </h6>
                                  <p style={{ color: "#7f1d1d", fontSize: "14px", marginBottom: "14px" }}>
                                    This action cannot be undone. All your posts, research items, and settings will be permanently removed.
                                  </p>
                                  <div style={{ display: "flex", gap: "12px" }}>
                                    <button
                                      type="submit"
                                      className="button danger circle"
                                      style={{ cursor: "pointer" }}
                                      disabled={isClosingAccount}
                                    >
                                      {isClosingAccount ? "Deleting..." : "Yes, permanently close my account"}
                                    </button>
                                    <button
                                      type="button"
                                      className="button primary circle"
                                      style={{ cursor: "pointer", background: "#64748b" }}
                                      onClick={() => setShowCloseConfirm(false)}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              )}
                            </form>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <AppFooter />
      </div>
    </RequireAuth>
  );
}
