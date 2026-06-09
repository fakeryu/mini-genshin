#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

echo "==> 当前目录: $PWD"
echo "==> 同步依赖"
npm install

echo "==> 运行 TypeScript 编译检查"
npx tsc --noEmit

echo "==> 构建项目"
npm run build

echo ""
echo "=== 验证通过 ==="
echo "启动命令: npm run dev"
echo ""
echo "如果希望 init.sh 直接启动开发服务器，请设置 RUN_START_COMMAND=1。"

if [ "${RUN_START_COMMAND:-0}" = "1" ]; then
  echo "==> 启动开发服务器"
  exec npm run dev
fi
