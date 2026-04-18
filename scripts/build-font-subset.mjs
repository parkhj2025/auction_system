import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import subsetFont from "subset-font";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const TARGETS = [
  {
    source: path.join(ROOT, "scripts/font-source/NotoSansKR-Regular.otf"),
    output: path.join(ROOT, "public/fonts/NotoSansKR-Regular-subset.ttf"),
    url: "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/SubsetOTF/KR/NotoSansKR-Regular.otf",
  },
  {
    source: path.join(ROOT, "scripts/font-source/NotoSansKR-Bold.otf"),
    output: path.join(ROOT, "public/fonts/NotoSansKR-Bold-subset.ttf"),
    url: "https://cdn.jsdelivr.net/gh/notofonts/noto-cjk@main/Sans/SubsetOTF/KR/NotoSansKR-Bold.otf",
  },
];

for (const t of TARGETS) {
  if (!fs.existsSync(t.source)) {
    console.error(`Source font not found: ${t.source}`);
    console.error(`Download from: ${t.url}`);
    process.exit(1);
  }
}

let chars = "";

// 한글 음절 가-힣 (U+AC00 ~ U+D7A3, 11172자)
for (let i = 0xac00; i <= 0xd7a3; i++) chars += String.fromCharCode(i);

// 한글 자모 (호환 자모 포함)
for (let i = 0x1100; i <= 0x11ff; i++) chars += String.fromCharCode(i);
for (let i = 0x3130; i <= 0x318f; i++) chars += String.fromCharCode(i);

// ASCII (영숫자 + 기본 부호)
for (let i = 0x20; i <= 0x7e; i++) chars += String.fromCharCode(i);

// 위임장 정형 한자 (제27호 서식 + 일반 위임장에 등장)
chars += "委任狀代理印章身分證號生年月日法院競賣却期入札保證金事件番公認仲介士住所姓名日付署名捺印年月日";

// 한국어 부호
chars += "·…\u2018\u2019\u201C\u201D「」『』※©®™°○●△▲□■◎♠♣♥♦";

// 화폐/단위
chars += "₩￦元";

console.log(`Glyphs requested: ${chars.length}`);
let totalOut = 0;
let totalIn = 0;

for (const t of TARGETS) {
  const input = fs.readFileSync(t.source);
  console.log("");
  console.log(`Source: ${t.source}`);
  console.log(`  size: ${(input.length / 1024 / 1024).toFixed(2)} MB`);

  const output = await subsetFont(input, chars, { targetFormat: "truetype" });

  fs.mkdirSync(path.dirname(t.output), { recursive: true });
  fs.writeFileSync(t.output, output);

  console.log(`Output: ${t.output}`);
  console.log(`  size: ${(output.length / 1024).toFixed(0)} KB (${(output.length / 1024 / 1024).toFixed(2)} MB)`);
  console.log(`  ratio: ${((output.length / input.length) * 100).toFixed(1)}% of source`);

  totalOut += output.length;
  totalIn += input.length;
}

console.log("");
console.log(`TOTAL output: ${(totalOut / 1024).toFixed(0)} KB (${(totalOut / 1024 / 1024).toFixed(2)} MB)`);
