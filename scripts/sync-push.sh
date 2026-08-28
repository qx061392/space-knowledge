#!/usr/bin/env bash
#
# GitHub同步推送脚本（容器端）
# 将data/目录的文件推送到GitHub仓库
#
# 环境变量需要提前设置：
#   export GITHUB_TOKEN=ghp_xxxxx
#   export GITHUB_OWNER=你的用户名
#   export GITHUB_REPO=仓库名
#
# 用法：bash scripts/sync-push.sh
#

set -e

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# 自动加载.env文件
if [ -f "$PROJECT_DIR/.env" ]; then
  export $(grep -v '^#' "$PROJECT_DIR/.env" | xargs)
fi

GITHUB_TOKEN="${GITHUB_TOKEN}"
GITHUB_OWNER="${GITHUB_OWNER}"
GITHUB_REPO="${GITHUB_REPO}"

if [ -z "$GITHUB_TOKEN" ] || [ -z "$GITHUB_OWNER" ] || [ -z "$GITHUB_REPO" ]; then
  echo "❌ 缺少环境变量！请先设置："
  echo "  export GITHUB_TOKEN=ghp_你的token"
  echo "  export GITHUB_OWNER=你的GitHub用户名"
  echo "  export GITHUB_REPO=仓库名"
  exit 1
fi

FILES=(
  "data/knowledge.js"
  "data/knowledge-new.js"
  "data/quiz.js"
  "data/quiz-new.js"
)

API_BASE="https://api.github.com/repos/$GITHUB_OWNER/$GITHUB_REPO/contents"

echo "🚀 推送数据文件到 GitHub ($GITHUB_OWNER/$GITHUB_REPO)..."

for file in "${FILES[@]}"; do
  FILEPATH="$PROJECT_DIR/$file"
  
  if [ ! -f "$FILEPATH" ]; then
    echo "  ⚠️  跳过 $file (文件不存在)"
    continue
  fi

  # 获取当前文件的SHA（用于更新已有文件）
  SHA=$(curl -sf -H "Authorization: token $GITHUB_TOKEN" \
    "$API_BASE/$file" 2>/dev/null | \
    node -e "let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{console.log(JSON.parse(d).sha||'')}catch{console.log('')}})" 2>/dev/null || echo "")

  # Base64编码文件内容
  CONTENT=$(base64 -w 0 "$FILEPATH")

  # 构建JSON payload
  if [ -n "$SHA" ]; then
    PAYLOAD=$(node -e "
      const fs=require('fs');
      const content=fs.readFileSync('$FILEPATH').toString('base64');
      console.log(JSON.stringify({
        message: 'chore: update $file',
        content: content,
        sha: '$SHA'
      }));
    ")
  else
    PAYLOAD=$(node -e "
      const fs=require('fs');
      const content=fs.readFileSync('$FILEPATH').toString('base64');
      console.log(JSON.stringify({
        message: 'chore: add $file',
        content: content
      }));
    ")
  fi

  # 推送到GitHub
  RESULT=$(curl -sf -X PUT \
    -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    -d "$PAYLOAD" \
    "$API_BASE/$file" 2>/dev/null)

  if [ -n "$RESULT" ]; then
    echo "  ✅ $file 推送成功"
  else
    echo "  ❌ $file 推送失败"
  fi
done

echo "✨ 推送完成！"
