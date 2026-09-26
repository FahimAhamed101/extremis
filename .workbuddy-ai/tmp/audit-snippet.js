(() => {
  const vw = document.documentElement.clientWidth;
  const de = document.documentElement;
  const r = {
    viewport: vw,
    scrollWidth: de.scrollWidth,
    overflowX: de.scrollWidth - vw,
    offenders: [],
    smallTargets: [],
    smallText: [],
    nonResponsiveImages: [],
  };
  const describe = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += "#" + el.id;
    if (el.className && typeof el.className === "string")
      s += "." + el.className.trim().split(/\s+/).slice(0, 3).join(".");
    return s.slice(0, 100);
  };
  const isHidden = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return true;
    if (parseFloat(cs.opacity) === 0) return true;
    if (cs.position === "fixed" || cs.position === "absolute") {
      if (cs.transform && cs.transform !== "none") return true;
    }
    return false;
  };
  const inScrollable = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const cs = getComputedStyle(p);
      if (/(auto|scroll)/.test(cs.overflowX) && p.getBoundingClientRect().width <= vw + 1)
        return true;
      p = p.parentElement;
    }
    return false;
  };
  document.querySelectorAll("body *").forEach((el) => {
    if (isHidden(el)) return;
    const b = el.getBoundingClientRect();
    if (b.width === 0 || b.height === 0) return;
    if ((b.right > vw + 2 || b.left < -2) && !inScrollable(el)) {
      const amount = Math.round(Math.max(b.right - vw, -b.left));
      if (amount > 2)
        r.offenders.push({
          el: describe(el),
          amount,
          left: Math.round(b.left),
          right: Math.round(b.right),
          width: Math.round(b.width),
          pos: getComputedStyle(el).position,
        });
    }
    const tag = el.tagName.toLowerCase();
    if ((tag === "a" || tag === "button") && (el.innerText || "").trim().length > 0) {
      if (b.width < 32 || b.height < 32)
        r.smallTargets.push({ el: describe(el), w: Math.round(b.width), h: Math.round(b.height) });
    }
    const hasText = Array.from(el.childNodes || []).some(
      (n) => n.nodeType === 3 && n.textContent.trim().length > 3
    );
    if (hasText) {
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs && fs < 12) r.smallText.push({ el: describe(el), fs });
    }
    if (tag === "img") {
      if (b.width > vw + 2) r.nonResponsiveImages.push({ el: describe(el), w: Math.round(b.width) });
      if (!el.hasAttribute("alt"))
        r.nonResponsiveImages.push({ el: describe(el), w: Math.round(b.width), missingAlt: true });
    }
  });
  const dedupe = (arr, k) => {
    const seen = new Set();
    return arr.filter((x) => {
      const key = x.el + k(x);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  r.offenders = dedupe(r.offenders, (x) => x.amount).sort((a, b) => b.amount - a.amount).slice(0, 15);
  r.smallTargets = dedupe(r.smallTargets, (x) => x.w + "x" + x.h).slice(0, 12);
  r.smallText = dedupe(r.smallText, (x) => x.fs).slice(0, 12);
  r.nonResponsiveImages = dedupe(r.nonResponsiveImages, (x) => x.w + (x.missingAlt ? "a" : "")).slice(0, 12);
  return r;
})()
