#!/usr/bin/env bash
#
# 航天新闻后台守护进程
# 定时拉取RSS新闻 + 自动推送到GitHub
#
# 启动：bash scripts/news-watcher.sh start
# 停止：bash scripts/news-watcher.sh stop
# 状态：bash scripts/news-watcher.sh status
#

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
CACHE_DIR="$PROJECT_DIR/docs/news-cache"
SCRIPT="$PROJECT_DIR/scripts/fetch-space-news.js"
PUSH_SCRIPT="$PROJECT_DIR/scripts/sync-push.sh"
PID_FILE="$CACHE_DIR/.watcher.pid"
LOG_FILE="$CACHE_DIR/watcher.log"
INTERVAL=86400  # 24小时

start() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "⚠️  守护进程已在运行 (PID: $(cat "$PID_FILE"))"
    exit 1
  fi

  echo "🛰️  启动航天新闻守护进程..."
  echo "📁 项目目录: $PROJECT_DIR"
  echo "⏱️  拉取间隔: $INTERVAL 秒 ($(($INTERVAL/3600)) 小时)"

  nohup bash -c "
    while true; do
      echo \"\$(date '+%Y-%m-%d %H:%M:%S') === 开始拉取 ===\"
      node \"$SCRIPT\"
      echo \"\$(date '+%Y-%m-%d %H:%M:%S') === 拉取完成 ===\"
      sleep $INTERVAL
    done
  " > "$LOG_FILE" 2>&1 &

  echo $! > "$PID_FILE"
  echo "✅ 守护进程已启动 (PID: $(cat "$PID_FILE"))"
  echo "📋 日志: $LOG_FILE"
}

stop() {
  if [ ! -f "$PID_FILE" ]; then
    echo "⚠️  守护进程未运行"
    exit 1
  fi
  PID=$(cat "$PID_FILE")
  if kill -0 "$PID" 2>/dev/null; then
    kill "$PID"
    echo "🛑 守护进程已停止 (PID: $PID)"
  else
    echo "⚠️  进程 $PID 已不存在"
  fi
  rm -f "$PID_FILE"
}

status() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "✅ 守护进程运行中 (PID: $(cat "$PID_FILE"))"
    echo ""
    echo "📋 最近10行日志:"
    tail -10 "$LOG_FILE" 2>/dev/null
  else
    echo "❌ 守护进程未运行"
    echo "💡 启动: bash scripts/news-watcher.sh start"
  fi
}

case "$1" in
  start)   start ;;
  stop)    stop ;;
  status)  status ;;
  restart) stop; start ;;
  *)
    echo "用法: bash scripts/news-watcher.sh {start|stop|status|restart}"
    echo ""
    echo "  start   启动后台定时拉取"
    echo "  stop    停止后台拉取"
    echo "  status  查看运行状态和日志"
    echo "  restart 重启守护进程"
    exit 1
    ;;
esac
