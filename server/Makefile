# Makefile

.PHONY: lint fix format all

# Run the linter check
lint:
	uv run ruff check .  

# Run the linter check with fixes
fix:
	uv run ruff check . --fix

# Run the formatter
format:
	uv run ruff format .

# Run fix and format sequentially
lint-format: fix format