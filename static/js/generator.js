(function (global) {
  "use strict";
  // AI 定制模块的纯前端版：与 Flask 版 generator.py 同一套
  // “香型知识库 + 规则生成”，不接外部模型，不发网络请求。
  var FUNCTIONS = {"anshen": {"label": "助眠安神", "xiangxing": "安神香", "herbs": ["沉香", "檀香", "艾叶"], "desc": "睡前放松氛围，香气沉稳柔和，适合放在床头、伴夜读与入睡前的安静时光。", "name_word": "安神"}, "qingxin": {"label": "净化空气", "xiangxing": "固神香", "herbs": ["艾叶", "佩兰", "藿香", "薄荷"], "desc": "清新空气、祛味辟秽的香气方向，适合衣柜、车内与常待的房间。", "name_word": "净气"}, "xingnao": {"label": "提神醒脑", "xiangxing": "凝神香", "herbs": ["薄荷", "丁香", "藿香"], "desc": "清凉醒神的香气方向，适合晨读、伏案工作与午后犯困时提神。", "name_word": "醒神"}, "yueshen": {"label": "愉悦心情", "xiangxing": "悦神香", "herbs": ["丁香", "沉香", "佩兰"], "desc": "温润愉悦的香气方向，适合会客、品茗与想给日常加点好心情的时候。", "name_word": "悦心"}};
  var SCENES = {"carry": {"label": "随身佩戴", "form": "小巧抽绳囊，佩于衣襟或挂在包袋上", "usage": "随身佩戴，走动时香气淡淡散开；不佩戴时放进衣柜，衣物也带一点香。", "persona": "随身携带派"}, "bedside": {"label": "挂床头", "form": "挂绳加长的床头囊，挂在床头或床边挂钩上", "usage": "睡前挂在床头，香气在枕边慢慢散开；白天取下挂在衣柜里继续用。", "persona": "睡前仪式派"}, "car": {"label": "放车内", "form": "车载挂囊，挂绳可调，挂在后视镜或车门挂钩上", "usage": "挂在车内代替化学香片，香气清淡不刺鼻，开车时不分心。", "persona": "车载清新派"}, "desk": {"label": "摆书房案头", "form": "案头陈设囊，配小香盘，可立放于书桌、茶台", "usage": "放在书房、茶室案头，读书品茗时香气相伴；也可作案头摆件。", "persona": "案头雅致派"}, "gift": {"label": "送礼", "form": "莲纹礼盒装，附手写贺卡与香囊使用说明", "usage": "端午、中秋、毕业与入职等场合送礼，礼盒与贺卡都可定制祝福语。", "persona": "送礼心意派"}};
  var STYLES = {"hehua": {"label": "荷花", "short": "荷", "meaning": "荷花出淤泥而不染，是湘莲的意象，也是莲馨香的莲纹来源。", "body": "#E9B7BC", "accent": "#8E3B46", "motif": "#F6E8E4", "cord": "#8E3B46", "tassel": "#C9A86A"}, "juhua": {"label": "菊花", "short": "菊", "meaning": "菊花高洁，秋日金黄，适合送给长辈与师长。", "body": "#E8C86A", "accent": "#9A6B1F", "motif": "#FBF3DC", "cord": "#9A6B1F", "tassel": "#A93226"}, "meihua": {"label": "梅花", "short": "梅", "meaning": "梅花凌寒而开，寓意坚韧，朱红配墨色最显年味与喜气。", "body": "#C65D4E", "accent": "#7A2A20", "motif": "#F7E9DC", "cord": "#7A2A20", "tassel": "#2F4A4A"}, "lanhua": {"label": "兰花", "short": "兰", "meaning": "兰花幽香清雅，淡绿配米白，最适合书房与案头。", "body": "#BFD8C0", "accent": "#3E6B4F", "motif": "#F2F6EC", "cord": "#3E6B4F", "tassel": "#C9A86A"}, "shizi": {"label": "柿子", "short": "柿", "meaning": "柿子谐音“事事如意”，柿红配绿叶，是最讨喜的吉祥款。", "body": "#E07840", "accent": "#A34A1F", "motif": "#FBEEDD", "cord": "#A34A1F", "tassel": "#3E6B4F"}};
  var INTENSITY = {"dan": {"label": "淡雅", "note": "香材配比偏清淡，香气若有若无，适合对气味敏感的人。", "duration": "留香参考约 2–4 周"}, "zhong": {"label": "适中", "note": "香材配比适中，近闻清晰、远闻淡淡，是大多数人的选择。", "duration": "留香参考约 4–6 周"}, "chun": {"label": "醇厚", "note": "香材配比偏浓郁，香气饱满绵长，适合放在衣柜、车内等空间。", "duration": "留香参考约 6–8 周"}};
  var BASE_HERBS = ["艾叶", "薄荷", "丁香", "佩兰"];

  function motifSvg(styleKey, cx, cy, color) {
    var petals = "", i, ang, px, py;
    if (styleKey === "hehua") { // 荷花：五片花瓣
      [-50, -25, 0, 25, 50].forEach(function (a) {
        petals += '<ellipse cx="' + cx + '" cy="' + (cy - 26) + '" rx="11" ry="26" fill="' + color + '" transform="rotate(' + a + " " + cx + " " + cy + ')" opacity="0.92"/>';
      });
      return petals + '<circle cx="' + cx + '" cy="' + (cy + 6) + '" r="8" fill="#C9A86A"/>';
    }
    if (styleKey === "juhua") { // 菊花：放射状细瓣
      for (i = 0; i < 12; i++) {
        ang = i * 30;
        petals += '<ellipse cx="' + cx + '" cy="' + (cy - 24) + '" rx="5" ry="22" fill="' + color + '" transform="rotate(' + ang + " " + cx + " " + cy + ')" opacity="0.9"/>';
      }
      return petals + '<circle cx="' + cx + '" cy="' + cy + '" r="9" fill="#9A6B1F"/>';
    }
    if (styleKey === "meihua") { // 梅花：五圆瓣
      for (i = 0; i < 5; i++) {
        ang = i * 72 - 90;
        px = (cx + 20 * Math.cos(ang * Math.PI / 180)).toFixed(0);
        py = (cy + 20 * Math.sin(ang * Math.PI / 180)).toFixed(0);
        petals += '<circle cx="' + px + '" cy="' + py + '" r="12" fill="' + color + '" opacity="0.92"/>';
      }
      return petals + '<circle cx="' + cx + '" cy="' + cy + '" r="7" fill="#C9A86A"/>';
    }
    if (styleKey === "lanhua") { // 兰花：三片长瓣
      return '<path d="M' + cx + " " + (cy + 26) + " Q " + (cx - 26) + " " + (cy - 6) + " " + (cx - 8) + " " + (cy - 34) + " Q " + cx + " " + (cy - 8) + " " + cx + " " + (cy + 26) + ' Z" fill="' + color + '" opacity="0.92"/>'
        + '<path d="M' + cx + " " + (cy + 26) + " Q " + (cx + 26) + " " + (cy - 6) + " " + (cx + 8) + " " + (cy - 34) + " Q " + cx + " " + (cy - 8) + " " + cx + " " + (cy + 26) + ' Z" fill="' + color + '" opacity="0.92"/>'
        + '<path d="M' + cx + " " + (cy + 26) + " Q " + (cx - 8) + " " + (cy - 18) + " " + cx + " " + (cy - 40) + " Q " + (cx + 8) + " " + (cy - 18) + " " + cx + " " + (cy + 26) + ' Z" fill="' + color + '" opacity="0.95"/>';
    }
    // shizi 柿子：圆身 + 绿叶
    return '<circle cx="' + cx + '" cy="' + cy + '" r="26" fill="' + color + '" opacity="0.95"/>'
      + '<ellipse cx="' + (cx - 14) + '" cy="' + (cy - 28) + '" rx="12" ry="6" fill="#3E6B4F" transform="rotate(-30 ' + (cx - 14) + " " + (cy - 28) + ')"/>'
      + '<ellipse cx="' + (cx + 14) + '" cy="' + (cy - 28) + '" rx="12" ry="6" fill="#3E6B4F" transform="rotate(30 ' + (cx + 14) + " " + (cy - 28) + ')"/>'
      + '<rect x="' + (cx - 2) + '" y="' + (cy - 38) + '" width="4" height="12" rx="2" fill="#7A5A3A"/>';
  }

  function sachetSvg(styleKey) {
    var s = STYLES[styleKey];
    var body = s.body, accent = s.accent, motif = s.motif, cord = s.cord, tassel = s.tassel;
    var motifPart = motifSvg(styleKey, 150, 190, motif);
    return '<svg viewBox="0 0 300 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + s.label + '纹香囊示意图">'
      + '<rect x="6" y="6" width="288" height="348" rx="18" fill="#FBF7EC"/>'
      + '<path d="M150 18 Q 120 52 138 78 M150 18 Q 180 52 162 78" stroke="' + cord + '" stroke-width="5" fill="none" stroke-linecap="round"/>'
      + '<path d="M96 92 Q 150 74 204 92 L 216 236 Q 216 292 150 292 Q 84 292 84 236 Z" fill="' + body + '" stroke="' + accent + '" stroke-width="3"/>'
      + '<path d="M96 92 Q 150 108 204 92" stroke="' + accent + '" stroke-width="3" fill="none"/>'
      + '<path d="M108 100 L 106 122 M132 104 L 131 126 M168 104 L 169 126 M192 100 L 194 122" stroke="' + accent + '" stroke-width="2" opacity="0.55"/>'
      + motifPart
      + '<line x1="150" y1="292" x2="150" y2="312" stroke="' + cord + '" stroke-width="4"/>'
      + '<path d="M138 312 L 162 312 L 158 344 Q 150 350 142 344 Z" fill="' + tassel + '"/>'
      + '<path d="M144 314 L 143 342 M150 314 L 150 344 M156 314 L 157 342" stroke="#8A6D3B" stroke-width="1.4" opacity="0.6"/>'
      + '<rect x="222" y="296" width="46" height="46" rx="6" fill="#A93226"/>'
      + '<text x="245" y="318" font-size="16" fill="#FBF7EC" text-anchor="middle" font-family="serif">莲馨</text>'
      + '<text x="245" y="336" font-size="11" fill="#FBF7EC" text-anchor="middle" font-family="serif">香囊</text>'
      + "</svg>";
  }

  function generate(funcKey, sceneKey, styleKey, intensityKey) {
    var tables = { func: FUNCTIONS, scene: SCENES, style: STYLES, intensity: INTENSITY };
    var keys = { func: funcKey, scene: sceneKey, style: styleKey, intensity: intensityKey };
    Object.keys(keys).forEach(function (k) {
      if (!tables[k][keys[k]]) throw new Error("未知的选项：" + keys[k]);
    });
    var f = FUNCTIONS[funcKey], sc = SCENES[sceneKey], st = STYLES[styleKey], it = INTENSITY[intensityKey];
    var herbs = [];
    BASE_HERBS.concat(f.herbs).forEach(function (h) { if (herbs.indexOf(h) === -1) herbs.push(h); });
    var name = "莲馨·" + st.short + f.name_word + "囊";
    var reason = "你选了「" + f.label + "」，对应传统合香里的" + f.xiangxing + "，"
      + "香材以" + f.herbs.join("、") + "为主；"
      + "「" + sc.label + "」决定了囊型——" + sc.form + "；"
      + "「" + st.label + "」是外包装的纹样，" + st.meaning
      + "香气" + it.label + "，" + it.note;
    return {
      name: name,
      function_label: f.label,
      xiangxing: f.xiangxing,
      function_desc: f.desc,
      scene_label: sc.label,
      form: sc.form,
      usage: sc.usage,
      persona: sc.persona,
      style_label: st.label,
      style_meaning: st.meaning,
      intensity_label: it.label,
      intensity_note: it.note,
      duration: it.duration,
      herbs: herbs,
      reason: reason,
      svg: sachetSvg(styleKey),
      palette: { body: st.body, accent: st.accent, cord: st.cord, tassel: st.tassel },
      price_note: "香囊香饰参考价 168 元（计划书测算口径，以实际发售价为准）"
    };
  }

  function options() {
    function list(table) {
      return Object.keys(table).map(function (k) {
        var v = table[k];
        var o = { key: k, label: v.label };
        if (v.xiangxing) o.xiangxing = v.xiangxing;
        return o;
      });
    }
    return {
      functions: list(FUNCTIONS),
      scenes: list(SCENES),
      styles: list(STYLES),
      intensities: list(INTENSITY)
    };
  }

  global.SachetGen = { generate: generate, options: options, sachetSvg: sachetSvg };
})(typeof window !== "undefined" ? window : globalThis);
