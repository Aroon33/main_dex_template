cat << 'EOF' > $BASE/README.md
# Dev Trading Module (Admin Only)

This directory contains **admin-only dev tools**.

- UI directly reads on-chain state
- Used for verification during early development
- MUST NOT be imported by production Trade UI

Rules:
- Provider logic stays inside dev
- No reuse in hooks/trade
- Safe to delete before production

EOF
