import argparse
import os
import sys
import time
import urllib.request
from io import BytesIO

try:
    from PIL import Image
except Exception as exc:
    sys.stderr.write('PIL not available: %s\n' % exc)
    sys.exit(2)


def emit_progress(val):
    try:
        sys.stdout.write('PROGRESS:%d\n' % int(val))
        sys.stdout.flush()
    except Exception:
        pass


def emit_result(path):
    sys.stdout.write('RESULT:%s\n' % path)
    sys.stdout.flush()


def download(url, referer=None, timeout=15):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'
    }
    if referer:
        headers['Referer'] = referer
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        total = int(resp.headers.get('Content-Length') or 0)
        chunk_size = 1024 * 256
        buf = BytesIO()
        downloaded = 0
        while True:
            chunk = resp.read(chunk_size)
            if not chunk:
                break
            buf.write(chunk)
            downloaded += len(chunk)
            if total > 0:
                pct = 5 + int(60 * min(1.0, float(downloaded) / float(total)))
                emit_progress(pct)
        data = buf.getvalue()
    return data


def resize_image(img, max_side):
    if not max_side or max_side <= 0:
        return img, False
    w, h = img.size
    max_dim = max(w, h)
    if max_dim <= max_side:
        return img, False
    scale = float(max_side) / float(max_dim)
    tw = max(1, int(round(w * scale)))
    th = max(1, int(round(h * scale)))
    return img.resize((tw, th), Image.LANCZOS), True


def to_jpeg(img):
    if img.mode in ('RGBA', 'LA'):
        bg = Image.new('RGB', img.size, (255, 255, 255))
        alpha = img.split()[-1]
        bg.paste(img, mask=alpha)
        return bg
    if img.mode != 'RGB':
        return img.convert('RGB')
    return img


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', required=True)
    parser.add_argument('--outdir', required=True)
    parser.add_argument('--format', choices=['png', 'jpeg'], default='png')
    parser.add_argument('--quality', type=int, default=85)
    parser.add_argument('--max-side', type=int, default=0)
    parser.add_argument('--referer', default='')
    args = parser.parse_args()

    emit_progress(5)
    data = download(args.url, args.referer)
    if not data:
        sys.stderr.write('download failed\n')
        sys.exit(3)
    emit_progress(70)

    try:
        img = Image.open(BytesIO(data))
        img.load()
    except Exception as exc:
        sys.stderr.write('image open failed: %s\n' % exc)
        sys.exit(4)
    emit_progress(85)

    img, _ = resize_image(img, args.max_side)
    emit_progress(90)

    outdir = args.outdir
    if not os.path.isdir(outdir):
        os.makedirs(outdir)
    ts = int(time.time() * 1000)
    ext = 'jpg' if args.format == 'jpeg' else 'png'
    out_path = os.path.join(outdir, 'psex_py_%s.%s' % (ts, ext))

    if args.format == 'jpeg':
        img = to_jpeg(img)
        q = max(10, min(100, int(args.quality)))
        img.save(out_path, format='JPEG', quality=q, optimize=True)
    else:
        if img.mode == 'P':
            img = img.convert('RGBA')
        img.save(out_path, format='PNG', optimize=True)
    emit_progress(100)

    emit_result(out_path)


if __name__ == '__main__':
    main()
