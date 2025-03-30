
# 변수 선언
request_id="b2b74bdb-a3d7-4395-a35e-9ac54e07f574"

# curl 명령에서 변수 사용
curl -X POST http://0.0.0.0:8084/download-html \
     -H "Content-Type: application/json" \
     -d "{\"is_test\": true, \"source_id\": \"$source_id\", \"request_id\":\"$request_id\"}"


