import Script from "next/script";
import RequireAuth from "@/components/auth/RequireAuth";
import HomeHeader from "@/components/layout/HomeHeader";
import ProfilePageClient from "@/components/profile/ProfilePageClient";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <>
        <div className="page-loader" id="page-loader">
          <div className="loader">
            <span className="loader-item"></span>
            <span className="loader-item"></span>
            <span className="loader-item"></span>
            <span className="loader-item"></span>
            <span className="loader-item"></span>
            <span className="loader-item"></span>
            <span className="loader-item"></span>
            <span className="loader-item"></span>
            <span className="loader-item"></span>
            <span className="loader-item"></span>
          </div>
        </div>

        <div className="theme-layout">
          <HomeHeader />
          <ProfilePageClient />
        </div>

        <Script id="profile-loader-fallback" strategy="afterInteractive">
          {`
            (function () {
              var hideLoader = function () {
                var loader = document.getElementById("page-loader");
                if (!loader) return;
                loader.classList.add("hidden");
                loader.style.display = "none";
              };

              if (document.readyState === "complete" || document.readyState === "interactive") {
                hideLoader();
              } else {
                document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
              }

              window.addEventListener("load", hideLoader, { once: true });
              setTimeout(hideLoader, 1500);
            })();
          `}
        </Script>
        <Script src="/js/main.min.js" strategy="afterInteractive" />
        <Script src="/js/script.js" strategy="afterInteractive" />
        <Script id="profile-header-shortcuts-fix" strategy="lazyOnload">
          {`
            (function () {
              var pageOptions = {
                items: 6,
                loop: true,
                margin: 0,
                autoplay: false,
                autoplayTimeout: 2500,
                smartSpeed: 1000,
                autoplayHoverPause: true,
                nav: false,
                dots: false,
                responsiveClass: true,
                responsive: {
                  0: { items: 5 },
                  600: { items: 5 },
                  1000: { items: 6 }
                }
              };

              var tryInit = function () {
                var $ = window.jQuery;
                if (!$ || !$.fn || !$.fn.owlCarousel) {
                  return false;
                }

                $(".header-shortcuts .page-caro").each(function () {
                  var $element = $(this);
                  if ($element.hasClass("owl-loaded")) {
                    return;
                  }

                  $element.owlCarousel(pageOptions);
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
        <Script id="profile-mobile-nav-fix" strategy="lazyOnload">
          {`
            (function () {
              var body = document.body;
              var nav = document.querySelector("nav.sidebar");
              if (!body || !nav) return;

              var triggerSelector = ".responsive-header .sidemenu, .header-shortcuts .sidemenu";
              var isMobile = function () {
                return window.matchMedia("(max-width: 990px)").matches;
              };

              var openNav = function () {
                nav.classList.add("hide");
                body.classList.add("mobile-nav-open");
              };

              var closeNav = function () {
                nav.classList.remove("hide");
                nav.classList.remove("padding");
                body.classList.remove("mobile-nav-open");
              };

              var toggleNav = function (event) {
                if (!isMobile()) return;
                event.preventDefault();
                event.stopPropagation();
                if (body.classList.contains("mobile-nav-open")) {
                  closeNav();
                } else {
                  openNav();
                }
              };

              var triggers = document.querySelectorAll(triggerSelector);
              triggers.forEach(function (trigger) {
                trigger.addEventListener("click", toggleNav);
              });

              nav.addEventListener("click", function (event) {
                event.stopPropagation();
              });

              document.addEventListener("click", function (event) {
                if (!isMobile() || !body.classList.contains("mobile-nav-open")) return;
                if (event.target.closest("nav.sidebar")) return;
                if (event.target.closest(triggerSelector)) return;
                closeNav();
              });

              document.addEventListener("keydown", function (event) {
                if (event.key === "Escape") {
                  closeNav();
                }
              });

              nav.querySelectorAll("a, button").forEach(function (action) {
                action.addEventListener("click", function () {
                  if (isMobile()) closeNav();
                });
              });

              window.addEventListener("resize", function () {
                if (!isMobile()) {
                  closeNav();
                }
              });
            })();
          `}
        </Script>
      </>
    </RequireAuth>
  );
}
