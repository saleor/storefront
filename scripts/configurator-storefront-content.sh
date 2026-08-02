#!/usr/bin/env sh
# Run Saleor Configurator for storefront content YAML.
# Loads runtime URL from .env.local and broad token from .env.configurator.local only.
set -e

MODE="${1:-deploy}"
CONFIG="config/saleor/storefront-content.config.yml"

if [ -f .env.local ]; then
	set -a
	# shellcheck disable=SC1091
	. ./.env.local
	set +a
fi

if [ -f .env.configurator.local ]; then
	set -a
	# shellcheck disable=SC1091
	. ./.env.configurator.local
	set +a
fi

if [ -z "${NEXT_PUBLIC_SALEOR_API_URL:-}" ]; then
	echo "[configurator] Missing NEXT_PUBLIC_SALEOR_API_URL (set in .env.local)" >&2
	exit 1
fi

if [ -z "${SALEOR_CONFIGURATOR_TOKEN:-}" ]; then
	echo "[configurator] Missing SALEOR_CONFIGURATOR_TOKEN in .env.configurator.local" >&2
	echo "[configurator] Use a dev/staging staff token — do not reuse production admin tokens." >&2
	exit 1
fi

COMMON_FLAGS="--config $CONFIG --url $NEXT_PUBLIC_SALEOR_API_URL --token $SALEOR_CONFIGURATOR_TOKEN"

if [ "$MODE" = "plan" ]; then
	echo "[configurator] Plan shows diff drift deletes for omitted shop sections — deploy only creates/updates YAML entities."
	echo "[configurator] Filter JSON output with: --json | jq '.result.operations[] | select(.action==\"create\")'"
	# shellcheck disable=SC2086
	pnpm dlx @saleor/configurator deploy $COMMON_FLAGS --plan
	exit 0
fi

# Partial YAML: deploy is additive (diff delete drift is not executed). See config/saleor/README.md
# shellcheck disable=SC2086
pnpm dlx @saleor/configurator deploy $COMMON_FLAGS --text
