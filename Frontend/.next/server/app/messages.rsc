1:"$Sreact.fragment"
2:I[75432,["/_next/static/chunks/795c13c535cd64a8.js","/_next/static/chunks/a94a6f5a850fd8b2.js"],"default"]
3:I[96923,["/_next/static/chunks/795c13c535cd64a8.js","/_next/static/chunks/a94a6f5a850fd8b2.js"],"default"]
4:I[39756,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
5:I[37457,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"default"]
6:I[79520,["/_next/static/chunks/795c13c535cd64a8.js","/_next/static/chunks/a94a6f5a850fd8b2.js"],""]
b:I[68027,[],"default"]
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
        0:{"P":null,"b":"z792imkg9BSA9e4rg9BUY","c":["","messages"],"q":"","i":false,"f":[[["",{"children":["messages",{"children":["__PAGE__",{}]}]},"$undefined","$undefined",true],[["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/chunks/81f6265c9ad86270.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}],["$","script","script-0",{"src":"/_next/static/chunks/795c13c535cd64a8.js","async":true,"nonce":"$undefined"}],["$","script","script-1",{"src":"/_next/static/chunks/a94a6f5a850fd8b2.js","async":true,"nonce":"$undefined"}]],["$","html",null,{"lang":"en","suppressHydrationWarning":true,"children":[["$","head",null,{"children":[["$","meta",null,{"name":"google-site-verification","content":"7D5GsLCJIj5u-4aD5whqMuZuQK5y5czs2M-JKQ6Qybk"}],["$","script",null,{"async":true,"src":"https://www.googletagmanager.com/gtag/js?id=G-JKXRLTXSG5"}],["$","script",null,{"dangerouslySetInnerHTML":{"__html":"\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n\n  gtag('config', 'G-JKXRLTXSG5');\n"}}],["$","link",null,{"rel":"icon","href":"/images/fav.png","type":"image/png","sizes":"16x16"}],["$","link",null,{"rel":"stylesheet","href":"/css/main.min.css"}],["$","link",null,{"rel":"stylesheet","href":"/css/style.css"}],["$","link",null,{"rel":"stylesheet","href":"/css/color.css"}],["$","link",null,{"rel":"stylesheet","href":"/css/responsive.css"}]]}],["$","body",null,{"suppressHydrationWarning":true,"children":[["$","$L2",null,{}],["$","$L3",null,{"children":["$","$L4",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L5",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}],[["$","$L6",null,{"src":"/js/main.min.js","strategy":"afterInteractive"}],["$","$L6",null,{"src":"/js/date-time.js","strategy":"lazyOnload"}],["$","$L6",null,{"src":"/js/script.js","strategy":"lazyOnload"}],["$","$L6",null,{"id":"extremis-shell-behavior","strategy":"lazyOnload","children":"$7"}]]]}]]}]]}],{"children":["$L8",{"children":["$L9",{},null,false,false]},null,false,false]},null,false,false],"$La",false]],"m":"$undefined","G":["$b",[]],"S":true}
c:I[59705,["/_next/static/chunks/795c13c535cd64a8.js","/_next/static/chunks/a94a6f5a850fd8b2.js","/_next/static/chunks/6407d745017d3efe.js","/_next/static/chunks/e12fd631829c0013.js"],"default"]
d:I[67562,["/_next/static/chunks/795c13c535cd64a8.js","/_next/static/chunks/a94a6f5a850fd8b2.js","/_next/static/chunks/6407d745017d3efe.js","/_next/static/chunks/e12fd631829c0013.js"],"default"]
e:I[22016,["/_next/static/chunks/795c13c535cd64a8.js","/_next/static/chunks/a94a6f5a850fd8b2.js","/_next/static/chunks/6407d745017d3efe.js","/_next/static/chunks/e12fd631829c0013.js"],""]
1f:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"ViewportBoundary"]
21:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"MetadataBoundary"]
22:"$Sreact.suspense"
8:["$","$1","c",{"children":[null,["$","$L4",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L5",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}]
9:["$","$1","c",{"children":[["$","$Lc",null,{"children":["$","div",null,{"className":"theme-layout","children":[["$","$Ld",null,{}],["$","nav",null,{"className":"sidebar","children":["$","ul",null,{"className":"menu-slide","children":[["$","li","Home",{"className":"menu-item-has-children active","children":[["$","a",null,{"href":"#","title":"Home","children":[["$","i",null,{"className":"icofont-home"}]," ","Home"]}],["$","ul",null,{"className":"submenu","children":[["$","li","Home-Newsfeed",{"children":["$","$Le",null,{"href":"/","title":"Newsfeed","children":"Newsfeed"}]}],["$","li","Home-Company Home",{"children":["$","a",null,{"href":"company-home.html","title":"Company Home","children":"Company Home"}]}],["$","li","Home-User Profile",{"children":["$","$Le",null,{"href":"/profile","title":"User Profile","children":"User Profile"}]}],["$","li","Home-Student User Profile",{"children":["$","$Le",null,{"href":"/profile","title":"Student User Profile","children":"Student User Profile"}]}],["$","li","Home-Groups",{"children":["$","a",null,{"href":"groups.html","title":"Groups","children":"Groups"}]}],["$","li","Home-Group Detail",{"children":["$","a",null,{"href":"group-detail.html","title":"Group Detail","children":"Group Detail"}]}],["$","li","Home-Social Post Detail",{"children":["$","a",null,{"href":"post-detail.html","title":"Social Post Detail","children":"Social Post Detail"}]}],["$","li","Home-Chat/Messages",{"children":["$","$Le",null,{"href":"/messages","title":"Chat/Messages","children":"Chat/Messages"}]}],["$","li","Home-Notifications",{"children":["$","a",null,{"href":"notifications.html","title":"Notifications","children":"Notifications"}]}],["$","li","Home-Search Result",{"children":["$","a",null,{"href":"search-result.html","title":"Search Result","children":"Search Result"}]}]]}]]}],["$","li","Features",{"className":"menu-item-has-children","children":[["$","a",null,{"href":"#","title":"Features","children":[["$","i",null,{"className":"icofont-flash"}]," ","Features"]}],["$","ul",null,{"className":"submenu","children":[["$","li","Features-Videos",{"children":["$","$Le",null,{"href":"/videos","title":"Videos","children":"Videos"}]}],["$","li","Features-Live Stream",{"children":["$","a",null,{"href":"live-stream.html","title":"Live Stream","children":"Live Stream"}]}],["$","li","Features-Events Page",{"children":["$","a",null,{"href":"event-page.html","title":"Events Page","children":"Events Page"}]}],["$","li","Features-Event Detail",{"children":["$","a",null,{"href":"event-detail.html","title":"Event Detail","children":"Event Detail"}]}],["$","li","Features-QA",{"children":["$","a",null,{"href":"Q-A.html","title":"QA","children":"QA"}]}],["$","li","Features-QA Detail",{"children":["$","a",null,{"href":"Q-detail.html","title":"QA Detail","children":"QA Detail"}]}],["$","li","Features-Support Help",{"children":["$","a",null,{"href":"help-faq.html","title":"Support Help","children":"Support Help"}]}],["$","li","Features-Support Detail",{"children":["$","a",null,{"href":"help-faq-detail.html","title":"Support Detail","children":"Support Detail"}]}]]}]]}],["$","li","Market Place",{"className":"menu-item-has-children","children":[["$","a",null,{"href":"#","title":"Market Place","children":[["$","i",null,{"className":"icofont-shopping-bag"}]," ","Market Place"]}],["$","ul",null,{"className":"submenu","children":[["$","li","Market Place-Books",{"children":["$","a",null,{"href":"books.html","title":"Books","children":"Books"}]}],["$","li","Market Place-Books Detail",{"children":["$","a",null,{"href":"book-detail.html","title":"Books Detail","children":"Books Detail"}]}],["$","li","Market Place-Course",{"children":["$","a",null,{"href":"courses.html","title":"Course","children":"Course"}]}],["$","li","Market Place-Course Detail",{"children":["$","a",null,{"href":"course-detail.html","title":"Course Detail","children":"Course Detail"}]}],["$","li","Market Place-Add New Course",{"children":["$","a",null,{"href":"add-new-course.html","title":"Add New Course","children":"Add New Course"}]}],["$","li","Market Place-Cart Page",{"children":["$","a",null,{"href":"product-cart.html","title":"Cart Page","children":"Cart Page"}]}],["$","li","Market Place-Checkout",{"children":["$","a",null,{"href":"product-checkout.html","title":"Checkout","children":"Checkout"}]}],["$","li","Market Place-Add Credit",{"children":["$","a",null,{"href":"add-credits.html","title":"Add Credit","children":"Add Credit"}]}],["$","li","Market Place-Payouts",{"children":["$","a",null,{"href":"pay-out.html","title":"Payouts","children":"Payouts"}]}],["$","li","Market Place-Pricing Plans",{"children":["$","a",null,{"href":"price-plan.html","title":"Pricing Plans","children":"Pricing Plans"}]}],["$","li","Market Place-Invoice",{"children":"$Lf"}],"$L10"]}]]}],"$L11","$L12","$L13","$L14","$L15","$L16","$L17","$L18"]}]}],"$L19","$L1a","$L1b"]}]}],["$L1c","$L1d"],"$L1e"]}]
a:["$","$1","h",{"children":[null,["$","$L1f",null,{"children":"$L20"}],["$","div",null,{"hidden":true,"children":["$","$L21",null,{"children":["$","$22",null,{"name":"Next.Metadata","children":"$L23"}]}]}],null]}]
24:I[58325,["/_next/static/chunks/795c13c535cd64a8.js","/_next/static/chunks/a94a6f5a850fd8b2.js","/_next/static/chunks/6407d745017d3efe.js","/_next/static/chunks/e12fd631829c0013.js"],"default"]
25:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"OutletBoundary"]
:HL["/images/footer.png","image"]
f:["$","a",null,{"href":"invoice.html","title":"Invoice","children":"Invoice"}]
10:["$","li","Market Place-Thank You Page",{"children":["$","a",null,{"href":"thank-you.html","title":"Thank You Page","children":"Thank You Page"}]}]
11:["$","li","Blogs",{"className":"menu-item-has-children","children":[["$","a",null,{"href":"#","title":"Blogs","children":[["$","i",null,{"className":"icofont-coffee-cup"}]," ","Blogs"]}],["$","ul",null,{"className":"submenu","children":[["$","li","Blogs-Blog",{"children":["$","$Le",null,{"href":"/blog","title":"Blog","children":"Blog"}]}],["$","li","Blogs-Blog Detail",{"children":["$","a",null,{"href":"blog-detail.html","title":"Blog Detail","children":"Blog Detail"}]}]]}]]}]
12:["$","li","Featured Pages",{"className":"menu-item-has-children","children":[["$","a",null,{"href":"#","title":"Featured Pages","children":[["$","i",null,{"className":"icofont-file-text"}]," ","Featured Pages"]}],["$","ul",null,{"className":"submenu","children":[["$","li","Featured Pages-Error 404",{"children":["$","a",null,{"href":"404.html","title":"Error 404","children":"Error 404"}]}],["$","li","Featured Pages-Coming Soon",{"children":["$","a",null,{"href":"coming-soon.html","title":"Coming Soon","children":"Coming Soon"}]}],["$","li","Featured Pages-Send Feedback",{"children":["$","a",null,{"href":"send-feedback.html","title":"Send Feedback","children":"Send Feedback"}]}],["$","li","Featured Pages-Badges",{"children":["$","a",null,{"href":"badges.html","title":"Badges","children":"Badges"}]}],["$","li","Featured Pages-Thank You",{"children":["$","a",null,{"href":"thank-you.html","title":"Thank You","children":"Thank You"}]}]]}]]}]
13:["$","li","Authentications",{"className":"menu-item-has-children","children":[["$","a",null,{"href":"#","title":"Authentications","children":[["$","i",null,{"className":"icofont-lock"}]," ","Authentications"]}],["$","ul",null,{"className":"submenu","children":[["$","li","Authentications-Sign In",{"children":["$","$Le",null,{"href":"/login","title":"Sign In","children":"Sign In"}]}],["$","li","Authentications-Sign Up",{"children":["$","$Le",null,{"href":"/signup","title":"Sign Up","children":"Sign Up"}]}],["$","li","Authentications-Forgot Password",{"children":["$","a",null,{"href":"forgot-password.html","title":"Forgot Password","children":"Forgot Password"}]}]]}]]}]
14:["$","li","University Profile",{"className":"","children":[["$","a",null,{"href":"about-university.html","title":"University Profile","children":[["$","i",null,{"className":"icofont-users-social"}]," ","University Profile"]}],null]}]
15:["$","li","Live Chat",{"className":"","children":[["$","$Le",null,{"href":"/messages","title":"Live Chat","children":[["$","i",null,{"className":"icofont-ui-messaging"}]," ","Live Chat"]}],null]}]
16:["$","li","Privacy Policies",{"className":"","children":[["$","a",null,{"href":"privacy-n-policy.html","title":"Privacy Policies","children":[["$","i",null,{"className":"icofont-shield-alt"}]," ","Privacy Policies"]}],null]}]
17:["$","li","Web Settings",{"className":"","children":[["$","a",null,{"href":"settings.html","title":"Web Settings","children":[["$","i",null,{"className":"icofont-settings"}]," ","Web Settings"]}],null]}]
18:["$","li","Development Tools",{"className":"menu-item-has-children","children":[["$","a",null,{"href":"#","title":"Development Tools","children":[["$","i",null,{"className":"icofont-tools-alt-2"}]," ","Development Tools"]}],["$","ul",null,{"className":"submenu","children":[["$","li","Development Tools-Widgets Collection",{"children":["$","a",null,{"href":"widgets.html","title":"Widgets Collection","children":"Widgets Collection"}]}],["$","li","Development Tools-Web Component",{"children":["$","a",null,{"href":"development-component.html","title":"Web Component","children":"Web Component"}]}],["$","li","Development Tools-Web Elements",{"children":["$","a",null,{"href":"development-elements.html","title":"Web Elements","children":"Web Elements"}]}],["$","li","Development Tools-Loader Spinners",{"children":["$","a",null,{"href":"loader-spiners.html","title":"Loader Spinners","children":"Loader Spinners"}]}]]}]]}]
19:["$","section",null,{"children":["$","div",null,{"className":"gap","children":["$","div",null,{"className":"container","children":["$","div",null,{"className":"row","children":["$","div",null,{"className":"col-lg-12","children":["$","div",null,{"id":"page-contents","className":"row merged20","children":["$","$L24",null,{}]}]}]}]}]}]}]
1a:["$","figure",null,{"className":"bottom-mockup","children":["$","img",null,{"src":"/images/footer.png","alt":""}]}]
1b:["$","div",null,{"className":"bottombar","children":["$","div",null,{"className":"container","children":["$","div",null,{"className":"row","children":["$","div",null,{"className":"col-lg-12","children":["$","span",null,{"children":"© copyright All rights reserved by Extremis 2020"}]}]}]}]}]
1c:["$","script","script-0",{"src":"/_next/static/chunks/6407d745017d3efe.js","async":true,"nonce":"$undefined"}]
1d:["$","script","script-1",{"src":"/_next/static/chunks/e12fd631829c0013.js","async":true,"nonce":"$undefined"}]
1e:["$","$L25",null,{"children":["$","$22",null,{"name":"Next.MetadataOutlet","children":"$@26"}]}]
20:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
27:I[27201,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"IconMark"]
23:[["$","title","0",{"children":"Extremis | Social Media Network Template"}],["$","meta","1",{"name":"description","content":"Extremis is a research-focused social network for students, educators, and professionals."}],["$","meta","2",{"name":"application-name","content":"Extremis"}],["$","meta","3",{"name":"keywords","content":"Extremis,research social network,students network,academic community,research collaboration"}],["$","meta","4",{"name":"robots","content":"index, follow"}],["$","meta","5",{"name":"googlebot","content":"index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1"}],["$","link","6",{"rel":"canonical","href":"http://localhost:3000"}],["$","meta","7",{"property":"og:title","content":"Extremis | Social Media Network Template"}],["$","meta","8",{"property":"og:description","content":"Extremis is a research-focused social network for students, educators, and professionals."}],["$","meta","9",{"property":"og:url","content":"http://localhost:3000"}],["$","meta","10",{"property":"og:site_name","content":"Extremis"}],["$","meta","11",{"property":"og:locale","content":"en_US"}],["$","meta","12",{"property":"og:image","content":"http://localhost:3000/images/logo.png"}],["$","meta","13",{"property":"og:image:width","content":"512"}],["$","meta","14",{"property":"og:image:height","content":"512"}],["$","meta","15",{"property":"og:image:alt","content":"Extremis"}],["$","meta","16",{"property":"og:type","content":"website"}],["$","meta","17",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","18",{"name":"twitter:title","content":"Extremis | Social Media Network Template"}],["$","meta","19",{"name":"twitter:description","content":"Extremis is a research-focused social network for students, educators, and professionals."}],["$","meta","20",{"name":"twitter:image","content":"http://localhost:3000/images/logo.png"}],["$","link","21",{"rel":"icon","href":"/favicon.ico?favicon.0b3bf435.ico","sizes":"256x256","type":"image/x-icon"}],["$","$L27","22",{}]]
26:null
