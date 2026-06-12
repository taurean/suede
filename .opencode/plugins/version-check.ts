// OpenCode Plugin: Version Check (no-op)
//
// Suede does not run `deciduous update` (see AGENTS.md "Do not run
// `deciduous update`" note). The upstream `deciduous` tool's
// `update` subcommand regenerates `.opencode/`, `.claude/`, and
// `AGENTS.md` from its own defaults, which would silently overwrite
// the hand-edited integration files in this repo. We treat version
// upgrades as opt-in: install a new `deciduous` binary if you want
// new features, then *manually* reconcile any new files you want to
// pull in — never via `deciduous update`.
//
// This plugin used to phone crates.io once per 24h and prompt the
// user to upgrade + run `deciduous update`. It was rewritten as a
// no-op for the reason above. The first time it runs, it appends a
// single line to `.deciduous/plugin.log` so the no-op is observable
// to anyone reading the log.

import type { Plugin } from "@opencode-ai/plugin"

export const VersionCheck: Plugin = async () => {
  return {
    "tool.execute.before": async () => {
      try {
        const fs = await import("fs")
        const path = await import("path")
        if (!fs.existsSync(".deciduous")) return
        const marker = path.join(".deciduous", ".version_check_disabled")
        if (fs.existsSync(marker)) return
        fs.writeFileSync(
          marker,
          `version-check plugin disabled at ${new Date().toISOString()}\n` +
            `See AGENTS.md: do not run \`deciduous update\`.\n`,
        )
        const logFile = path.join(".deciduous", "plugin.log")
        fs.appendFileSync(
          logFile,
          `[${new Date().toISOString()}] version-check plugin: no-op. Do not run \`deciduous update\` (see AGENTS.md).\n`,
        )
      } catch {
        // Never let the plugin break edits.
      }
    },
  }
}
