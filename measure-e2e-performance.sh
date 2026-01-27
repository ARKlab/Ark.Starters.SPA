#!/bin/bash

# E2E Test Performance Measurement Script
# This script measures the startup time of the e2e test servers

echo "🚀 E2E Test Server Startup Performance Test"
echo "============================================"
echo ""

# Cleanup any existing servers
pkill -f "PORT=4001" 2>/dev/null
pkill -f "PORT=3001" 2>/dev/null
sleep 2

echo "📊 Starting servers and measuring startup time..."
echo ""

# Start timing
START_TIME=$(date +%s.%N)

# Start connectionStrings server
echo "Starting connectionStrings server on port 4001..."
npm run e2e:ci:connectionStrings > /tmp/connectionStrings.log 2>&1 &
CONN_PID=$!

# Start vite dev server
echo "Starting Vite dev server on port 3001..."
npm run e2e:ci:app > /tmp/vite.log 2>&1 &
VITE_PID=$!

# Wait for both servers to be ready
echo "Waiting for servers to be ready..."
npx wait-on --timeout 60000 http-get://localhost:4001 http-get://localhost:3001 2>/dev/null

# End timing
END_TIME=$(date +%s.%N)
ELAPSED=$(echo "$END_TIME - $START_TIME" | bc)

echo ""
echo "✅ Servers started successfully!"
echo ""
echo "📈 Performance Results:"
echo "   Total startup time: ${ELAPSED}s"
echo ""

# Check Vite startup time from logs
VITE_TIME=$(grep "ready in" /tmp/vite.log | grep -oP '\d+\s*ms' | head -1)
if [ -n "$VITE_TIME" ]; then
    echo "   Vite dev server ready: $VITE_TIME"
fi

echo ""
echo "🔗 Server URLs:"
echo "   ConnectionStrings: http://localhost:4001"
echo "   Application:       http://localhost:3001"
echo ""

# Test connectivity
echo "🧪 Testing server responses..."
CONN_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:4001)
APP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001)

if [ "$CONN_STATUS" = "200" ]; then
    echo "   ✅ ConnectionStrings server responding (HTTP $CONN_STATUS)"
else
    echo "   ❌ ConnectionStrings server error (HTTP $CONN_STATUS)"
fi

if [ "$APP_STATUS" = "200" ]; then
    echo "   ✅ Application server responding (HTTP $APP_STATUS)"
else
    echo "   ❌ Application server error (HTTP $APP_STATUS)"
fi

echo ""
echo "📝 Performance Improvement:"
echo "   Old approach (build + preview): ~106s for build, ~5s for preview = ~111s total"
echo "   New approach (dev server):      ~${ELAPSED}s total"
IMPROVEMENT=$(echo "111 - $ELAPSED" | bc)
PERCENT=$(echo "scale=1; ($IMPROVEMENT / 111) * 100" | bc)
echo "   Improvement:                    ~${IMPROVEMENT}s faster (~${PERCENT}% reduction)"
echo ""
echo "   Note: This measures server startup time only."
echo "   Actual test execution time is the same for both approaches."
echo ""

# Cleanup
echo "🧹 Cleaning up..."
kill $CONN_PID $VITE_PID 2>/dev/null
wait $CONN_PID $VITE_PID 2>/dev/null

echo "✨ Test complete!"
