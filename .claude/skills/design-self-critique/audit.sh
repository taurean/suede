#!/usr/bin/env bash
# Lists code in a route or component folder that breaks the writing-css conventions.
# Usage: bash .claude/skills/design-self-critique/audit.sh src/routes/some-page
# Each finding is either fixed or named as a deliberate exception.
# Exits 0 with no findings, 1 with findings, 2 if the audit itself couldn't run.
set -u

dir="${1:?Pass the folder to audit}"
[ -d "$dir" ] || { echo "Not a folder: $dir" >&2; exit 2; }
found=0

print_and_mark_found() {
	local title="$1" results="$2"
	[ -z "$results" ] && return
	found=1
	printf '\n%s\n%s\n' "$title" "$results"
}

# grep exits 1 for no matches and 2 for an error, such as a file it can't read. An error stops
# the audit, because a skipped file would otherwise read as a clean one.
search_or_exit() {
	local pattern="$1" status
	search_results=$(grep -rnE --include='*.svelte' --include='*.css' "$pattern" "$dir")
	status=$?
	if [ "$status" -gt 1 ]; then
		echo "Audit failed: grep couldn't read every file in $dir" >&2
		exit 2
	fi
}

check() {
	search_or_exit "$2"
	print_and_mark_found "$1" "$search_results"
}

long=""
while IFS= read -r file; do
	lines=$(awk '/<style>/{f=1;next}/<\/style>/{f=0}f{n++}END{print n+0}' "$file") || {
		echo "Audit failed: couldn't read $file" >&2
		exit 2
	}
	[ "$lines" -gt 80 ] && long+="$file: $lines lines"$'\n'
done < <(find "$dir" -name '*.svelte')
print_and_mark_found 'CSS-5: style block over 80 lines, split into components' "${long%$'\n'}"

check 'CSS-3: local column tracks, use l:grid and data-grid-columns for page columns' \
	'grid-template-columns:'
check 'CSS-3: media query, allowed only to change spans or for a structural change' \
	'@media'

search_or_exit 'l:grid'
[ -z "$search_results" ] && print_and_mark_found 'CSS-3: no l:grid anywhere in this folder' "$dir"

check 'CSS-4: physical sizing, use inline-size and block-size' \
	'(^|[^-a-z])(width|height): '
check 'CSS-4: literal border width, use --border-w-*' \
	'border[a-z-]*: *[0-9.]+px'
check 'CSS-4: literal font size, use --text-*' \
	'font-size: *(clamp|[0-9.])'

search_or_exit '#[0-9a-fA-F]{3,8}\b'
print_and_mark_found 'CSS-4: hardcoded colour, use a token' \
	"$(printf '%s' "$search_results" | grep -vE 'href=|url\(#|id=')"

check 'CSS-4: older scale, use --text-* and --gap-*' \
	'var\(--(fs|space)-|u:fs-'

if [ "$found" -eq 0 ]; then
	echo "No findings in $dir"
	exit 0
fi
exit 1
