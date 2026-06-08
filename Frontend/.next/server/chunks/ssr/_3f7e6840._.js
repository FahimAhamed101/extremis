module.exports=[72123,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(11857);a.n(d("[project]/node_modules/next/dist/client/script.js <module evaluation>"))},44536,(a,b,c)=>{let{createClientModuleProxy:d}=a.r(11857);a.n(d("[project]/node_modules/next/dist/client/script.js"))},11153,a=>{"use strict";a.i(72123);var b=a.i(44536);a.n(b)},71618,(a,b,c)=>{b.exports=a.r(11153)},37257,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/app/providers.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/app/providers.tsx <module evaluation>","default")},4568,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/app/providers.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/app/providers.tsx","default")},88725,a=>{"use strict";a.i(37257);var b=a.i(4568);a.n(b)},5083,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/components/layout/PageLoader.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/layout/PageLoader.tsx <module evaluation>","default")},18994,a=>{"use strict";a.s(["default",()=>b]);let b=(0,a.i(11857).registerClientReference)(function(){throw Error("Attempted to call the default export of [project]/components/layout/PageLoader.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"[project]/components/layout/PageLoader.tsx","default")},70419,a=>{"use strict";a.i(5083);var b=a.i(18994);a.n(b)},33290,a=>{"use strict";var b=a.i(7997),c=a.i(88725),d=a.i(70419),e=a.i(71618);function f(){return(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(e.default,{src:"/js/main.min.js",strategy:"afterInteractive"}),(0,b.jsx)(e.default,{src:"/js/date-time.js",strategy:"lazyOnload"}),(0,b.jsx)(e.default,{src:"/js/script.js",strategy:"lazyOnload"}),(0,b.jsx)(e.default,{id:"extremis-shell-behavior",strategy:"lazyOnload",children:`
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
        `})]})}let g="https://www.extremis.top",h=function(){let a=String("http://localhost:3000").trim().replace(/\/+$/,""),b=a?/^https?:\/\//i.test(a)?a:`https://${a}`:g;try{return new URL(b).origin}catch{return g}}(),i={metadataBase:new URL(h),title:{default:"Extremis | Social Media Network Template",template:"%s | Extremis"},description:"Extremis is a research-focused social network for students, educators, and professionals.",applicationName:"Extremis",keywords:["Extremis","research social network","students network","academic community","research collaboration"],alternates:{canonical:"/"},openGraph:{type:"website",locale:"en_US",url:h,siteName:"Extremis",title:"Extremis | Social Media Network Template",description:"Extremis is a research-focused social network for students, educators, and professionals.",images:[{url:"/images/logo.png",width:512,height:512,alt:"Extremis"}]},twitter:{card:"summary_large_image",title:"Extremis | Social Media Network Template",description:"Extremis is a research-focused social network for students, educators, and professionals.",images:["/images/logo.png"]},robots:{index:!0,follow:!0,googleBot:{index:!0,follow:!0,"max-image-preview":"large","max-snippet":-1,"max-video-preview":-1}}};function j({children:a}){return(0,b.jsxs)("html",{lang:"en",suppressHydrationWarning:!0,children:[(0,b.jsxs)("head",{children:[(0,b.jsx)("meta",{name:"google-site-verification",content:"7D5GsLCJIj5u-4aD5whqMuZuQK5y5czs2M-JKQ6Qybk"}),(0,b.jsx)("script",{async:!0,src:"https://www.googletagmanager.com/gtag/js?id=G-JKXRLTXSG5"}),(0,b.jsx)("script",{dangerouslySetInnerHTML:{__html:`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-JKXRLTXSG5');
`}}),(0,b.jsx)("link",{rel:"icon",href:"/images/fav.png",type:"image/png",sizes:"16x16"}),(0,b.jsx)("link",{rel:"stylesheet",href:"/css/main.min.css"}),(0,b.jsx)("link",{rel:"stylesheet",href:"/css/style.css"}),(0,b.jsx)("link",{rel:"stylesheet",href:"/css/color.css"}),(0,b.jsx)("link",{rel:"stylesheet",href:"/css/responsive.css"})]}),(0,b.jsxs)("body",{suppressHydrationWarning:!0,children:[(0,b.jsx)(d.default,{}),(0,b.jsx)(c.default,{children:a}),(0,b.jsx)(f,{})]})]})}a.s(["default",()=>j,"metadata",0,i],33290)}];

//# sourceMappingURL=_3f7e6840._.js.map