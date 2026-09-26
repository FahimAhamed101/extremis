/**
 * Minimal MP4 probe: reads the video track dimensions (and duration when present)
 * straight out of the container, so we can tell portrait reels from landscape ones
 * without ffprobe.
 *
 * Usage: node scripts/probe-video.js <file.mp4> [...]
 */
const fs = require("fs");

/** Walk top-level boxes and return {type, start, size} entries. */
function boxes(buf, start, end) {
  const out = [];
  let offset = start;
  while (offset + 8 <= end) {
    let size = buf.readUInt32BE(offset);
    const type = buf.toString("ascii", offset + 4, offset + 8);
    let headerSize = 8;
    if (size === 1) {
      // 64-bit size
      size = Number(buf.readBigUInt64BE(offset + 8));
      headerSize = 16;
    } else if (size === 0) {
      size = end - offset;
    }
    if (size < headerSize) break;
    out.push({ type, start: offset, size, headerSize });
    offset += size;
  }
  return out;
}

function findBox(buf, start, end, path) {
  const wanted = path[0];
  for (const box of boxes(buf, start, end)) {
    if (box.type !== wanted) continue;
    if (path.length === 1) return box;
    return findBox(buf, box.start + box.headerSize, box.start + box.size, path.slice(1));
  }
  return null;
}

function readTkhd(buf, box) {
  const p = box.start + box.headerSize;
  const version = buf.readUInt8(p);
  // version 0: 4 flags + 8 created + 8 modified + 4 trackId + 4 reserved + 8 duration
  // version 1: 4 flags + 8 created + 8 modified + 4 trackId + 4 reserved + 8 duration (64-bit)
  const base = p + 4; // skip version+flags
  const afterTimes = version === 1 ? base + 8 + 8 + 4 + 4 + 8 : base + 4 + 4 + 4 + 4 + 4;
  // reserved(8) + layer(2) + altGroup(2) + volume(2) + reserved(2) + matrix(36)
  const dimsAt = afterTimes + 8 + 2 + 2 + 2 + 2 + 36;
  return {
    width: buf.readUInt32BE(dimsAt) / 65536,
    height: buf.readUInt32BE(dimsAt + 4) / 65536,
  };
}

function readMvhdDuration(buf, moov) {
  const mvhd = findBox(buf, moov.start + moov.headerSize, moov.start + moov.size, ["mvhd"]);
  if (!mvhd) return null;
  const p = mvhd.start + mvhd.headerSize;
  const version = buf.readUInt8(p);
  const timescale = version === 1 ? buf.readUInt32BE(p + 4 + 8 + 8) : buf.readUInt32BE(p + 4 + 4 + 4);
  const duration =
    version === 1
      ? Number(buf.readBigUInt64BE(p + 4 + 8 + 8 + 4))
      : buf.readUInt32BE(p + 4 + 4 + 4 + 4);
  return timescale ? duration / timescale : null;
}

for (const file of process.argv.slice(2)) {
  try {
    const buf = fs.readFileSync(file);
    const moov = findBox(buf, 0, buf.length, ["moov"]);
    if (!moov) {
      console.log(`${file}: no moov box found`);
      continue;
    }
    const trak = findBox(buf, moov.start + moov.headerSize, moov.start + moov.size, ["trak"]);
    const tkhd = trak
      ? findBox(buf, trak.start + trak.headerSize, trak.start + trak.size, ["tkhd"])
      : null;
    const dims = tkhd ? readTkhd(buf, tkhd) : { width: 0, height: 0 };
    const duration = readMvhdDuration(buf, moov);
    const ratio = dims.height ? (dims.width / dims.height).toFixed(3) : "?";
    const shape = !dims.height ? "?" : dims.width < dims.height ? "PORTRAIT" : dims.width === dims.height ? "SQUARE" : "LANDSCAPE";
    console.log(
      `${file}\n    ${dims.width}x${dims.height}  ratio=${ratio}  ${shape}` +
        (duration ? `  ${duration.toFixed(1)}s` : "") +
        `  ${(buf.length / 1024 / 1024).toFixed(1)}MB`
    );
  } catch (error) {
    console.log(`${file}: ERROR ${error.message}`);
  }
}
