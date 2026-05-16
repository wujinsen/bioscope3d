#!/usr/bin/env python3
"""Burn Chinese UI labels onto MMDGD65dmTS96-HF.mp4 (screen recording, no audio)."""

from __future__ import annotations

import re
import sys
from pathlib import Path

import cv2
import easyocr
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
INPUT = ROOT / "MMDGD65dmTS96-HF.mp4"
OUTPUT = ROOT / "MMDGD65dmTS96-HF.zh.mp4"

# Exact + phrase replacements (longer phrases first when applying via regex order)
ZH: dict[str, str] = {
    "CloseCRM": "CloseCRM",
    "Unlock more benefits with Pro subscription": "订阅 Pro 解锁更多权益",
    "Upgrade to Pro": "升级专业版",
    "Recent Chats": "最近聊天",
    "Sales Executive": "销售主管",
    "Closed successfully": "已成功关闭",
    "From closed deals": "来自已关闭商机",
    "Last Month Sales Funnel": "上月销售漏斗",
    "Monthly Revenue Target": "月度营收目标",
    "Activity Breakdown": "活动构成",
    "Total Activities": "活动总数",
    "Revenue Trend": "营收趋势",
    "Team Performance": "团队表现",
    "Active Leads": "活跃线索",
    "Deals Won": "成交商机",
    "Win Rate": "胜率",
    "Total Revenue": "总营收",
    "Show Filters": "显示筛选",
    "This Month": "本月",
    "In progress": "进行中",
    "Last period": "上期",
    "Negotiation": "谈判",
    "Qualified": "已筛选",
    "Proposal": "方案",
    "Workflows": "工作流",
    "Activities": "活动",
    "Companies": "公司",
    "Contacts": "联系人",
    "Dashboard": "仪表板",
    "Analytics": "分析",
    "Meetings": "会议",
    "Favorites": "收藏",
    "Executive": "主管",
    "Manager": "经理",
    "Reports": "报告",
    "Deals": "商机",
    "System": "系统",
    "Import": "导入",
    "Create": "创建",
    "Search": "搜索",
    "Share": "分享",
    "Tasks": "任务",
    "Calls": "通话",
    "Emails": "邮件",
    "Leads": "线索",
    "Left": "剩余",
    "Target:": "目标：",
    "January": "1月",
    "February": "2月",
    "March": "3月",
    "April": "4月",
    "May": "5月",
    "June": "6月",
}


def translate_text(text: str) -> str:
    t = text.strip()
    if not t or re.fullmatch(r"[\d\s\.,$%+\-–—:;|/\\⌘Kk]+", t):
        return t
    out = t
    for en, zh in sorted(ZH.items(), key=lambda x: -len(x[0])):
        out = re.sub(re.escape(en), zh, out, flags=re.IGNORECASE)
    return out


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for name in ("msyh.ttc", "msyhbd.ttc", "simhei.ttf", "arial.ttf"):
        p = Path("C:/Windows/Fonts") / name
        if p.exists():
            return ImageFont.truetype(str(p), size)
    return ImageFont.load_default()


def box_pad(bbox: list, pad: int = 4) -> tuple[int, int, int, int]:
    xs = [int(p[0]) for p in bbox]
    ys = [int(p[1]) for p in bbox]
    return min(xs) - pad, min(ys) - pad, max(xs) + pad, max(ys) + pad


def fit_font(
    draw: ImageDraw.ImageDraw,
    text: str,
    font_path: str | None,
    max_w: int,
    max_h: int,
) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    size = max(10, min(max_h - 2, 36))
    while size >= 9:
        if font_path:
            fnt = ImageFont.truetype(font_path, size)
        else:
            fnt = load_font(size)
        bbox = draw.textbbox((0, 0), text, font=fnt)
        tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
        if tw <= max_w and th <= max_h:
            return fnt
        size -= 1
    return load_font(9)


def overlay_region(
    img: Image.Image,
    bbox: list,
    zh: str,
    font_path: str | None,
    fill: tuple[int, int, int] = (252, 252, 253),
) -> None:
    if not zh.strip() or zh.strip() == "":
        return
    x0, y0, x1, y1 = box_pad(bbox, 3)
    w, h = x1 - x0, y1 - y0
    if w < 8 or h < 8:
        return
    draw = ImageDraw.Draw(img)
    draw.rectangle([x0, y0, x1, y1], fill=fill)
    fnt = fit_font(draw, zh, font_path, w - 4, h - 2)
    tb = draw.textbbox((0, 0), zh, font=fnt)
    tw, th = tb[2] - tb[0], tb[3] - tb[1]
    tx = x0 + max(2, (w - tw) // 2)
    ty = y0 + max(1, (h - th) // 2)
    draw.text((tx, ty), zh, fill=(23, 28, 38), font=fnt)


def main() -> int:
    src = INPUT if len(sys.argv) < 2 else Path(sys.argv[1])
    dst = OUTPUT if len(sys.argv) < 3 else Path(sys.argv[2])
    if not src.exists():
        print(f"missing input: {src}", file=sys.stderr)
        return 1

    font_path = None
    for name in ("msyh.ttc", "msyhbd.ttc", "simhei.ttf"):
        p = Path("C:/Windows/Fonts") / name
        if p.exists():
            font_path = str(p)
            break

    print("OCR template frame…")
    cap = cv2.VideoCapture(str(src))
    ok, frame0 = cap.read()
    if not ok:
        print("cannot read video", file=sys.stderr)
        return 1

    reader = easyocr.Reader(["en"], gpu=False, verbose=False)
    detections = reader.readtext(frame0)
    regions: list[tuple[list, str]] = []
    for bbox, text, conf in detections:
        if conf < 0.25:
            continue
        zh = translate_text(text)
        if zh == text.strip() and len(text.strip()) > 2 and text.strip().isalpha():
            # still English word — try title case map
            pass
        regions.append((bbox, zh))
    print(f"  {len(regions)} text regions")

    fps = cap.get(cv2.CAP_PROP_FPS) or 60.0
    w = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    h = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(str(dst), fourcc, fps, (w, h))

    cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
    n = 0
    while True:
        ok, bgr = cap.read()
        if not ok:
            break
        rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
        pil = Image.fromarray(rgb)
        for bbox, zh in regions:
            overlay_region(pil, bbox, zh, font_path)
        out.write(cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR))
        n += 1
        if n % 120 == 0:
            print(f"  frame {n}")

    cap.release()
    out.release()
    print(f"Wrote {dst} ({n} frames)")

    # H.264 re-mux for compatibility
    h264 = dst.with_suffix(".h264.mp4")
    import subprocess

    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-i",
            str(dst),
            "-c:v",
            "libx264",
            "-preset",
            "fast",
            "-crf",
            "18",
            "-pix_fmt",
            "yuv420p",
            str(h264),
        ],
        check=True,
        capture_output=True,
    )
    h264.replace(dst)
    print(f"Re-encoded: {dst}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
