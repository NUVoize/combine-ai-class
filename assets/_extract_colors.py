from PIL import Image
import os, collections

folder = r"C:\DEV\CODEGOD\apps\AI-class\assets\logo"
pngs = sorted([f for f in os.listdir(folder) if f.lower().endswith('.png')])
for i, fn in enumerate(pngs, 1):
    p = os.path.join(folder, fn)
    im = Image.open(p).convert('RGBA')
    print('===', fn, im.size, os.path.getsize(p), 'bytes')
    small = im.resize((120, 120))
    cnt = collections.Counter()
    for r, g, b, a in small.getdata():
        if a < 128:
            continue
        cnt[(r // 16 * 16, g // 16 * 16, b // 16 * 16)] += 1
    for color, n in cnt.most_common(12):
        print('   #%02x%02x%02x' % color, n)
    thumb = im.copy()
    thumb.thumbnail((360, 360))
    bg = Image.new('RGBA', thumb.size, (18, 18, 20, 255))
    bg.alpha_composite(thumb)
    out = os.path.join(folder, 'thumb_%d.jpg' % i)
    bg.convert('RGB').save(out, quality=82)
    print('   thumb ->', out)
print('DONE')
