from PIL import Image
import os

src = r'C:\DEV\CODEGOD\apps\AI-class\assets\logo\logo-v2.png'
out = r'C:\DEV\CODEGOD\apps\AI-class\web-react\public\combine-wordmark.png'

im = Image.open(src).convert('RGBA')
print('orig', im.size)
px = list(im.getdata())
im.putdata([(r, g, b, 0) if (r < 26 and g < 26 and b < 26) else (r, g, b, a) for (r, g, b, a) in px])
im = im.crop(im.getbbox())
print('cropped', im.size)
w, h = im.size
H = 160
im = im.resize((round(w * H / h), H), Image.LANCZOS)
im.save(out, optimize=True)
print('saved', im.size, os.path.getsize(out), 'bytes')

# clean up the partial base64 transfer file
b64 = r'C:\DEV\CODEGOD\apps\AI-class\web-react\public\logo.b64'
if os.path.exists(b64):
    os.remove(b64)
    print('removed logo.b64')
