# 湘知古香事 · 莲馨香囊宣传站（静态版，给 Cloudflare Pages）

由 Flask 版（`main` 分支，commit 99d6530）构建的纯静态站：
- `index.html`：同一份模板渲染出的静态页面，产品、香型、工艺与 Flask 版一致；
- `static/js/generator.js`：AI 定制逻辑的纯前端移植（香型知识库 + 规则生成，不接外部模型、不发网络请求），与 Flask 版 `generator.py` 同源；
- `static/js/app.js`、`static/css/style.css`、`static/img/`：交互、样式与产品图。

本地预览：`python3 -m http.server` 后打开 http://127.0.0.1:8000/

重新构建：`~/workspace/xiangnang-site/.venv/bin/python ~/workspace/build_static_site.py`
