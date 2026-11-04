#!/usr/bin/env bash
# Lists code in a route or component folder that breaks the writing-css conventions.
# Usage: bash .claude/skills/design-self-critique/audit.sh src/routes/some-page
# Each finding is either fixed or named as a deliberate exception. Exits 1 on any finding.
set -u

dir="${1:?Pass the folder to audit}"
[ -d "$dir" ] || { echo "Not a folder: $dir"; exit 2; }
found=0

report() {
	local title="$1" results="$2"
	[ -z "$results" ] && return
	found=1
	printf '\n%s\n%s\n' "$title" "$results"
}

search() {
	grep -rnE --include='*.svelte' --include='*.css' "$1" "$dir" 2>/dev/null
}

long=""
for file in $(find "$dir" -name '*.svelte'); do
	lines=$(awk '/<style>/{f=1;next}/<\/style>/{f=0}f{n++}END{print n+0}' "$file")
	[ "$lines" -gt 80 ] && long+="$file: $lines lines"$'\n'
done
report 'CSS-5: style block over 80 lines, split into components' "${long%$'\n'}"

report 'CSS-3: local column tracks, use l:grid and data-grid-columns for page columns' \
	"$(search 'grid-template-columns:')"
report 'CSS-3: media query, allowed only to change spans or for a structural change' \
	"$(search '@media')"

if ! grep -rqE --include='*.svelte' 'l:grid' "$dir"; then
	report 'CSS-3: no l:grid anywhere in this folder' "$dir"
fi

report 'CSS-4: physical sizing, use inline-size and block-size' \
	"$(search '(^|[^-a-z])(width|height): ')"
report 'CSS-4: literal border width, use --border-w-*' \
	"$(search 'border[a-z-]*: *[0-9.]+px')"
report 'CSS-4: literal font size, use --text-*' \
	"$(search 'font-size: *(clamp|[0-9.])')"
report 'CSS-4: hardcoded colour, use a token' \
	"$(search '#[0-9a-fA-F]{3,8}\b' | grep -vE 'href=|url\(#|id=')"
report 'CSS-4: older scale, use --text-* and --gap-*' \
	"$(search 'var\(--(fs|space)-|u:fs-')"

if [ "$found" -eq 0 ]; then
	echo "No findings in $dir"
	exit 0
fi
exit 1
