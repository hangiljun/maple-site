const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToConvert = [
  { name: 'trade1.png', size: 13.25 },
  { name: 'trade2.png', size: 12.10 },
  { name: 'trade3.png', size: 14.89 },
  { name: 'trade4.png', size: 20.80 },
  { name: 'trade5.png', size: 8.77 },
  { name: 'trade6.png', size: 13.04 },
  { name: 'trade7.png', size: 13.10 },
  { name: 'og-image.png', size: 3.85 }
];

async function convertToWebP() {
  console.log('🔄 WebP 변환 시작 (품질: 82)\n');
  console.log('원본 PNG 파일은 그대로 유지됩니다.\n');

  const results = [];

  for (const img of imagesToConvert) {
    const input = path.join('public', img.name);
    const output = path.join('public', img.name.replace('.png', '.webp'));

    try {
      // WebP 변환 (품질 82)
      await sharp(input)
        .webp({ quality: 82 })
        .toFile(output);

      const originalSize = fs.statSync(input).size / 1024 / 1024;
      const newSize = fs.statSync(output).size / 1024 / 1024;
      const saved = originalSize - newSize;
      const percent = ((saved / originalSize) * 100).toFixed(1);

      results.push({
        file: img.name,
        original: originalSize.toFixed(2),
        webp: newSize.toFixed(2),
        saved: saved.toFixed(2),
        percent: percent
      });

      console.log(`✅ ${img.name}`);
      console.log(`   ${originalSize.toFixed(2)} MB → ${newSize.toFixed(2)} MB (${percent}% 절감)\n`);
    } catch (error) {
      console.error(`❌ ${img.name} 변환 실패:`, error.message);
    }
  }

  // 최종 요약
  const totalOriginal = results.reduce((sum, r) => sum + parseFloat(r.original), 0);
  const totalWebP = results.reduce((sum, r) => sum + parseFloat(r.webp), 0);
  const totalSaved = totalOriginal - totalWebP;
  const totalPercent = ((totalSaved / totalOriginal) * 100).toFixed(1);

  console.log('='.repeat(50));
  console.log('📊 변환 완료!');
  console.log(`총 원본: ${totalOriginal.toFixed(2)} MB`);
  console.log(`총 WebP: ${totalWebP.toFixed(2)} MB`);
  console.log(`총 절감: ${totalSaved.toFixed(2)} MB (${totalPercent}%)`);
  console.log('='.repeat(50));

  return results;
}

convertToWebP();
