# -*- coding: utf-8 -*-
"""AI 定制模块：根据用户选的提示词，生成一款香囊方案。

这不是接外部大模型，而是一套“香型知识库 + 规则生成”：
功用 -> 对应传统合香香型（安神 / 固神 / 凝神 / 悦神，出自产品介绍文档）；
场景 -> 决定囊型、挂绳与使用方式；
外包装风格 -> 决定配色、纹样与寓意；
香气浓度 -> 决定香材配比倾向与留香参考。
所有香材均取自产品介绍文档中出现过的天然香材，不编造新配方；
师傅的具体配方比例不公开、不上云，这里只给香材组合方向。
"""

FUNCTIONS = {
    "anshen": {
        "label": "助眠安神", "xiangxing": "安神香",
        "herbs": ["沉香", "檀香", "艾叶"],
        "desc": "睡前放松氛围，香气沉稳柔和，适合放在床头、伴夜读与入睡前的安静时光。",
        "name_word": "安神",
    },
    "qingxin": {
        "label": "净化空气", "xiangxing": "固神香",
        "herbs": ["艾叶", "佩兰", "藿香", "薄荷"],
        "desc": "清新空气、祛味辟秽的香气方向，适合衣柜、车内与常待的房间。",
        "name_word": "净气",
    },
    "xingnao": {
        "label": "提神醒脑", "xiangxing": "凝神香",
        "herbs": ["薄荷", "丁香", "藿香"],
        "desc": "清凉醒神的香气方向，适合晨读、伏案工作与午后犯困时提神。",
        "name_word": "醒神",
    },
    "yueshen": {
        "label": "愉悦心情", "xiangxing": "悦神香",
        "herbs": ["丁香", "沉香", "佩兰"],
        "desc": "温润愉悦的香气方向，适合会客、品茗与想给日常加点好心情的时候。",
        "name_word": "悦心",
    },
}

SCENES = {
    "carry": {
        "label": "随身佩戴",
        "form": "小巧抽绳囊，佩于衣襟或挂在包袋上",
        "usage": "随身佩戴，走动时香气淡淡散开；不佩戴时放进衣柜，衣物也带一点香。",
        "persona": "随身携带派",
    },
    "bedside": {
        "label": "挂床头",
        "form": "挂绳加长的床头囊，挂在床头或床边挂钩上",
        "usage": "睡前挂在床头，香气在枕边慢慢散开；白天取下挂在衣柜里继续用。",
        "persona": "睡前仪式派",
    },
    "car": {
        "label": "放车内",
        "form": "车载挂囊，挂绳可调，挂在后视镜或车门挂钩上",
        "usage": "挂在车内代替化学香片，香气清淡不刺鼻，开车时不分心。",
        "persona": "车载清新派",
    },
    "desk": {
        "label": "摆书房案头",
        "form": "案头陈设囊，配小香盘，可立放于书桌、茶台",
        "usage": "放在书房、茶室案头，读书品茗时香气相伴；也可作案头摆件。",
        "persona": "案头雅致派",
    },
    "gift": {
        "label": "送礼",
        "form": "莲纹礼盒装，附手写贺卡与香囊使用说明",
        "usage": "端午、中秋、毕业与入职等场合送礼，礼盒与贺卡都可定制祝福语。",
        "persona": "送礼心意派",
    },
}

STYLES = {
    "hehua": {
        "label": "荷花", "short": "荷",
        "meaning": "荷花出淤泥而不染，是湘莲的意象，也是莲馨香的莲纹来源。",
        "body": "#E9B7BC", "accent": "#8E3B46", "motif": "#F6E8E4",
        "cord": "#8E3B46", "tassel": "#C9A86A",
    },
    "juhua": {
        "label": "菊花", "short": "菊",
        "meaning": "菊花高洁，秋日金黄，适合送给长辈与师长。",
        "body": "#E8C86A", "accent": "#9A6B1F", "motif": "#FBF3DC",
        "cord": "#9A6B1F", "tassel": "#A93226",
    },
    "meihua": {
        "label": "梅花", "short": "梅",
        "meaning": "梅花凌寒而开，寓意坚韧，朱红配墨色最显年味与喜气。",
        "body": "#C65D4E", "accent": "#7A2A20", "motif": "#F7E9DC",
        "cord": "#7A2A20", "tassel": "#2F4A4A",
    },
    "lanhua": {
        "label": "兰花", "short": "兰",
        "meaning": "兰花幽香清雅，淡绿配米白，最适合书房与案头。",
        "body": "#BFD8C0", "accent": "#3E6B4F", "motif": "#F2F6EC",
        "cord": "#3E6B4F", "tassel": "#C9A86A",
    },
    "shizi": {
        "label": "柿子", "short": "柿",
        "meaning": "柿子谐音“事事如意”，柿红配绿叶，是最讨喜的吉祥款。",
        "body": "#E07840", "accent": "#A34A1F", "motif": "#FBEEDD",
        "cord": "#A34A1F", "tassel": "#3E6B4F",
    },
}

