const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

function normalizeText(value) {
  return String(value || "").trim();
}

async function getSettings(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const basicProfile = {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      designation: user.position || "",
      bio: user.bio || "",
      email: user.email || "",
      avatarUrl: user.avatarUrl || "/images/resources/user.jpg",
    };

    const socialLinks = {
      facebook: user.socialLinks?.facebook || "",
      twitter: user.socialLinks?.twitter || "",
      instagram: user.socialLinks?.instagram || "",
      youtube: user.socialLinks?.youtube || "",
    };

    const notificationSettings = {
      subscriptions: user.notificationSettings?.subscriptions ?? true,
      recommendedResearches: user.notificationSettings?.recommendedResearches ?? true,
      activeComments: user.notificationSettings?.activeComments ?? true,
      replyComments: user.notificationSettings?.replyComments ?? true,
      emailAcademicUpdates: user.notificationSettings?.emailAcademicUpdates ?? true,
      promotionalRecommendations: user.notificationSettings?.promotionalRecommendations ?? false,
    };

    const privacySettings = {
      searchEngineVisible: user.privacySettings?.searchEngineVisible ?? true,
      showFollowersOnTimeline: user.privacySettings?.showFollowersOnTimeline ?? true,
      showCoursesAndResearches: user.privacySettings?.showCoursesAndResearches ?? true,
    };

    const billingAddress = {
      firstName: user.billingAddress?.firstName || user.firstName || "",
      lastName: user.billingAddress?.lastName || user.lastName || "",
      country: user.billingAddress?.country || "USA",
      addressLine1: user.billingAddress?.addressLine1 || "",
      addressLine2: user.billingAddress?.addressLine2 || "",
      state: user.billingAddress?.state || "",
      city: user.billingAddress?.city || "",
      notes: user.billingAddress?.notes || "",
    };

    const paymentMethod = {
      methodType: user.paymentMethod?.methodType || "visa",
      cardNumber: user.paymentMethod?.cardNumber || "",
      cardMonth: user.paymentMethod?.cardMonth || "Month",
      cardYear: user.paymentMethod?.cardYear || "2026",
      cardCvv: user.paymentMethod?.cardCvv || "",
      paypalEmail: user.paymentMethod?.paypalEmail || "",
      bitcoinAddress: user.paymentMethod?.bitcoinAddress || "",
      bankFirstName: user.paymentMethod?.bankFirstName || user.firstName || "",
      bankLastName: user.paymentMethod?.bankLastName || user.lastName || "",
      bankCountry: user.paymentMethod?.bankCountry || "USA",
      bankName: user.paymentMethod?.bankName || "",
      bankAddress: user.paymentMethod?.bankAddress || "",
      swiftCode: user.paymentMethod?.swiftCode || "",
      bankAccountNo: user.paymentMethod?.bankAccountNo || "",
    };

    const apiClients = Array.isArray(user.apiClients) ? user.apiClients : [];

    res.status(200).json({
      success: true,
      basicProfile,
      socialLinks,
      notificationSettings,
      privacySettings,
      billingAddress,
      paymentMethod,
      apiClients,
    });
  } catch (error) {
    next(error);
  }
}

async function updateAccountSettings(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { firstName, lastName, designation, bio, socialLinks } = req.body || {};

    if (firstName !== undefined) user.firstName = normalizeText(firstName);
    if (lastName !== undefined) user.lastName = normalizeText(lastName);
    if (designation !== undefined) user.position = normalizeText(designation);
    if (bio !== undefined) user.bio = normalizeText(bio);

    if (socialLinks && typeof socialLinks === "object") {
      user.socialLinks = {
        facebook: normalizeText(socialLinks.facebook),
        twitter: normalizeText(socialLinks.twitter),
        instagram: normalizeText(socialLinks.instagram),
        youtube: normalizeText(socialLinks.youtube),
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Account settings updated successfully.",
      basicProfile: {
        firstName: user.firstName,
        lastName: user.lastName,
        designation: user.position,
        bio: user.bio,
      },
      socialLinks: user.socialLinks,
    });
  } catch (error) {
    next(error);
  }
}

async function updateNotificationSettings(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const current = user.notificationSettings || {};
    const payload = req.body || {};

    user.notificationSettings = {
      subscriptions: payload.subscriptions !== undefined ? Boolean(payload.subscriptions) : (current.subscriptions ?? true),
      recommendedResearches: payload.recommendedResearches !== undefined ? Boolean(payload.recommendedResearches) : (current.recommendedResearches ?? true),
      activeComments: payload.activeComments !== undefined ? Boolean(payload.activeComments) : (current.activeComments ?? true),
      replyComments: payload.replyComments !== undefined ? Boolean(payload.replyComments) : (current.replyComments ?? true),
      emailAcademicUpdates: payload.emailAcademicUpdates !== undefined ? Boolean(payload.emailAcademicUpdates) : (current.emailAcademicUpdates ?? true),
      promotionalRecommendations: payload.promotionalRecommendations !== undefined ? Boolean(payload.promotionalRecommendations) : (current.promotionalRecommendations ?? false),
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Notification settings updated successfully.",
      notificationSettings: user.notificationSettings,
    });
  } catch (error) {
    next(error);
  }
}

