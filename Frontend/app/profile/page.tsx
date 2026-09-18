import type { Metadata } from "next";
import Script from "next/script";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import ProfilePageClient from "@/components/profile/ProfilePageClient";
import AppFooter from "@/components/layout/AppFooter";

export const metadata: Metadata = {
  title: "My Profile – Updates Social Network",
  description:
    "Manage your personal profile on Updates. View your timeline, photos, videos, friends, and community connections.",
  alternates: {
    canonical: "/profile",
  },
};

export default function ProfilePage() {
  return (
    <RequireAuth>
      <>
        <div className="theme-layout">
          <HomeHeader />
          <ProfilePageClient />
          <AppFooter />
        </div>
        <Script id="profile-carousel-fix" strategy="lazyOnload">
          {`
            (function () {
              var carouselConfigs = [
                {
                  selector: ".suggested-caro",
                  options: {
                    items: 3,
                    loop: true,
                    margin: 30,
                    autoplay: false,
                    autoplayTimeout: 1500,
                    smartSpeed: 1000,
                    autoplayHoverPause: true,
                    nav: true,
                    dots: false,
                    responsiveClass: true,
                    responsive: {
                      0: { items: 1 },
                      600: { items: 2 },
                      1000: { items: 3 }
                    }
                  }
                },
                {
                  selector: ".videos-caro",
                  options: {
                    items: 3,
                    loop: true,
                    margin: 15,
                    autoplay: false,
                    video: true,
                    lazyLoad: true,
                    center: true,
                    merge: true,
                    videoWidth: true,
                    autoplayTimeout: 4500,
                    smartSpeed: 1000,
                    autoplayHoverPause: true,
                    nav: true,
                    dots: false,
                    responsiveClass: true,
                    responsive: {
                      0: { items: 1 },
                      600: { items: 2 },
                      1000: { items: 3 }
                    }
                  }
                }
              ];

              var tryInit = function () {
                var $ = window.jQuery;
                if (!$ || !$.fn || !$.fn.owlCarousel) {
                  return false;
                }

                carouselConfigs.forEach(function (config) {
                  $(config.selector).each(function () {
                    var $element = $(this);
                    if ($element.hasClass("owl-loaded")) {
                      return;
                    }

                    $element.owlCarousel(config.options);
                  });
                });

                return true;
              };

              var attempts = 0;
              var timer = window.setInterval(function () {
                attempts += 1;
                if (tryInit() || attempts > 20) {
                  window.clearInterval(timer);
                }
              }, 250);

              if (document.readyState !== "loading") {
                tryInit();
              } else {
                document.addEventListener("DOMContentLoaded", tryInit, { once: true });
              }

              window.addEventListener("load", tryInit, { once: true });
            })();
          `}
        </Script>
      </>
    </RequireAuth>
  );
}
