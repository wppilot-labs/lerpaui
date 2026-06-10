# README media assets

Capture checklist for the visuals referenced (commented out) in the root `README.md`. Keep each file under ~5 MB so the README stays fast.

| File | What to capture | How |
| --- | --- | --- |
| `gallery.png` | The component gallery grid at https://lerpaui.com/gallery/components, dark theme, ~1600px wide | Full-window screenshot, crop the browser chrome |
| `cli-add.gif` | `npx lerpa-cli init` then `npx lerpa-cli add magnetic-button` in a fresh Next.js app | Terminal recording — [vhs](https://github.com/charmbracelet/vhs) or [asciinema](https://asciinema.org) + gif export, ≤ 15 s |
| `components.gif` | 3–4 animated components in the gallery (aurora-shader, magnetic-button, spotlight-card) | Screen recording → gif, ≤ 10 s, ~900px wide |

After adding the files, uncomment the image block near the top of the root `README.md`.