async function updatePrivacySettings(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const current = user.privacySettings || {};
    const payload = req.body || {};

    user.privacySettings = {
      searchEngineVisible: payload.searchEngineVisible !== undefined ? Boolean(payload.searchEngineVisible) : (current.searchEngineVisible ?? true),
      showFollowersOnTimeline: payload.showFollowersOnTimeline !== undefined ? Boolean(payload.showFollowersOnTimeline) : (current.showFollowersOnTimeline ?? true),
      showCoursesAndResearches: payload.showCoursesAndResearches !== undefined ? Boolean(payload.showCoursesAndResearches) : (current.showCoursesAndResearches ?? true),
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Privacy settings updated successfully.",
      privacySettings: user.privacySettings,
    });
  } catch (error) {
    next(error);
  }
}

async function updateBillingSettings(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { billingAddress, paymentMethod } = req.body || {};

    if (billingAddress && typeof billingAddress === "object") {
      user.billingAddress = {
        firstName: normalizeText(billingAddress.firstName),
        lastName: normalizeText(billingAddress.lastName),
        country: normalizeText(billingAddress.country) || "USA",
        addressLine1: normalizeText(billingAddress.addressLine1),
        addressLine2: normalizeText(billingAddress.addressLine2),
        state: normalizeText(billingAddress.state),
        city: normalizeText(billingAddress.city),
        notes: normalizeText(billingAddress.notes),
      };
    }

    if (paymentMethod && typeof paymentMethod === "object") {
      const currentPay = user.paymentMethod || {};
      user.paymentMethod = {
        methodType: normalizeText(paymentMethod.methodType || currentPay.methodType || "visa"),
        cardNumber: paymentMethod.cardNumber !== undefined ? normalizeText(paymentMethod.cardNumber) : currentPay.cardNumber,
        cardMonth: paymentMethod.cardMonth !== undefined ? normalizeText(paymentMethod.cardMonth) : currentPay.cardMonth,
        cardYear: paymentMethod.cardYear !== undefined ? normalizeText(paymentMethod.cardYear) : currentPay.cardYear,
        cardCvv: paymentMethod.cardCvv !== undefined ? normalizeText(paymentMethod.cardCvv) : currentPay.cardCvv,
        paypalEmail: paymentMethod.paypalEmail !== undefined ? normalizeText(paymentMethod.paypalEmail) : currentPay.paypalEmail,
        bitcoinAddress: paymentMethod.bitcoinAddress !== undefined ? normalizeText(paymentMethod.bitcoinAddress) : currentPay.bitcoinAddress,
        bankFirstName: paymentMethod.bankFirstName !== undefined ? normalizeText(paymentMethod.bankFirstName) : currentPay.bankFirstName,
        bankLastName: paymentMethod.bankLastName !== undefined ? normalizeText(paymentMethod.bankLastName) : currentPay.bankLastName,
        bankCountry: paymentMethod.bankCountry !== undefined ? normalizeText(paymentMethod.bankCountry) : currentPay.bankCountry,
        bankName: paymentMethod.bankName !== undefined ? normalizeText(paymentMethod.bankName) : currentPay.bankName,
        bankAddress: paymentMethod.bankAddress !== undefined ? normalizeText(paymentMethod.bankAddress) : currentPay.bankAddress,
        swiftCode: paymentMethod.swiftCode !== undefined ? normalizeText(paymentMethod.swiftCode) : currentPay.swiftCode,
        bankAccountNo: paymentMethod.bankAccountNo !== undefined ? normalizeText(paymentMethod.bankAccountNo) : currentPay.bankAccountNo,
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Billing and payout settings updated successfully.",
      billingAddress: user.billingAddress,
      paymentMethod: user.paymentMethod,
    });
  } catch (error) {
    next(error);
  }
}

async function requestApiClient(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const clientId = `socimo_live_${crypto.randomBytes(12).toString("hex")}`;
    const clientSecret = `sec_${crypto.randomBytes(24).toString("hex")}`;
    const clientName = normalizeText(req.body?.name) || `Affiliate API Client #${(user.apiClients?.length || 0) + 1}`;

    const newClient = {
      clientId,
      clientSecret,
      name: clientName,
      createdAt: new Date(),
    };

    if (!Array.isArray(user.apiClients)) {
      user.apiClients = [];
    }

    user.apiClients.push(newClient);
    await user.save();

    res.status(201).json({
      success: true,
      message: "New API client generated successfully.",
      client: newClient,
      apiClients: user.apiClients,
    });
  } catch (error) {
    next(error);
  }
}

async function revokeApiClient(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const { clientId } = req.params;
    user.apiClients = (user.apiClients || []).filter((c) => c.clientId !== clientId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "API client revoked successfully.",
      apiClients: user.apiClients,
    });
  } catch (error) {
    next(error);
  }
}

async function closeAccount(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const password = String(req.body?.password || "").trim();
    if (!password) {
      return res.status(400).json({ message: "Please enter your password to confirm account deletion." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password. Account closure canceled." });
    }

    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: "Your account has been permanently closed.",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getSettings,
  updateAccountSettings,
  updateNotificationSettings,
  updatePrivacySettings,
  updateBillingSettings,
  requestApiClient,
  revokeApiClient,
  closeAccount,
};
