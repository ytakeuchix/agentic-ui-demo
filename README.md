# Agentic UI Demo - 経費精算AIエージェント

Agentic UI (AI主導型UI)を体験するためのデモアプリケーションです。<br>
従来の管理画面のCRUD操作ではなく、AIが自律的にタスクを処理し、人間が必要な時だけ対話的に介入する新しいUXデザインです。

## コンセプト (Core Concepts)

このデモは3つの主要なUIモードで構成されています。

### 1. ZeroUI (Notification)
**"AIがすでに処理を終えている状態"**
ユーザーが画面を開くと、AIは既に日次の経費精算処理を完了しています。<br>
問題がなければ、ユーザーはただ「確認完了」のステータスを見るだけで済みます（Zero UI）。

### 2. GenUI (Generative UI)
**"AIが生成する、その場限りの修正フォーム"**
単純な不備（例：同席者の入力漏れ、簡単な用途不明）が見つかった場合、AIはチャットストリーム内に動的な修正フォームを生成します。<br>
ユーザーはコンテキストを切り替えることなく、チャットの中で修正を完結できます。

### 3. Canvas (Deep Verification)
**"複雑な推論プロセスを可視化する専用ワークスペース"**
高度な判断が必要なケース（例：海外出張の経路照合、高リスクな経費の監査）では、専用の「Canvas」モードが展開されます。<br>
左側に「事前申請内容（Plan）」、右側に「実績ログ（Actual）」を並べて表示し、AIがなぜその経費を承認/否認推奨するのか、その根拠（エビデンス）を人間に分かりやすく提示します。

## デモシナリオの概要

1.  **High Risk Violation**: 海外出張中の休日に発生した高額飲食費（Fisherman's Wharf）の監査。
2.  **AI Verification**: Uberの移動履歴と出張旅程の自動照合（Purple AI Status）。
3.  **Smooth Transition**: GenUIでの修正完了から、Canvasへのガイド付き遷移。
4.  **Completion**: 全項目の確認完了後、ZeroUIへのステータス反映と申請確定。

## 技術スタック

-   **Next.js 14** (App Router)
-   **Tailwind CSS** (Styling)
-   **Framer Motion** (Animations)
-   **Lucide React** (Icons)

## 始め方 (Getting Started)

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて確認してください。
