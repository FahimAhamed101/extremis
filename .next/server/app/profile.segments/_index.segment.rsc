1:"$Sreact.fragment"
2:I[96923,["/_next/static/chunks/39f02aaf9d9fc652.js","/_next/static/chunks/12c3c87450b3de5f.js"],"default"]
3:I[39756,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
4:I[37457,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
5:I[79520,["/_next/static/chunks/39f02aaf9d9fc652.js","/_next/static/chunks/12c3c87450b3de5f.js","/_next/static/chunks/f2e0bcd90ca49140.js","/_next/static/chunks/36098a26079d23c2.js","/_next/static/chunks/5d19e4a5274360a5.js"],""]
:HL["/_next/static/chunks/811793a089767f87.css","style"]
:HL["/css/main.min.css","style"]
:HL["/css/style.css","style"]
:HL["/css/color.css","style"]
:HL["/css/responsive.css","style"]
6:Tad0,
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
              loader.style.display = "none";
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
        0:{"buildId":"A7DH7tFL0CUQCXwdJq4La","rsc":["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/811793a089767f87.css","precedence":"next"}],["$","script","script-0",{"src":"/_next/static/chunks/39f02aaf9d9fc652.js","async":true}],["$","script","script-1",{"src":"/_next/static/chunks/12c3c87450b3de5f.js","async":true}]],["$","html",null,{"lang":"en","children":[["$","head",null,{"children":[["$","meta",null,{"name":"google-site-verification","content":"7D5GsLCJIj5u-4aD5whqMuZuQK5y5czs2M-JKQ6Qybk"}],["$","script",null,{"async":true,"src":"https://www.googletagmanager.com/gtag/js?id=G-JKXRLTXSG5"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n  gtag('config', 'G-JKXRLTXSG5');\n"}}],["$","link",null,{"rel":"icon","href":"/images/fav.png","type":"image/png","sizes":"16x16"}],["$","link",null,{"rel":"stylesheet","href":"/css/main.min.css"}],["$","link",null,{"rel":"stylesheet","href":"/css/style.css"}],["$","link",null,{"rel":"stylesheet","href":"/css/color.css"}],["$","link",null,{"rel":"stylesheet","href":"/css/responsive.css"}]]}],["$","body",null,{"children":[["$","div",null,{"className":"page-loader","id":"page-loader","children":["$","div",null,{"className":"loader","children":[["$","span","0",{"className":"loader-item"}],["$","span","1",{"className":"loader-item"}],["$","span","2",{"className":"loader-item"}],["$","span","3",{"className":"loader-item"}],["$","span","4",{"className":"loader-item"}],["$","span","5",{"className":"loader-item"}],["$","span","6",{"className":"loader-item"}],["$","span","7",{"className":"loader-item"}],["$","span","8",{"className":"loader-item"}],["$","span","9",{"className":"loader-item"}]]}]}],["$","$L2",null,{"children":["$","$L3",null,{"parallelRouterKey":"children","template":["$","$L4",null,{}],"notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]]}]}],[["$","$L5",null,{"id":"extremis-loader-control","strategy":"beforeInteractive","children":"\n          (function () {\n            var hideLoader = function () {\n              var loader = document.getElementById(\"page-loader\");\n              if (!loader) return;\n              loader.classList.add(\"hidden\");\n              loader.style.display = \"none\";\n            };\n\n            if (document.readyState === \"complete\" || document.readyState === \"interactive\") {\n              window.setTimeout(hideLoader, 0);\n            } else {\n              document.addEventListener(\"DOMContentLoaded\", hideLoader, { once: true });\n            }\n\n            window.addEventListener(\"load\", hideLoader, { once: true });\n            window.addEventListener(\"pageshow\", hideLoader);\n            window.setTimeout(hideLoader, 1500);\n          })();\n        "}],["$","$L5",null,{"src":"/js/main.min.js","strategy":"afterInteractive"}],["$","$L5",null,{"src":"/js/date-time.js","strategy":"afterInteractive"}],["$","$L5",null,{"src":"/js/script.js","strategy":"afterInteractive"}],["$","$L5",null,{"id":"extremis-shell-behavior","strategy":"lazyOnload","children":"$6"}]]]}]]}]]}],"loading":null,"isPartial":false}
