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

            var triggerSelector = ".sidemenu, #side-menu, #side-menu2, .responsive-header .sidemenu, .header-shortcuts .sidemenu";

            var hideLoader = function () {
              var loader = document.getElementById("page-loader");
              if (!loader) return;
              loader.classList.add("hidden");
            };

            var closeAllNav = function () {
              var navs = document.querySelectorAll("nav.sidebar");
              navs.forEach(function (nav) {
                nav.classList.remove("hide");
                nav.classList.remove("padding");
              });
              document.body.classList.remove("mobile-nav-open");
              window.dispatchEvent(new CustomEvent("close-socimo-sidebar"));
            };

            document.addEventListener("click", function (event) {
              var target = event.target;
              if (!(target instanceof Element)) return;

              var trigger = target.closest(triggerSelector);
              if (trigger) {
                event.preventDefault();
                event.stopPropagation();

                // Dispatch to React HomeHeader state
                window.dispatchEvent(new CustomEvent("toggle-socimo-sidebar"));

                // Also toggle any static DOM nav.sidebar if present
                var nav = document.querySelector("nav.sidebar");
                if (nav) {
                  if (nav.classList.contains("hide")) {
                    nav.classList.remove("hide");
                    document.body.classList.remove("mobile-nav-open");
                  } else {
                    nav.classList.add("hide");
                    document.body.classList.add("mobile-nav-open");
                  }
                }
                return;
              }

              if (target.closest("nav.sidebar a, nav.sidebar button, .socimo-sidebar-overlay")) {
                closeAllNav();
                return;
              }

              if (document.body.classList.contains("mobile-nav-open")) {
                if (target.closest("nav.sidebar")) return;
                closeAllNav();
              }
            });

            document.addEventListener("keydown", function (event) {
              if (event.key === "Escape") {
                closeAllNav();
              }
            });

            window.addEventListener("pageshow", function () {
              closeAllNav();
              hideLoader();
            });
          })();
        `}
      </Script>
    </>
  );
}
