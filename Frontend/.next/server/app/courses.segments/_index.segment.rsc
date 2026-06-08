1:"$Sreact.fragment"
2:I[75432,["/_next/static/chunks/795c13c535cd64a8.js","/_next/static/chunks/a94a6f5a850fd8b2.js"],"default"]
3:I[96923,["/_next/static/chunks/795c13c535cd64a8.js","/_next/static/chunks/a94a6f5a850fd8b2.js"],"default"]
4:I[39756,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
5:I[37457,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
6:I[79520,["/_next/static/chunks/795c13c535cd64a8.js","/_next/static/chunks/a94a6f5a850fd8b2.js"],""]
:HL["/_next/static/chunks/81f6265c9ad86270.css","style"]
:HL["/css/main.min.css","style"]
:HL["/css/style.css","style"]
:HL["/css/color.css","style"]
:HL["/css/responsive.css","style"]
7:Taa3,
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
        0:{"buildId":"z792imkg9BSA9e4rg9BUY","rsc":["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/81f6265c9ad86270.css","precedence":"next"}],["$","script","script-0",{"src":"/_next/static/chunks/795c13c535cd64a8.js","async":true}],["$","script","script-1",{"src":"/_next/static/chunks/a94a6f5a850fd8b2.js","async":true}]],["$","html",null,{"lang":"en","suppressHydrationWarning":true,"children":[["$","head",null,{"children":[["$","meta",null,{"name":"google-site-verification","content":"7D5GsLCJIj5u-4aD5whqMuZuQK5y5czs2M-JKQ6Qybk"}],["$","script",null,{"async":true,"src":"https://www.googletagmanager.com/gtag/js?id=G-JKXRLTXSG5"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n  gtag('config', 'G-JKXRLTXSG5');\n"}}],["$","link",null,{"rel":"icon","href":"/images/fav.png","type":"image/png","sizes":"16x16"}],["$","link",null,{"rel":"stylesheet","href":"/css/main.min.css"}],["$","link",null,{"rel":"stylesheet","href":"/css/style.css"}],["$","link",null,{"rel":"stylesheet","href":"/css/color.css"}],["$","link",null,{"rel":"stylesheet","href":"/css/responsive.css"}]]}],["$","body",null,{"suppressHydrationWarning":true,"children":[["$","$L2",null,{}],["$","$L3",null,{"children":["$","$L4",null,{"parallelRouterKey":"children","template":["$","$L5",null,{}],"notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]]}]}],[["$","$L6",null,{"src":"/js/main.min.js","strategy":"afterInteractive"}],["$","$L6",null,{"src":"/js/date-time.js","strategy":"lazyOnload"}],["$","$L6",null,{"src":"/js/script.js","strategy":"lazyOnload"}],["$","$L6",null,{"id":"extremis-shell-behavior","strategy":"lazyOnload","children":"$7"}]]]}]]}]]}],"loading":null,"isPartial":false}