INTENSITY = {
    "dan": {"label": "淡雅", "note": "香材配比偏清淡，香气若有若无，适合对气味敏感的人。",
           "duration": "留香参考约 2–4 周"},
    "zhong": {"label": "适中", "note": "香材配比适中，近闻清晰、远闻淡淡，是大多数人的选择。",
           "duration": "留香参考约 4–6 周"},
    "chun": {"label": "醇厚", "note": "香材配比偏浓郁，香气饱满绵长，适合放在衣柜、车内等空间。",
           "duration": "留香参考约 6–8 周"},
}

BASE_HERBS = ["艾叶", "薄荷", "丁香", "佩兰"]


def _motif_svg(style_key, cx, cy, color):
    """按外包装风格画一个简化的纹样，放在香囊正中。"""
    if style_key == "hehua":  # 荷花：五片花瓣
        petals = ""
        for ang in (-50, -25, 0, 25, 50):
            petals += (
                f'<ellipse cx="{cx}" cy="{cy - 26}" rx="11" ry="26" fill="{color}" '
                f'transform="rotate({ang} {cx} {cy})" opacity="0.92"/>'
            )
        return petals + f'<circle cx="{cx}" cy="{cy + 6}" r="8" fill="#C9A86A"/>'
    if style_key == "juhua":  # 菊花：放射状细瓣
        petals = ""
        for i in range(12):
            ang = i * 30
            petals += (
                f'<ellipse cx="{cx}" cy="{cy - 24}" rx="5" ry="22" fill="{color}" '
                f'transform="rotate({ang} {cx} {cy})" opacity="0.9"/>'
            )
        return petals + f'<circle cx="{cx}" cy="{cy}" r="9" fill="#9A6B1F"/>'
    if style_key == "meihua":  # 梅花：五圆瓣
        petals = ""
        for i in range(5):
            ang = i * 72 - 90
            import math
            px = cx + 20 * math.cos(math.radians(ang))
            py = cy + 20 * math.sin(math.radians(ang))
            petals += f'<circle cx="{px:.0f}" cy="{py:.0f}" r="12" fill="{color}" opacity="0.92"/>'
        return petals + f'<circle cx="{cx}" cy="{cy}" r="7" fill="#C9A86A"/>'
    if style_key == "lanhua":  # 兰花：三片长瓣
        return (
            f'<path d="M{cx} {cy + 26} Q {cx - 26} {cy - 6} {cx - 8} {cy - 34} '
            f'Q {cx} {cy - 8} {cx} {cy + 26} Z" fill="{color}" opacity="0.92"/>'
            f'<path d="M{cx} {cy + 26} Q {cx + 26} {cy - 6} {cx + 8} {cy - 34} '
            f'Q {cx} {cy - 8} {cx} {cy + 26} Z" fill="{color}" opacity="0.92"/>'
            f'<path d="M{cx} {cy + 26} Q {cx - 8} {cy - 18} {cx} {cy - 40} '
            f'Q {cx + 8} {cy - 18} {cx} {cy + 26} Z" fill="{color}" opacity="0.95"/>'
        )
    # shizi 柿子：圆身 + 绿叶
    return (
        f'<circle cx="{cx}" cy="{cy}" r="26" fill="{color}" opacity="0.95"/>'
        f'<ellipse cx="{cx - 14}" cy="{cy - 28}" rx="12" ry="6" fill="#3E6B4F" '
        f'transform="rotate(-30 {cx - 14} {cy - 28})"/>'
        f'<ellipse cx="{cx + 14}" cy="{cy - 28}" rx="12" ry="6" fill="#3E6B4F" '
        f'transform="rotate(30 {cx + 14} {cy - 28})"/>'
        f'<rect x="{cx - 2}" y="{cy - 38}" width="4" height="12" rx="2" fill="#7A5A3A"/>'
    )


