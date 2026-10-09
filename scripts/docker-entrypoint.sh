#!/bin/sh
set -eu

# Node serves /api/* on loopback; nginx serves static + proxies /api to Node.
export PORT="${PORT:-3000}"
node /app/scripts/render-server.mjs &
NODE_PID=$!

# Give Express a moment to bind before nginx starts accepting traffic.
i=0
while [ "$i" -lt 40 ]; do
  if wget -q -O /dev/null "http://127.0.0.1:${PORT}/api/pickup-points" 2>/dev/null; then
    break
  fi
  i=$((i + 1))
  sleep 0.25
done

if ! kill -0 "$NODE_PID" 2>/dev/null; then
  echo "render-server failed to start" >&2
  exit 1
fi

exec nginx -g 'daemon off;'
