# Damco L2 — Application & Product Engineering

A responsive, dependency-free inner (L2) page built on the same design language as
the Damco homepage, but with more crafted, editorial section treatments and fewer
boxes per the brief.

## Design system (shared with homepage)
- Fonts: Source Serif Pro (headings, via "Source Serif 4") + Inter (body)
- Colors: text #120b09 / #262625, accent #d03326, warm paper background
- Layout: 1320px container, 12-column grid where useful, big italic-accent headings

## Section treatments (deliberately varied, low-box)
- Hero: two-column split with a layered app/product illustration; stats as a divided
  row with hairline separators (not cards), animated count-ups
- The mindset: sticky editorial heading + two-column body text
- Challenges we solve: numbered editorial list with hairline separators and hover shift
- Partner vs vendor: split comparison with cross/check marks and a center rule
- Offerings: directory-style index (icon, title, description, arrow) with hairlines
- Approach: vertical timeline with a progress rail that draws on scroll and nodes
  that fill as you reach them
- Benefits: airy 3-column icon grid separated by rules, not filled boxes
- Case studies: alternating oversized-metric rows with narrative and case links
- Why Damco: dark editorial numbered grid
- Tech stack: category rows with flowing pills, plus a tech-name marquee
- Insights: three image cards (the one intentionally card-based section)
- FAQs: sticky heading + animated single-open accordion (9 questions)
- Contact: dark block with a discovery-session lead form

## Animation
Preloader counter, split-text heading reveals, scroll reveals, count-ups, a
scroll-driven timeline progress rail, magnetic buttons, hover micro-interactions,
and a custom cursor. All respect prefers-reduced-motion.

## Files
- index.html
- css/styles.css
- js/main.js  (vanilla, no libraries)
- assets/img/ (SVG logos, line icons, illustrations)

## Notes
- Fonts load from Google Fonts (may be blocked in a sandbox; fine when online).
- "Learn more", case study, and insight links point to the real damcogroup.com URLs
  from the source document.
- Contact form is front-end only (validation + confirmation); wire to your backend.
- House style respected: no em dashes; challenge subheads are problem statements;
  no invented quotes; products AI-enabled, engineering practice AI-native.
