// AI 定制模块：四组提示词单选，提交到 Flask 后端 /api/generate 生成香囊方案。
(function () {
  var form = document.getElementById("ai-form");
  if (!form) return;
  var hint = document.getElementById("ai-hint");
  var resultBox = document.getElementById("ai-result");
  var submitBtn = document.getElementById("ai-submit");
  var picked = { "function": null, "scene": null, "style": null, "intensity": null };

  // 点选 chips：同组单选
  document.querySelectorAll(".chips").forEach(function (group) {
    var key = group.getAttribute("data-group");
    group.querySelectorAll(".chip").forEach(function (chip) {
      chip.addEventListener("click", function () {
        group.querySelectorAll(".chip").forEach(function (c) { c.classList.remove("active"); });
        chip.classList.add("active");
        picked[key] = chip.getAttribute("data-value");
        hint.textContent = "已选 " + Object.values(picked).filter(Boolean).length + " / 4，选满四个就可以生成了。";
      });
    });
  });

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var missing = Object.keys(picked).filter(function (k) { return !picked[k]; });
    if (missing.length) {
      hint.textContent = "还差 " + missing.length + " 个没选：请把四个问题都点一点再生成。";
      resultBox.hidden = true;
      return;
    }
    submitBtn.disabled = true;
    submitBtn.textContent = "正在生成你的香囊…";
    hint.textContent = "后端正在按你的选择组合香型、囊型与纹样…";
    fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(picked)
    })
      .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, body: j }; }); })
      .then(function (res) {
        submitBtn.disabled = false;
        submitBtn.textContent = "生成我的香囊";
        if (!res.ok) {
          hint.textContent = "生成失败：" + (res.body.error || "请稍后再试");
          return;
        }
        var d = res.body;
        document.getElementById("ai-svg").innerHTML = d.svg;
        document.getElementById("ai-persona").textContent = d.persona + " · " + d.style_label + "纹";
        document.getElementById("ai-name").textContent = d.name;
        document.getElementById("ai-reason").textContent = d.reason;
        document.getElementById("ai-xiangxing").textContent =
          d.xiangxing + "（" + d.function_label + "）· 香气" + d.intensity_label;
        document.getElementById("ai-herbs").textContent = d.herbs.join("、");
        document.getElementById("ai-form-desc").textContent = d.form;
        document.getElementById("ai-usage").textContent = d.usage;
        document.getElementById("ai-duration").textContent =
          d.duration + "（" + d.intensity_note + "）";
        document.getElementById("ai-price").textContent = d.price_note;
        resultBox.hidden = false;
        hint.textContent = "生成好了，往下看你的专属香囊。不满意可以换个组合再试一次。";
        resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "生成我的香囊";
        hint.textContent = "网络有点问题，请检查服务是否在运行，再点一次生成。";
      });
  });

  document.getElementById("ai-again").addEventListener("click", function () {
    resultBox.hidden = true;
    hint.textContent = "换个组合试试：改一两个选项，生成的香囊会完全不一样。";
    document.getElementById("ai").scrollIntoView({ behavior: "smooth" });
  });
})();