def sachet_svg(style_key):
    """生成香囊示意图 SVG（按风格配色）。"""
    s = STYLES[style_key]
    body, accent, motif, cord, tassel = (
        s["body"], s["accent"], s["motif"], s["cord"], s["tassel"])
    motif_part = _motif_svg(style_key, 150, 190, motif)
    return (
        f'<svg viewBox="0 0 300 360" xmlns="http://www.w3.org/2000/svg" '
        f'role="img" aria-label="{s["label"]}纹香囊示意图">'
        f'<rect x="6" y="6" width="288" height="348" rx="18" fill="#FBF7EC"/>'
        # 挂绳
        f'<path d="M150 18 Q 120 52 138 78 M150 18 Q 180 52 162 78" '
        f'stroke="{cord}" stroke-width="5" fill="none" stroke-linecap="round"/>'
        # 囊身
        f'<path d="M96 92 Q 150 74 204 92 L 216 236 Q 216 292 150 292 '
        f'Q 84 292 84 236 Z" fill="{body}" stroke="{accent}" stroke-width="3"/>'
        # 束口褶
        f'<path d="M96 92 Q 150 108 204 92" stroke="{accent}" stroke-width="3" fill="none"/>'
        f'<path d="M108 100 L 106 122 M132 104 L 131 126 M168 104 L 169 126 '
        f'M192 100 L 194 122" stroke="{accent}" stroke-width="2" opacity="0.55"/>'
        # 纹样
        f'{motif_part}'
        # 流苏
        f'<line x1="150" y1="292" x2="150" y2="312" stroke="{cord}" stroke-width="4"/>'
        f'<path d="M138 312 L 162 312 L 158 344 Q 150 350 142 344 Z" fill="{tassel}"/>'
        f'<path d="M144 314 L 143 342 M150 314 L 150 344 M156 314 L 157 342" '
        f'stroke="#8A6D3B" stroke-width="1.4" opacity="0.6"/>'
        # 印章
        f'<rect x="222" y="296" width="46" height="46" rx="6" fill="#A93226"/>'
        f'<text x="245" y="318" font-size="16" fill="#FBF7EC" text-anchor="middle" '
        f'font-family="serif">莲馨</text>'
        f'<text x="245" y="336" font-size="11" fill="#FBF7EC" text-anchor="middle" '
        f'font-family="serif">香囊</text>'
        f'</svg>'
    )


def generate(func_key, scene_key, style_key, intensity_key):
    """主入口：四个提示词 -> 一份香囊方案。非法取值会抛 ValueError。"""
    for key, table in ((func_key, FUNCTIONS), (scene_key, SCENES),
                       (style_key, STYLES), (intensity_key, INTENSITY)):
        if key not in table:
            raise ValueError(f"未知的选项：{key}")
    f, sc, st, it = (FUNCTIONS[func_key], SCENES[scene_key],
                     STYLES[style_key], INTENSITY[intensity_key])
    herbs = []
    for h in BASE_HERBS + f["herbs"]:
        if h not in herbs:
            herbs.append(h)
    name = f"莲馨·{st['short']}{f['name_word']}囊"
    reason = (
        f"你选了「{f['label']}」，对应传统合香里的{f['xiangxing']}，"
        f"香材以{'、'.join(f['herbs'])}为主；"
        f"「{sc['label']}」决定了囊型——{sc['form']}；"
        f"「{st['label']}」是外包装的纹样，{st['meaning']}"
        f"香气{it['label']}，{it['note']}"
    )
    return {
        "name": name,
        "function_label": f["label"],
        "xiangxing": f["xiangxing"],
        "function_desc": f["desc"],
        "scene_label": sc["label"],
        "form": sc["form"],
        "usage": sc["usage"],
        "persona": sc["persona"],
        "style_label": st["label"],
        "style_meaning": st["meaning"],
        "intensity_label": it["label"],
        "intensity_note": it["note"],
        "duration": it["duration"],
        "herbs": herbs,
        "reason": reason,
        "svg": sachet_svg(style_key),
        "palette": {"body": st["body"], "accent": st["accent"],
                    "cord": st["cord"], "tassel": st["tassel"]},
        "price_note": "香囊香饰参考价 168 元（计划书测算口径，以实际发售价为准）",
    }


def options():
    """给前端的全部可选提示词。"""
    return {
        "functions": [{"key": k, "label": v["label"],
                       "xiangxing": v["xiangxing"]} for k, v in FUNCTIONS.items()],
        "scenes": [{"key": k, "label": v["label"]} for k, v in SCENES.items()],
        "styles": [{"key": k, "label": v["label"]} for k, v in STYLES.items()],
        "intensities": [{"key": k, "label": v["label"]} for k, v in INTENSITY.items()],
    }
