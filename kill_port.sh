#!/bin/bash

PORT=5000

# 查找占用指定端口的进程
PID=$(lsof -t -i:$PORT)

# 如果找到进程，则终止
if [ -n "$PID" ]; then
    echo "Killing process $PID on port $PORT"
    kill -9 $PID
else
    echo "No process found on port $PORT"
fi
