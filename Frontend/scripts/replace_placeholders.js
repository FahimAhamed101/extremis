const fs = require('fs');
const path = require('path');

const resDir = path.join(__dirname, '..', 'public', 'images', 'resources');

// 1. Create a modern aesthetic SVG for time-bg
const timeBgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="263" height="336" viewBox="0 0 263 336">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
    <radialGradient id="glowCyan" cx="30%" cy="20%" r="60%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glowIndigo" cx="80%" cy="75%" r="55%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
    </radialGradient>
    <pattern id="dotGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1" fill="#38bdf8" fill-opacity="0.15" />
    </pattern>
  </defs>
  <rect width="263" height="336" fill="url(#skyGrad)" />
  <rect width="263" height="336" fill="url(#glowCyan)" />
  <rect width="263" height="336" fill="url(#glowIndigo)" />
  <rect width="263" height="336" fill="url(#dotGrid)" />
  <!-- Delicate celestial rings -->
  <circle cx="210" cy="80" r="45" fill="none" stroke="#38bdf8" stroke-width="1" stroke-opacity="0.2" stroke-dasharray="3 4" />
  <circle cx="210" cy="80" r="30" fill="none" stroke="#818cf8" stroke-width="1" stroke-opacity="0.25" />
  <circle cx="45" cy="260" r="60" fill="none" stroke="#0ea5e9" stroke-width="1" stroke-opacity="0.15" stroke-dasharray="2 3" />
</svg>`;

fs.writeFileSync(path.join(resDir, 'time-bg.svg'), timeBgSvg);
fs.writeFileSync(path.join(resDir, 'time-bg.jpg'), timeBgSvg);
console.log('Updated time-bg.svg and time-bg.jpg');

// 2. Replace study.jpg with real campus photo
if (fs.existsSync(path.join(resDir, 'profile-banner.jpg'))) {
  fs.copyFileSync(path.join(resDir, 'profile-banner.jpg'), path.join(resDir, 'study.jpg'));
  fs.copyFileSync(path.join(resDir, 'profile-banner.jpg'), path.join(resDir, 'sidebar-info2.jpg'));
  console.log('Updated study.jpg and sidebar-info2.jpg with profile-banner.jpg');
}

// 3. Replace story cards with real user portraits
const userPortraits = [
  'user-pic001.jpg',
  'user-pic002.jpg',
  'user-pic003.jpg',
  'user-pic004.jpg',
  'user-pic005.jpg'
];

['story-card.jpg', 'story-card2.jpg', 'story-card3.jpg', 'story-card4.jpg', 'story-card5.jpg'].forEach((st, idx) => {
  const src = path.join(resDir, userPortraits[idx % userPortraits.length]);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(resDir, st));
    console.log(`Copied ${userPortraits[idx]} to ${st}`);
  }
});

// 4. Replace speak-1..3 with real researcher avatars
['speak-1.jpg', 'speak-2.jpg', 'speak-3.jpg'].forEach((sp, idx) => {
  const src = path.join(resDir, userPortraits[(idx + 2) % userPortraits.length]);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(resDir, sp));
    console.log(`Copied portrait to ${sp}`);
  }
});

// 5. Replace recentlink-1..3 with course/book images
const courseImages = ['course-1.jpg', 'course-2.jpg', 'course-3.jpg'];
['recentlink-1.jpg', 'recentlink-2.jpg', 'recentlink-3.jpg'].forEach((rl, idx) => {
  const src = path.join(resDir, courseImages[idx]);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(resDir, rl));
    console.log(`Copied ${courseImages[idx]} to ${rl}`);
  }
});
