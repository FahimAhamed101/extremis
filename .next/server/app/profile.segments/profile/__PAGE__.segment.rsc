1:"$Sreact.fragment"
2:I[59705,["/_next/static/chunks/39f02aaf9d9fc652.js","/_next/static/chunks/12c3c87450b3de5f.js","/_next/static/chunks/f2e0bcd90ca49140.js","/_next/static/chunks/36098a26079d23c2.js","/_next/static/chunks/5d19e4a5274360a5.js"],"default"]
3:I[67562,["/_next/static/chunks/39f02aaf9d9fc652.js","/_next/static/chunks/12c3c87450b3de5f.js","/_next/static/chunks/f2e0bcd90ca49140.js","/_next/static/chunks/36098a26079d23c2.js","/_next/static/chunks/5d19e4a5274360a5.js"],"default"]
4:I[78418,["/_next/static/chunks/39f02aaf9d9fc652.js","/_next/static/chunks/12c3c87450b3de5f.js","/_next/static/chunks/f2e0bcd90ca49140.js","/_next/static/chunks/36098a26079d23c2.js","/_next/static/chunks/5d19e4a5274360a5.js"],"default"]
5:I[79520,["/_next/static/chunks/39f02aaf9d9fc652.js","/_next/static/chunks/12c3c87450b3de5f.js","/_next/static/chunks/f2e0bcd90ca49140.js","/_next/static/chunks/36098a26079d23c2.js","/_next/static/chunks/5d19e4a5274360a5.js"],""]
b:I[97367,["/_next/static/chunks/ff1a16fafef87110.js","/_next/static/chunks/d2be314c3ece3fbe.js"],"OutletBoundary"]
c:"$Sreact.suspense"
6:Td8f,
            (function () {
              var carouselConfigs = [
                {
                  selector: ".header-shortcuts .page-caro",
                  options: {
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
                  }
                },
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
          0:{"buildId":"A7DH7tFL0CUQCXwdJq4La","rsc":["$","$1","c",{"children":[["$","$L2",null,{"children":[["$","div",null,{"className":"theme-layout","children":[["$","$L3",null,{}],["$","$L4",null,{}]]}],["$","$L5",null,{"id":"profile-carousel-fix","strategy":"lazyOnload","children":"$6"}]]}],["$L7","$L8","$L9"],"$La"]}],"loading":null,"isPartial":false}
7:["$","script","script-0",{"src":"/_next/static/chunks/f2e0bcd90ca49140.js","async":true}]
8:["$","script","script-1",{"src":"/_next/static/chunks/36098a26079d23c2.js","async":true}]
9:["$","script","script-2",{"src":"/_next/static/chunks/5d19e4a5274360a5.js","async":true}]
a:["$","$Lb",null,{"children":["$","$c",null,{"name":"Next.MetadataOutlet","children":"$@d"}]}]
d:null
