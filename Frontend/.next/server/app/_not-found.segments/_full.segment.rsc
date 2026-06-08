1:"$Sreact.fragment"
2:I[75432,["/_next/static/chunks/795c13c535cd64a8.js","/_next/static/chunks/a94a6f5a850fd8b2.js"],"default"]
3:I[96923,["/_next/static/chunks/795c13c535cd64a8.js","/_next/static/chunks/a94a6f5a850fd8b2.js"],"default"]
4:I[39756,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
5:I[37457,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
6:I[79520,["/_next/static/chunks/795c13c535cd64a8.js","/_next/static/chunks/a94a6f5a850fd8b2.js"],""]
b:I[68027,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
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
        0:{"P":null,"b":"z792imkg9BSA9e4rg9BUY","c":["","_not-found"],"q":"","i":false,"f":[[["",{"children":["/_not-found",{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],[["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/81f6265c9ad86270.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}],["$","script","script-0",{"src":"/_next/static/chunks/795c13c535cd64a8.js","async":true,"nonce":"$undefined"}],["$","script","script-1",{"src":"/_next/static/chunks/a94a6f5a850fd8b2.js","async":true,"nonce":"$undefined"}]],["$","html",null,{"lang":"en","suppressHydrationWarning":true,"children":[["$","head",null,{"children":[["$","meta",null,{"name":"google-site-verification","content":"7D5GsLCJIj5u-4aD5whqMuZuQK5y5czs2M-JKQ6Qybk"}],["$","script",null,{"async":true,"src":"https://www.googletagmanager.com/gtag/js?id=G-JKXRLTXSG5"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n  gtag('config', 'G-JKXRLTXSG5');\n"}}],["$","link",null,{"rel":"icon","href":"/images/fav.png","type":"image/png","sizes":"16x16"}],["$","link",null,{"rel":"stylesheet","href":"/css/main.min.css"}],["$","link",null,{"rel":"stylesheet","href":"/css/style.css"}],["$","link",null,{"rel":"stylesheet","href":"/css/color.css"}],["$","link",null,{"rel":"stylesheet","href":"/css/responsive.css"}]]}],["$","body",null,{"suppressHydrationWarning":true,"children":[["$","$L2",null,{}],["$","$L3",null,{"children":["$","$L4",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L5",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}],[["$","$L6",null,{"src":"/js/main.min.js","strategy":"afterInteractive"}],["$","$L6",null,{"src":"/js/date-time.js","strategy":"lazyOnload"}],["$","$L6",null,{"src":"/js/script.js","strategy":"lazyOnload"}],["$","$L6",null,{"id":"extremis-shell-behavior","strategy":"lazyOnload","children":"$7"}]]]}]]}]]}],{"children":["$L8",{"children":["$L9",{},null,false,false]},null,false,false]},null,false,false],"$La",false]],"m":"$undefined","G":["$b","$undefined"],"S":true}
c:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"OutletBoundary"]
d:"$Sreact.suspense"
f:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"ViewportBoundary"]
11:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"MetadataBoundary"]
8:["$","$1","c",{"children":[null,["$","$L4",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L5",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}]
9:["$","$1","c",{"children":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":"$0:f:0:1:0:props:children:1:props:children:1:props:children:1:props:children:props:notFound:0:1:props:style","children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":"$0:f:0:1:0:props:children:1:props:children:1:props:children:1:props:children:props:notFound:0:1:props:children:props:children:1:props:style","children":404}],["$","div",null,{"style":"$0:f:0:1:0:props:children:1:props:children:1:props:children:1:props:children:props:notFound:0:1:props:children:props:children:2:props:style","children":["$","h2",null,{"style":"$0:f:0:1:0:props:children:1:props:children:1:props:children:1:props:children:props:notFound:0:1:props:children:props:children:2:props:children:props:style","children":"This page could not be found."}]}]]}]}]],null,["$","$Lc",null,{"children":["$","$d",null,{"name":"Next.MetadataOutlet","children":"$@e"}]}]]}]
a:["$","$1","h",{"children":[["$","meta",null,{"name":"robots","content":"noindex"}],["$","$Lf",null,{"children":"$L10"}],["$","div",null,{"hidden":true,"children":["$","$L11",null,{"children":["$","$d",null,{"name":"Next.Metadata","children":"$L12"}]}]}],null]}]
10:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
13:I[27201,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"IconMark"]
e:null
12:[["$","title","0",{"children":"Extremis | Social Media Network Template"}],["$","meta","1",{"name":"description","content":"Extremis is a research-focused social network for students, educators, and professionals."}],["$","meta","2",{"name":"application-name","content":"Extremis"}],["$","meta","3",{"name":"keywords","content":"Extremis,research social network,students network,academic community,research collaboration"}],["$","meta","4",{"name":"robots","content":"index, follow"}],["$","meta","5",{"name":"googlebot","content":"index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"}],["$","link","6",{"rel":"canonical","href":"http://localhost:3000"}],["$","meta","7",{"property":"og:title","content":"Extremis | Social Media Network Template"}],["$","meta","8",{"property":"og:description","content":"Extremis is a research-focused social network for students, educators, and professionals."}],["$","meta","9",{"property":"og:url","content":"http://localhost:3000"}],["$","meta","10",{"property":"og:site_name","content":"Extremis"}],["$","meta","11",{"property":"og:locale","content":"en_US"}],["$","meta","12",{"property":"og:image","content":"http://localhost:3000/images/logo.png"}],["$","meta","13",{"property":"og:image:width","content":"512"}],["$","meta","14",{"property":"og:image:height","content":"512"}],["$","meta","15",{"property":"og:image:alt","content":"Extremis"}],["$","meta","16",{"property":"og:type","content":"website"}],["$","meta","17",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","18",{"name":"twitter:title","content":"Extremis | Social Media Network Template"}],["$","meta","19",{"name":"twitter:description","content":"Extremis is a research-focused social network for students, educators, and professionals."}],["$","meta","20",{"name":"twitter:image","content":"http://localhost:3000/images/logo.png"}],["$","link","21",{"rel":"icon","href":"/favicon.ico?favicon.0b3bf435.ico","sizes":"256x256","type":"image/x-icon"}],["$","$L13","22",{}]]
