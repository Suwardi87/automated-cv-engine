#!/usr/bin/env bash
# ==============================================================================
# scripts/collect-test-result.sh — Adapter per stack untuk result.json
# ==============================================================================
# Baca TESTS_PASSED + DETECTED_STACK, tulis result.json dengan counts yang
# real (seakurat mungkin per stack), dan generate HTML report.
#
# Strategi per stack:
#   - Node/Jest: baca reports/test/jest-junit.xml (kalau ada)
#   - Node/Vitest: baca reports/test/vitest-junit.xml
#   - Python: parse pytest output di reports/test/pytest.log
#   - Flutter: parse 'flutter test' output di reports/test/flutter-test.log
#   - Go: parse 'go test' output di reports/test/go-test.log
#   - Fallback: placeholder counts
#
# Pemanggilan:
#   TESTS_PASSED=true|false DETECTED_STACK=<stack> bash scripts/collect-test-result.sh
#   atau argumen lama: bash scripts/collect-test-result.sh <TESTS_PASSED>
# ==============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Argumen 1: TESTS_PASSED (legacy support)
TESTS_PASSED="${1:-${TESTS_PASSED:-true}}"
DETECTED_STACK="${DETECTED_STACK:-}"

REPORT_DIR="${REPORT_DIR:-reports/test}"
RESULT_FILE="$REPORT_DIR/result.json"
mkdir -p "$REPORT_DIR"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

# Helper: tulis result.json dari nilai yang diberikan
write_result() {
    local total="$1" passed="$2" failed="$3" duration="$4" details="$5"
    cat > "$RESULT_FILE" <<EOF
{
  "total": ${total:-0},
  "passed": ${passed:-0},
  "failed": ${failed:-0},
  "total_duration": ${duration:-0.0},
  "timestamp": "${TIMESTAMP}",
  "status": "$([ "$passed" = "$total" ] && [ "$failed" = "0" ] && echo "passed" || echo "failed")",
  "results": [
    {
      "name": "suite:${DETECTED_STACK:-unknown}",
      "passed": $([ "$failed" = "0" ] && echo "true" || echo "false"),
      "duration": ${duration:-0.0},
      "type": "integration",
      "details": "${details}",
      "status_code": 0
    }
  ]
}
EOF
    echo "✓ result.json written: $RESULT_FILE (total=$total passed=$passed failed=$failed)"
}

# Parse berdasarkan stack
parse_node_jest() {
    local junit="$REPORT_DIR/junit.xml"
    if [ -f "$junit" ]; then
        # Format junit: <testsuite tests="N" failures="M" time="T">
        local total failed duration
        total=$(grep -oE 'tests="[0-9]+"' "$junit" | head -1 | grep -oE '[0-9]+' || echo "0")
        failed=$(grep -oE 'failures="[0-9]+"' "$junit" | head -1 | grep -oE '[0-9]+' || echo "0")
        duration=$(grep -oE 'time="[0-9.]+"' "$junit" | head -1 | grep -oE '[0-9.]+' || echo "0.0")
        local passed=$((total - failed))
        write_result "$total" "$passed" "$failed" "$duration" "Parsed from jest junit.xml"
        return 0
    fi
    return 1
}

parse_python_pytest() {
    local log="$REPORT_DIR/pytest.log"
    if [ -f "$log" ]; then
        # Cari baris seperti: "===== 5 passed, 2 failed in 3.45s ====="
        local summary passed=0 failed=0 duration=0.0
        summary=$(grep -E "passed|failed|error" "$log" | tail -1 || echo "")
        if [ -n "$summary" ]; then
            passed=$(echo "$summary" | grep -oE '[0-9]+ passed' | grep -oE '[0-9]+' || echo "0")
            failed=$(echo "$summary" | grep -oE '[0-9]+ failed' | grep -oE '[0-9]+' || echo "0")
            failed=$(echo "$summary" | grep -oE '[0-9]+ error' | grep -oE '[0-9]+' || echo "$failed")
            duration=$(echo "$summary" | grep -oE 'in [0-9.]+s' | grep -oE '[0-9.]+' || echo "0.0")
        fi
        local total=$((passed + failed))
        write_result "$total" "$passed" "$failed" "$duration" "Parsed from pytest.log"
        return 0
    fi
    return 1
}

parse_flutter_test() {
    local log="$REPORT_DIR/flutter-test.log"
    if [ -f "$log" ]; then
        # Format: "+N -M: Some test" atau "All tests passed!"
        local passed=0 failed=0
        local line=$(grep -E '^\+[0-9]' "$log" | tail -1 || echo "")
        if [ -n "$line" ]; then
            passed=$(echo "$line" | grep -oE '\+[0-9]+' | grep -oE '[0-9]+' || echo "0")
            failed=$(echo "$line" | grep -oE '\-[0-9]+' | grep -oE '[0-9]+' || echo "0")
        elif grep -q "All tests passed" "$log"; then
            # Hitung baris "+1: test_name"
            passed=$(grep -cE '^\+[0-9]+:' "$log" || echo "0")
        fi
        local total=$((passed + failed))
        write_result "$total" "$passed" "$failed" "0.0" "Parsed from flutter-test.log"
        return 0
    fi
    return 1
}

parse_go_test() {
    local log="$REPORT_DIR/go-test.log"
    if [ -f "$log" ]; then
        # Hitung baris "ok" dan "FAIL"
        local passed=0 failed=0
        passed=$(grep -cE '^(ok|--- PASS)' "$log" || echo "0")
        failed=$(grep -cE '^(FAIL|--- FAIL)' "$log" || echo "0")
        local total=$((passed + failed))
        write_result "$total" "$passed" "$failed" "0.0" "Parsed from go-test.log"
        return 0
    fi
    return 1
}

# Dispatch per stack
case "$DETECTED_STACK" in
    nextjs|vue-nuxt|node-api|mobile-expo)
        parse_node_jest || {
            # Fallback placeholder
            if [ "$TESTS_PASSED" = "true" ]; then
                write_result 1 1 0 0.0 "Node stack: jest junit.xml not found, using TESTS_PASSED placeholder"
            else
                write_result 1 0 1 0.0 "Node stack: jest junit.xml not found, using TESTS_PASSED placeholder"
            fi
        }
        ;;
    python)
        parse_python_pytest || {
            if [ "$TESTS_PASSED" = "true" ]; then
                write_result 1 1 0 0.0 "Python: pytest.log not found, placeholder"
            else
                write_result 1 0 1 0.0 "Python: pytest.log not found, placeholder"
            fi
        }
        ;;
    flutter)
        parse_flutter_test || {
            if [ "$TESTS_PASSED" = "true" ]; then
                write_result 1 1 0 0.0 "Flutter: flutter-test.log not found, placeholder"
            else
                write_result 1 0 1 0.0 "Flutter: flutter-test.log not found, placeholder"
            fi
        }
        ;;
    *)
        # Unknown stack atau kosong: placeholder minimal
        if [ "$TESTS_PASSED" = "true" ]; then
            write_result 1 1 0 0.0 "Unknown/no stack: placeholder"
        else
            write_result 1 0 1 0.0 "Unknown/no stack: placeholder"
        fi
        ;;
esac
