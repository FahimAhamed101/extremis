import Script from "next/script";

export default function GlobalShellScripts() {
  return (
    <>
      <Script src="/js/main.min.js" strategy="afterInteractive" />
      <Script src="/js/date-time.js" strategy="lazyOnload" />
      <Script src="/js/script.js" strategy="lazyOnload" />
      <Script id="extremis-shell-behavior" strategy="lazyOnload">
        {`
          (function () {
            if (window.__extremisShellBound) {
              return;
            }

            window.__extremisShellBound = true;

            var triggerSelector = ".responsive-header .sidemenu, .header-shortcuts .sidemenu";
            var isMobile = function () {
              return window.matchMedia("(max-width: 990px)").matches;
            };

            var getNav = function () {
              return document.querySelector("nav.sidebar");
            };

            var hideLoader = function () {
              var loader = document.getElementById("page-loader");
              if (!loader) return;
              loader.classList.add("hidden");
            };

            var openNav = function () {
              var nav = getNav();
              if (!nav) return;
              nav.classList.add("hide");
              document.body.classList.add("mobile-nav-open");
            };

            var closeNav = function () {
              var nav = getNav();
              if (nav) {
                nav.classList.remove("hide");
                nav.classList.remove("padding");
              }

              document.body.classList.remove("mobile-nav-open");
            };

            document.addEventListener("click", function (event) {
              var target = event.target;
              if (!(target instanceof Element)) return;

              var trigger = target.closest(triggerSelector);
              if (trigger) {
                if (!isMobile() || !getNav()) return;
                event.preventDefault();
                event.stopPropagation();

                if (document.body.classList.contains("mobile-nav-open")) {
                  closeNav();
                } else {
                  openNav();
                }
                return;
              }

              if (target.closest("nav.sidebar a, nav.sidebar button")) {
                if (isMobile()) {
                  window.setTimeout(closeNav, 0);
                }
                return;
              }

              if (!isMobile() || !document.body.classList.contains("mobile-nav-open")) return;
              if (target.closest("nav.sidebar")) return;
              closeNav();
            });

            document.addEventListener("keydown", function (event) {
              if (event.key === "Escape") {
                closeNav();
              }
            });

            window.addEventListener("resize", function () {
              if (!isMobile()) {
                closeNav();
              }
            });

            window.addEventListener("pageshow", function () {
              closeNav();
              hideLoader();
            });
          })();
        `}
      </Script>
    </>
  );
}
