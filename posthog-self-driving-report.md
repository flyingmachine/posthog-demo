# PostHog Self-driving Setup Report

## Summary

PostHog Self-driving was configured for the posthog-demo Astro Starlight documentation site. Session Replay, Error Tracking, and Support were enabled server-side; six native signal sources were wired up; GitHub was connected and GitHub Issues synced to the data warehouse; the scout troop was tuned to four scouts; and two Replay Vision scanners were created to watch doc pages for breakage and user frustration. Findings will start appearing in the [Self-driving inbox](https://us.posthog.com/project/553726/inbox) within ~30 minutes.

---

## AI data processing

Approved at the organization level (enforced by the wizard before this run began).

---

## GitHub

Connected during this run: **flyingmachine** (integration id 250209, created 2026-08-26).

---

## Products enabled

| Product | Result | Notes |
|---|---|---|
| Session Replay | enabled | Server-side flip applied. No `posthog-js` init in this repo; flip takes effect once the SDK is added. |
| Error Tracking | enabled | Server-side flip applied. No `posthog-js` init in this repo; flip takes effect once the SDK is added. |
| Support (Conversations) | enabled | Tickets only arrive once an inbound channel is connected — see Follow-ups. |

No `posthog.init` override check was needed — the PostHog SDK is not installed in this repo. The server flips are live and waiting.

---

## Signal sources

| source_product | source_type | Action |
|---|---|---|
| `health_checks` | `health_issue` | enabled |
| `error_tracking` | `issue_created` | enabled |
| `error_tracking` | `issue_reopened` | enabled |
| `error_tracking` | `issue_spiking` | enabled |
| `session_replay` | `session_analysis_cluster` | enabled (sample_rate: 0.1, server default) |
| `conversations` | `ticket` | enabled (dormant until inbound channel connected) |
| `signals_scout` | `cross_source_issue` | on by default — no config row needed |
| `replay_vision` | — | self-authorizing via scanner `emits_signals` flag — no source row |
| `llm_analytics` | — | skipped — not a v1 responder |
| `logs` | — | skipped — not a v1 responder |

---

## Connected tools

| Tool | Status |
|---|---|
| GitHub Issues | Connected by this run. Source id: `01a03ba7-7b29-0000-da15-a272f28f0546`. First sync started automatically. Only the `issues` table is syncing; more tables can be enabled in the PostHog data warehouse UI. |
| Linear | not used |
| Jira | not used |
| Sentry | not used |
| Zendesk | not used |

---

## Scout troop

Run budget: **100 runs/day** (0 used today). Early access; contact team-self-driving@posthog.com to request more. Banner: "Scouts are in early access. Each project gets up to 100 scout runs a day."

**Enabled (4)**

| Scout | What it watches |
|---|---|
| `signals-scout-general` | Cross-product correlations and surfaces the specialists don't cover |
| `signals-scout-web-analytics` | Per-channel session volume, attribution breakage, and landing-page health |
| `signals-scout-web-vitals` | Core Web Vitals (LCP, INP, CLS, FCP) per page against Google thresholds and the site's own history |
| `signals-scout-health-checks` | Active PostHog health issues worth acting on |

**Disabled (23)** — all others were already disabled at sync time; the selection reflects what this project actively uses. Re-enable any from the inbox settings if a surface becomes relevant.

Notable disabled scouts and why:
- `signals-scout-error-tracking` — covered by the native `error_tracking` signal source (step 4)
- `signals-scout-session-replay` — covered by the native `session_replay` signal source (step 4)
- `signals-scout-feature-flags` — no feature flags in use on this project
- `signals-scout-surveys` — no surveys in use
- `signals-scout-ai-observability` — no LLM/AI instrumentation
- `signals-scout-revenue-analytics` — no payment SDK
- `signals-scout-experiments` — no active experiments
- All others — surfaces not in active use; enable individually if that changes

---

## Custom scouts

**None warranted at this stage.**

Gap analysis considered and ruled out:

| Surface | Filter that ruled it out |
|---|---|
| Documentation engagement funnel (pageviews, scroll depth, search queries) | Not watchable — no PostHog events exist (SDK not installed in this repo) |
| GitHub Issues aggregate patterns | Very low volume for a demo site; individual issues already surface via the `github/issue` responder |
| SDK installation health | Covered by the enabled `signals-scout-health-checks` built-in |

If you add the PostHog SDK and start capturing events, run this setup again to pick up engagement-funnel and content-quality scouts.

Noise escape hatch: if any scout becomes noisy, set `emit: false` on its config in PostHog to switch it to dry-run (it still runs and logs but writes nothing to the inbox).

---

## Replay Vision scanners

Replay Vision scanners are LLM agents that watch individual session recordings on a schedule and push what they find directly to the Self-driving inbox. Findings arrive at half weight, so they need corroboration (a second independent observation of the same defect) before they are promoted into an inbox report. The scanners are the only part of this setup that spends Replay Vision quota.

The project has no recordings yet. Both scanners are armed and start working the day recordings begin — no second setup needed.

| Scanner | Type | What it watches | Query scope | Sampling rate | Est. monthly credits |
|---|---|---|---|---|---|
| PostHog demo docs broken pages | monitor | Visible breakage on docs guide pages: failed page renders, 404s, broken code examples, layout collapses, search errors | URL contains `/guide/` | 0.5 | 0 (no recordings yet) |
| PostHog demo docs frustration | monitor | Rage-click sessions where users get stuck: unresponsive nav links, broken copy buttons, fruitless search retries | `$rageclick` events (all URLs) | 1.0 | 0 (no recordings yet) |

The two monitors cover disjoint axes: the breakage monitor owns *where* (URL), the frustration monitor owns *what they did* (`$rageclick`), as required by the Replay Vision disjointness rule.

---

## Follow-ups

- [ ] **Install the PostHog SDK** — `posthog-js` is not in this repo. Session Replay, Error Tracking, and web analytics data won't flow until the SDK is added. See the [posthog-js docs](https://posthog.com/docs/libraries/js) or run the PostHog integration wizard.
- [ ] **Connect a Support inbound channel** — Conversations is enabled, but tickets only arrive once an email, inbox, or Slack channel is connected. Configure it in [PostHog Settings](https://us.posthog.com/project/553726/settings/environment-integrations).
- [ ] **Grant GitHub App access (if adding more repos)** — the GitHub App was installed for `flyingmachine/posthog-demo` only. To connect additional repos, re-run the GitHub App install flow and grant the extra repos.
- [ ] **Enable more GitHub Issues tables** — the warehouse source syncs only the `issues` table. To sync pull requests, releases, or other tables, edit the source in [PostHog Data Warehouse](https://us.posthog.com/project/553726/data-management/sources).
- [ ] **Re-run custom scout design after SDK is added** — once events are flowing, the gap analysis will find watchable surfaces (engagement funnels, content performance) that don't exist yet.

---

## What happens next

The scout coordinator picks up the fresh configs within ~30 minutes and begins running the enabled scouts on their daily schedule. Each run draws from the 100-run daily budget. Findings cluster into reports in the [Self-driving inbox](https://us.posthog.com/project/553726/inbox); immediately actionable ones can automatically start coding tasks. The Replay Vision scanners begin scanning the moment recordings arrive.
