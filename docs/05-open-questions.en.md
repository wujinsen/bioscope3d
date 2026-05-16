# 05 · Open Questions (all resolved)

> 🌐 **English** · [简体中文](./05-open-questions.md) · [日本語](./05-open-questions.ja.md)

> 2026-05-13 user answer: "Go with your defaults" → every recommended default was adopted.

---

## ✅ Q1 · Product name

**Decision**: **A · Cell Architecture Studio**

> 📝 **Update 2026-05-13**: naming the product after the reference image made it hard to tell "inspiration" from "deliverable". **Renamed to BioScope3D.** See `../AGENTS.md` § 8 for the full decision record.

---

## ✅ Q2 · MVP v1 scope

**Decision**: v1 = 13 P0 features + F46 keyboard shortcuts + F15 thumbnails + F23 reset camera + F28 Screenshot + F31/F32/F34 metadata
**Pushed into v2**: F16 PBR enhancement + F38 Compare Cells + 7 v1-translation P1 items (F54–F62 P1 segment)

---

## ✅ Q3 · Organelle isolation (F35)

**Decision**:
- v1 takes route **A**: accept the limitation — any cell-level hover shows generic info
- v2 upgrades to **C**: color clustering + geometric islands (1.5–2 days of dedicated work)

---

## ✅ Q4 · AI generation (F48)

**Decision**: v1/v2 are full mocks (click → fake 5 s loading → load a preset GLB)
Real API integration is deferred; ask for API keys then.

---

## ✅ Q5 · Missing GLBs for 5 cells

**Decision**:
- v1 uses **A**: plant + epithelial repeated to fill all 7 UI slots, only 2 actual 3D models
- v2 switches to **C**: source open replacements from NIH 3D Print Exchange / Cell Image Library

---

## ✅ Q6 · Video segment → cell mapping

**Decision**: **Use my inferred mapping**

| Seg | Range | Inferred |
|---|---|---|
| 1 | 0.0–4.5 s | **Plant Cell** |
| 2 | 4.5–10.0 s | **Animal / Epithelial Cell** |
| 3 | 10.0–14.5 s | **Bacteria Cell** (distant framing) |
| 4 | 14.5–20.5 s | **Red Blood Cell** |
| 5 | 20.5–27.5 s | **Neuron** |
| 6 | 27.5–32.5 s | **White Blood Cell** |
| 7 | 32.5–39.5 s | **Muscle Cell** |

---

## ✅ Q7 · Theme & mood

**Decision**: **A · Exactly like the reference** — a notebook-style learning workshop, keeping the ✦ ❤ hand-drawn decorations.

---

## ✅ Q8 · Typography

**Decision**: **A · Caveat** (handwriting) + DM Serif Display (serif titles) + Inter (body) + JetBrains Mono (numerics)

---

## ✅ F54–F63 new features

**Decision**: **all included**
- P1 group (F54/55/56/57/58/60/62, 7 items) → MVP v2
- P2 group (F59/61/63, 3 items) → MVP v3

---

## ✅ F58 Taxonomy Breadcrumb depth

**Decision**: **3 levels** (Domain · Kingdom · Cell type)
Future-proofed to 8 levels (Domain · Kingdom · Phylum · Class · Order · Family · Genus · Species); levels we don't have render as "—".

---

# Next actions

1. ✅ Decisions filed (this document)
2. ⏳ Rewrite `docs/03-features.md` with F54–F63 (done)
3. ⏳ Rewrite `docs/04-mvp-roadmap.md` re-ordered (done)
4. ⏭ **Next: ship the v2 design** in `design/v2/index.html`
   - Swap palette to olive + soft lilac
   - Top bar: 4 tabs; left bar with thumbnails; right bar = ORGANELLE DETAILS / BIOLOGICAL NOTES / WHERE IT OCCURS
   - Central 3D viewport keeps v1's warm stage + vignette
   - F54 Specimen HUD (4 corners, toggleable)
   - F57 Pipeline Status pulse dot
   - F58 3-level Taxonomy Breadcrumb
   - F60 Tour Progress Bar (no standalone status bar; attach to top or central)
   - F62 Field Notes card
   - F63 Onboarding Post-it prompts on first open
5. ⏭ Browser review
6. ⏭ Enter MVP v1 coding (Vite + R3F)
