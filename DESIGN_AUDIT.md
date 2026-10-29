# Design Audit — Apple design lens

Audit of the current site (code + live `mayankmalik.vercel.app`, Oct 2026) against Apple's fluid-interface and HIG foundations. Severity: **High** = hurts first impression or usability, **Med** = noticeable polish gap, **Low** = craft detail.

## What already works (keep)

- **Work / Education panel.** One component, two tabs, one consistent row shape: logo, org, role, dates + computed duration, bullets, link badges. Predictable and scannable (Familiarity, Grouping). The redesign keeps this structure and gives it its own page.
- Semantic tokens for colour (`--background`, `--muted`…) with light/dark themes.
- Native `<details>` for the FAQ; zod-validated JSON data; JSON-LD.
- The swipe-photo stack is a genuinely playful, direct-manipulation moment.

## Findings

### Information architecture & wayfinding
| # | Sev | Finding | Principle |
|---|---|---|---|
| 1 | High | Home is one long scroll: hero → full career history (every bullet expanded) → projects → posts → FAQ. The best content (work history) becomes a wall of text and pushes everything else far down. | Simplicity ≠ putting everything in one place |
| 2 | High | Nav has no "you are here" state, and no About / Work pages. Visitors can't tell where they are or what exists. | Wayfinding |
| 3 | Med | Projects have no detail pages; cards are not clickable as a whole; all `image` fields are empty, so the grid is text-only. | Purpose, Craft |
| 4 | Med | Company `href` values are `""`, so the logo and name in each timeline row open the current page in a new tab. | Familiarity — things that look like links must behave like links |

### Typography
| # | Sev | Finding | Principle |
|---|---|---|---|
| 5 | Med | `.title` uses `tracking-wide` on large Calistoga display text. Large display type wants *negative* tracking; one tracking value for all sizes is wrong somewhere. | Size-specific tracking |
| 6 | Med | Tags and badges are `text-[10px]` (fixed px, below a legible minimum, ignores the user's text size). | rem sizing, legibility |
| 7 | Low | Hierarchy comes from size alone (lowercase serif heading + uniform `text-sm` body). Weight and leading aren't used as a set. | Hierarchy from weight + size + leading |

### Materials & depth
| # | Sev | Finding | Principle |
|---|---|---|---|
| 8 | Med | Sticky header is `bg-background/75 backdrop-blur-sm`: blur too weak, no saturation, so body text visibly bleeds through it. No scroll-edge effect. | Translucent chrome, vibrancy |
| 9 | Low | All cards are the same flat bordered surface; nothing signals hierarchy (hero vs. list item vs. chrome). | Material weight encodes hierarchy |

### Motion & interaction
| # | Sev | Finding | Principle |
|---|---|---|---|
| 10 | Med | Swipe cards dismiss on *offset* only (`> 100px`). A fast flick under 100px snaps back; a dismissed card vanishes instantly (removed from state) instead of flying off with release velocity. | Velocity handoff, momentum projection |
| 11 | Med | Swipe stack has no affordance hint and no keyboard alternative. | Wayfinding, Flexibility |
| 12 | Med | Buttons have hover colour only, with no press (`:active`) feedback. | Respond on pointer-down |
| 13 | Med | No `prefers-reduced-motion`, `prefers-reduced-transparency` or `prefers-contrast` handling anywhere. | Accessibility |
| 14 | Low | Tab switch (Work ↔ Education) hard-cuts; the active pill jumps rather than moving. | Spatial consistency |
| 15 | Low | Theme toggle renders `null` until mounted, so the header shifts on load. Light/dark only, with no "system" option. | Craft, Agency |

### Content craft
| # | Sev | Finding |
|---|---|---|
| 16 | Low | Age is hard-coded (`currentAge = 19`; `MAYANK_BIRTH_YEAR` is unused). |
| 17 | Low | Photos and logos show grey or letter placeholders on first paint (lazy + skeleton), so the hero opens empty. |
| 18 | Low | Footer has `pb-32` of dead space. |

## Direction for the redesign

1. **Multi-page app shell.** Home (short), Work, Projects (+ detail), Blog, About, Contact. Persistent nav with an active state; translucent chrome with real blur and saturation.
2. **Work page = the hero of the site.** Keep the tab + timeline structure. Collapse bullets behind a disclosure per role, so the whole history fits on one or two screens.
3. **Type system.** Display tracking around −0.02em with tight leading, body at 0 with relaxed leading, everything in rem, tags at least 0.75rem.
4. **Motion.** Springs (damping 1.0, response 0.35) for UI; velocity-aware swipe dismissal; sliding tab indicator; press feedback; full reduced-motion, transparency and contrast fallbacks.
