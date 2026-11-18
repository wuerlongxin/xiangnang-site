# -*- coding: utf-8 -*-
"""湘知古香事 · 莲馨香囊宣传网站（Flask 后端）

运行：
    python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
    .venv/bin/python app.py
然后打开 http://127.0.0.1:5000

路由：
    GET  /              宣传首页（产品展示 + AI 定制模块）
    GET  /api/options   AI 模块的全部可选提示词
    POST /api/generate  AI 模块：按提示词生成香囊方案（JSON）
    GET  /api/products  产品列表（JSON）
"""
from flask import Flask, jsonify, render_template, request

from data import CRAFT_STEPS, FRAGRANCES, PRODUCTS
from generator import generate, options

app = Flask(__name__)


@app.route("/")
def index():
    return render_template(
        "index.html",
        products=PRODUCTS,
        fragrances=FRAGRANCES,
        craft_steps=CRAFT_STEPS,
        ai_options=options(),
    )


@app.route("/api/options")
def api_options():
    return jsonify(options())


@app.route("/api/products")
def api_products():
    return jsonify(PRODUCTS)


@app.route("/api/generate", methods=["POST"])
def api_generate():
    data = request.get_json(silent=True) or {}
    try:
        result = generate(
            data.get("function", ""),
            data.get("scene", ""),
            data.get("style", ""),
            data.get("intensity", ""),
        )
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400
    return jsonify(result)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
