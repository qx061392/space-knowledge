#!/usr/bin/env bash
#
# 知识库同步打包脚本
# 将 data/ 目录打包为单个文件，方便下载到本地
#
# 用法：bash scripts/sync-pack.sh
#

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
DATA_DIR="$PROJECT_DIR/data"
OUTPUT="$PROJECT_DIR/docs/sync-package"

mkdir -p "$OUTPUT"

# 打包 data 目录
TAR_FILE="$OUTPUT/data-sync-$(date +%Y%m%d-%H%M%S).tar.gz"
tar -czf "$TAR_FILE" -C "$PROJECT_DIR" data/

# 同时复制最新版到固定文件名（方便固定URL下载）
cp "$TAR_FILE" "$OUTPUT/data-sync-latest.tar.gz"

# 生成文件清单
MANIFEST="$OUTPUT/CHANGELOG.md"
cat > "$MANIFEST" << EOF
# 知识库更新清单

> 打包时间: $(date '+%Y-%m-%d %H:%M:%S')

## 包含文件

| 文件 | 说明 |
|------|------|
| data/knowledge.js | 原始知识数据 + 合并逻辑 |
| data/knowledge-new.js | 新增知识条目 |
| data/quiz.js | 原始问答数据 + 合并逻辑 |
| data/quiz-new.js | 新增问答题 |

## 使用方法

1. 下载 \`data-sync-latest.tar.gz\`
2. 解压到你的微信小程序项目根目录（覆盖 data/ 文件夹）
3. 微信开发者工具会自动重新编译

\`\`\`bash
# 解压命令（在项目根目录执行）
tar -xzf data-sync-latest.tar.gz
\`\`\`

## 当前数据量

EOF

node -e "
const k = require('$DATA_DIR/knowledge.js');
const q = require('$DATA_DIR/quiz.js');
console.log('- 知识条目: ' + k.knowledgeList.length + ' 条');
console.log('- 问答题: ' + q.quizList.length + ' 题');
" >> "$MANIFEST"

echo "✅ 打包完成: $TAR_FILE"
echo "📦 固定下载: $OUTPUT/data-sync-latest.tar.gz"
echo "📋 更新清单: $MANIFEST"
echo ""
cat "$MANIFEST"
