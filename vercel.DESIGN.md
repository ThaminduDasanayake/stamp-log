---
name: Vercel
colors:
  secondary: "#171717"
  surface: "#000000"
  on-surface: "#FFFFFF"
  error: "#EE0000"
typography:
  body-md:
    fontFamily: GeistSans
    fontSize: 20px
    fontWeight: 500
rounded:
  md: 6px
---

# Design System Inspired by Vercel

## 1. Visual Theme & Atmosphere

Vercel's design system embodies a modern, minimalist aesthetic built for developers and enterprise teams. The visual language prioritizes clarity and precision through generous whitespace, sharp geometric forms, and a carefully balanced contrast between bold accents and neutral foundations. The design conveys confidence through reduced ornamentation, relying instead on purposeful color shifts, subtle elevation changes, and clean typography. The atmosphere is forward-thinking yet accessible—aspiring to feel both cutting-edge and approachable, whether displayed on a landing page or embedded within developer tooling. Dark text on light backgrounds creates legibility at scale, while selective use of vibrant accent colors (purple, blue, pink) signals interactivity and focus areas without overwhelming the interface.

**Key Characteristics**

- Minimalist, content-first layout prioritizing whitespace and breathing room
- Stark contrast between near-black text (`#171717`) and near-white backgrounds (`#FAFAFA`, `#FFFFFF`)
- Accent colors used sparingly for interactive elements and highlights
- Clean, modern sans-serif typography (GeistSans for prose, Geist Mono for code)
- Geometric, geometric button treatments including fully rounded pill-style variants
- Subtle shadows and soft borders for depth without visual noise
- Monochromatic neutral palette with strategic color moments

## 2. Color Palette & Roles

### Primary

- **Dark Text** (`#171717`): Primary text color used across headings, body copy, and UI labels. The most frequent color in the system.
- **Near-White Background** (`#FAFAFA`): Soft background color that reduces eye strain while maintaining contrast with text.
- **Pure White** (`#FFFFFF`): Container and card backgrounds for maximum contrast and clean separation.

### Accent Colors

- **Vercel Purple** (`#7928CA`): Brand primary accent for key interactive moments and highlights.
- **Deep Blue** (`#0070F3`): Secondary accent for links, focus states, and important CTAs.
- **Hot Pink** (`#EB367F`): Tertiary accent for emphasis, alerts, and brand moments.
- **Teal** (`#50E3C2`): Complementary accent for success states and supporting highlights.
- **Orange Brand** (`#BD5200`): Warm accent tone for secondary actions and brand differentiation.

### Interactive

- **Link Blue** (`#0070F3`): Standard link color and focus ring indicator (`rgb(0, 114, 245)`).
- **Button Primary Background** (`#171717`): Dark button fill for primary CTAs.
- **Ghost Text** (`#4D4D4D`): Secondary text on interactive elements.

### Neutral Scale

- **Pure Black** (`#000000`): Used sparingly for highest contrast text and strong emphasis.
- **Dark Gray** (`#4D4D4D`): Secondary text, icons, and muted labels.
- **Light Gray** (`#EBEBEB`): Subtle borders and dividers.
- **Medium Gray** (`#8F8F8F`): Disabled states and tertiary text.
- **Edge Gray** (`#EDEDED`): Refined dividers and subtle surface separation.

### Surface & Borders

- **Border Default** (`#EBEBEB`): Standard 1px border for cards, inputs, and separators.
- **Border Light** (`#EDEDED`): Lighter variant for subtle delineation.
- **Card Background** (`#FFFFFF`): Primary surface for cards and modals.
- **Secondary Surface** (`#FAFAFA`): Alternative background for layered or grouped content.

### Semantic / Status

- **Warning** (`#FF9900`, `#F59E0B`, `#F5A623`): Alert and cautionary states.
- **Error/Danger** (`#EE0000`): Error messages and destructive action warnings.
- **Success** (`#50E3C2`): Confirmation and positive feedback states.

## 3. Typography Rules

### Font Family

**Primary:** GeistSans (fallback: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif`)
**Monospace:** Geist Mono (fallback: `'Monaco', 'Courier New', monospace`)

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Extra-Large | GeistSans | `72px` | `450` | `83.52px` | `0px` | Hero headlines, primary landing page titles |
| Display Large | GeistSans | `64px` | `450` | `64px` | `0px` | Major section headers, page titles |
| Display Medium | GeistSans | `56px` | `450` | `56px` | `0px` | Feature section headers |
| Display Small | GeistSans | `48px` | `450` | `56px` | `0px` | Subsection headers |
| Heading Small | GeistSans | `32px` | `450` | `40px` | `0px` | Card titles, compact headers |
| Body Large | GeistSans | `20px` | `500` | `26px` | `0px` | Feature descriptions, prominent body text |
| Body Default | GeistSans | `20px` | `400` | `36px` | `0px` | Standard paragraph text |
| Body Medium | GeistSans | `16px` | `400` | `24px` | `0px` | Navigation, links, inline text |
| Label | GeistSans | `14px` | `500` | `20px` | `0px` | Form labels, button text, captions |
| Label Small | GeistSans | `14px` | `400` | `20px` | `0px` | Helper text, secondary captions |
| Code Default | Geist Mono | `16px` | `400` | `24px` | `0px` | Inline and block code snippets |
| Code Small | Geist Mono | `13px` | `400` | `20px` | `0px` | Token references, compact code |

### Principles

- **Hierarchy through weight and scale:** Use `weight 450–500` for headings to create visual emphasis without increasing size excessively.
- **Generous line-height:** Line heights exceed font size (e.g., `20px` text on `26px` height) to improve readability and breathing room.
- **Monospace for code:** Reserve Geist Mono for code blocks, technical references, and command lines—never for body text.
- **Neutral gray for secondary text:** Use `#4D4D4D` or `#8F8F8F` for supporting text rather than pure black dilution.
- **Consistent baseline alignment:** All interactive text and labels maintain `line-height: 20px` or aligned multiples thereof.

## 4. Component Stylings

### Buttons

**Primary Button**
- **Background:** `#171717`
- **Text Color:** `#FFFFFF`
- **Font Size:** `14px`
- **Font Weight:** `500`
- **Font Family:** `GeistSans`
- **Padding:** `12px 24px`
- **Border Radius:** `4px` or `999px` (pill variant)
- **Border:** `1px solid #EBEBEB`
- **Box Shadow:** `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 8px 0px`
- **Height:** `40px`
- **Line Height:** `20px`
- **Hover State:** Opacity `0.80` on background, shadow intensifies
- **Disabled State:** Opacity `0.50` on background, `#8F8F8F` text, no shadow

**Secondary Button**
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `#171717`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Font Family:** `GeistSans`
- **Padding:** `12px 24px`
- **Border Radius:** `4px`
- **Border:** `1px solid #EBEBEB`
- **Box Shadow:** none
- **Height:** `40px`
- **Line Height:** `20px`
- **Hover State:** Background `#FAFAFA`, border `#4D4D4D`
- **Disabled State:** Text `#8F8F8F`, border `#EDEDED`

**Ghost Button**
- **Background:** `rgba(0, 0, 0, 0)`
- **Text Color:** `#4D4D4D`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Font Family:** `GeistSans`
- **Padding:** `8px 12px`
- **Border Radius:** `0px`
- **Border:** `0px none`
- **Box Shadow:** none
- **Height:** `32px`
- **Line Height:** `20px`
- **Hover State:** Text `#171717`, subtle background tint to `#FAFAFA`
- **Disabled State:** Text `#8F8F8F`

### Cards & Containers

**Card (Elevated)**
- **Background:** `#FFFFFF`
- **Text Color:** `#171717`
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Font Family:** `GeistSans`
- **Padding:** `24px 32px` (or `0px` for image-based cards)
- **Border Radius:** `6px`
- **Border:** `1px solid #EBEBEB`
- **Box Shadow:** `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 8px 0px, rgb(250, 250, 250) 0px 0px 0px 1px, rgb(255, 255, 255) 0px 0px 0px 1px`
- **Line Height:** `24px`
- **Hover State:** Shadow intensifies, subtle scale `1.02x`

**Card (Flat)**
- **Background:** `rgba(0, 0, 0, 0)` or `#FAFAFA`
- **Text Color:** `#171717`
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Padding:** `20px 24px`
- **Border Radius:** `0px` or `4px`
- **Border:** `0px none` or `1px solid #EBEBEB`
- **Box Shadow:** none
- **Line Height:** `24px`

**Pricing Card**
- **Background:** `#FFFFFF`
- **Border:** `1px solid #EBEBEB`
- **Padding:** `40px 32px`
- **Border Radius:** `6px`
- **Box Shadow:** `rgba(0, 0, 0, 0.04) 0px 2px 2px 0px`
- **Title Font Size:** `20px` weight `500`
- **Price Font Size:** `56px` weight `450`

### Inputs & Forms

**Text Input**
- **Background:** `#FFFFFF`
- **Text Color:** `#171717`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Font Family:** `GeistSans`
- **Padding:** `0px 12px`
- **Border Radius:** `0px` or `4px`
- **Border:** `1px solid #EBEBEB`
- **Box Shadow:** none
- **Height:** `36px`
- **Line Height:** `20px`
- **Placeholder Color:** `#8F8F8F`
- **Focus State:** Border `#0070F3`, box-shadow `rgb(255, 255, 255) 0px 0px 0px 2px, rgb(0, 114, 245) 0px 0px 0px 4px`
- **Disabled State:** Background `#FAFAFA`, border `#EDEDED`, text `#8F8F8F`

**Form Label**
- **Font Size:** `14px`
- **Font Weight:** `500`
- **Color:** `#171717`
- **Margin Bottom:** `8px`

**Helper Text**
- **Font Size:** `12px`
- **Font Weight:** `400`
- **Color:** `#8F8F8F`
- **Margin Top:** `4px`

### Navigation

**Top Navigation Bar**
- **Background:** `rgba(0, 0, 0, 0)` or `#FFFFFF`
- **Text Color:** `#171717`
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Height:** `64px`
- **Padding:** `0px 40px`
- **Border:** `0px solid #EBEBEB` or `1px solid #EBEBEB` on scroll
- **Box Shadow:** none
- **Line Height:** `24px`

**Navigation Link**
- **Color:** `#171717`
- **Font Size:** `14px` or `16px` depending on context
- **Font Weight:** `400`
- **Hover State:** Color `#0070F3`, subtle underline or background highlight
- **Active State:** Color `#0070F3`, font-weight `500`

**Mobile Hamburger Menu Button**
- **Background:** `rgba(0, 0, 0, 0)`
- **Icon Color:** `#171717`
- **Size:** `24px × 24px`
- **Padding:** `8px`
- **Hover State:** Background `#FAFAFA`

### Badges & Tags

**Default Badge**
- **Background:** `#FAFAFA`
- **Text Color:** `#171717`
- **Font Size:** `12px`
- **Font Weight:** `500`
- **Padding:** `4px 8px`
- **Border Radius:** `999px`
- **Border:** `1px solid #EBEBEB`

**Featured/Popular Badge**
- **Background:** `#7928CA` or `#0070F3`
- **Text Color:** `#FFFFFF`
- **Font Size:** `12px`
- **Font Weight:** `600`
- **Padding:** `6px 12px`
- **Border Radius:** `999px`

**Status Badge (Success)**
- **Background:** `rgba(80, 227, 194, 0.1)`
- **Text Color:** `#50E3C2`
- **Font Size:** `12px`
- **Font Weight:** `500`
- **Padding:** `4px 8px`
- **Border Radius:** `999px`

**Status Badge (Warning)**
- **Background:** `rgba(255, 153, 0, 0.1)`
- **Text Color:** `#FF9900`
- **Font Size:** `12px`
- **Font Weight:** `500`
- **Padding:** `4px 8px`
- **Border Radius:** `999px`

**Status Badge (Error)**
- **Background:** `rgba(238, 0, 0, 0.1)`
- **Text Color:** `#EE0000`
- **Font Size:** `12px`
- **Font Weight:** `500`
- **Padding:** `4px 8px`
- **Border Radius:** `999px`

### Links

**Text Link**
- **Color:** `#0070F3`
- **Font Size:** `16px`
- **Font Weight:** `400`
- **Font Family:** `GeistSans`
- **Padding:** `0px 4px`
- **Text Decoration:** none
- **Hover State:** Text decoration underline, color opacity `0.80`
- **Focus State:** Box-shadow `rgb(255, 255, 255) 0px 0px 0px 2px, rgb(0, 114, 245) 0px 0px 0px 4px`

**Inline Link**
- **Color:** `#0070F3`
- **Underline:** underline
- **Hover State:** Opacity `0.80`, underline thickens slightly

## 5. Layout Principles

### Spacing System

**Base Unit:** `4px`

**Scale:**
- `4px` - Micro spacing (button icon gaps, tight padding)
- `8px` - Minimal spacing (form padding, compact margins)
- `12px` - Small spacing (button padding, input side padding)
- `16px` - Base spacing (gap between adjacent elements, standard padding)
- `20px` - Medium spacing (section padding, consistent gaps)
- `24px` - Comfortable spacing (card padding, column gaps)
- `32px` - Large spacing (section margin between distinct areas)
- `40px` - Extra-large spacing (content padding on larger containers)
- `48px` - Generous section spacing (major layout breaks)
- `72px` - Major spacing (full-width section separation)
- `96px` - Extra-major spacing (between major page sections)
- `120px` - Hero-scale spacing (landing page section breaks)

### Grid & Container

- **Max Width:** `1280px` to `1440px` for main content containers
- **Horizontal Padding:** `40px` on desktop (scales to `24px` on tablet, `16px` on mobile)
- **Column Strategy:** 12-column flexible grid; sections often use 2–3 column layouts
- **Section Patterns:** Full-width sections with center-aligned content containers; alternating left/right image-text pairs common on landing pages

### Whitespace Philosophy

Vercel prioritizes aggressive whitespace to create visual breathing room and reduce cognitive load. Sections are generously separated with `48px–120px` vertical gaps. Interior padding within cards and containers balances text size—larger headings receive more surrounding space. Horizontal margins are symmetrical, creating a calm, centered aesthetic. Empty space is treated as an active design element, never filled arbitrarily.

### Border Radius Scale

- `0px` - Sharp edges for structured components (inputs, some buttons, table cells)
- `4px` - Light rounding for buttons, small interactive elements, and subtle borders
- `6px` - Standard rounding for cards, modals, and elevated surfaces
- `999px` - Fully rounded for pill buttons, badge chips, and avatar containers

### Border Widths

- **Thin (`1px`):** Default dividers, card borders, input borders, subtle separators
- **Medium (`2px`):** Focus ring inner border, thick dividers on emphasized sections
- **Thick (`4px`):** Focus ring outer border (accent color), strong emphasis lines

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | No shadow | Text links, ghost buttons, flat cards without elevation |
| Subtle | `rgba(0, 0, 0, 0.02) 0px 1px 1px 0px` | Hover states on buttons, very light card lifts |
| Small | `rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.04) 0px 4px 8px 0px` | Elevated cards, dropdown menus |
| Medium | `rgba(0, 0, 0, 0.04) 0px 2px 2px 0px` | Pricing cards, featured panels |
| Large | `rgba(0, 0, 0, 0.04) 0px 8px 16px -4px` | Modals, popovers, elevated navigation |

**Shadow Philosophy:** Vercel uses soft, dispersed shadows that avoid harsh black drop-shadows. Shadows primarily serve to separate layered content and create subtle depth. The primary shadow strategy involves a combination of border separation and gentle blur to maintain a clean, modern aesthetic. Shadows are never solid black; they employ `rgba(0, 0, 0, 0.02–0.08)` depending on depth level.

### Opacity Levels

- `10%` (`0.10`) - Extremely subtle overlay or disabled state hint
- `42%` (`0.42`) - Muted or inactive state
- `50%` (`0.50`) - Disabled button background or heavily muted text
- `53%` (`0.53`) - Secondary text or hover state reduction
- `80%` (`0.80`) - Hover state intensity reduction, nearly opaque
- `90%` (`0.90`) - Minimal opacity reduction for subtle hover feedback

### Z-index / Layering

- **Base (`1`):** Default document layer for static content
- **Raised (`2`):** Slightly elevated elements (subtle cards, inactive layers)
- **Floating (`3`):** Floating buttons, secondary overlays
- **Sticky (`4`):** Sticky navigation, persistent headers
- **Dropdown (`5`):** Dropdown menus, autocomplete overlays
- **Modal (`6`):** Modal dialogs, primary overlays
- **Tooltip (`7`):** Tooltips, popovers above modals
- **Toast (`8`):** Toast notifications, highest-priority alerts

## 7. Do's and Don'ts

### Do

- **Use `#171717` for all primary text** — it's the system's core color and ensures consistency across headings and body copy.
- **Maintain generous whitespace** — Never crowd content; allow at least `32px–48px` between distinct sections.
- **Apply focus rings consistently** — Use `rgb(255, 255, 255) 0px 0px 0px 2px, rgb(0, 114, 245) 0px 0px 0px 4px` for keyboard navigation.
- **Use GeistSans exclusively for prose and UI** — Geist Mono is reserved for code contexts only.
- **Employ accent colors sparingly** — Reserve purple (`#7928CA`) and blue (`#0070F3`) for interactive elements and CTAs.
- **Keep button padding symmetric** — Primary buttons use `12px 24px`; avoid asymmetric padding unless intentional.
- **Use `#FFFFFF` cards over `#FAFAFA` surfaces** — The contrast establishes clear hierarchy and reduces visual noise.
- **Apply shadows subtly** — Use the small/medium shadow scales; avoid heavy, dark shadows.
- **Scale typography responsively** — Reduce display sizes on mobile (e.g., `72px` → `32px`).

### Don't

- **Never use pure `#000000` for body text** — Use `#171717` or `#4D4D4D` instead for readability and visual warmth.
- **Don't mix rounded and sharp edges arbitrarily** — Buttons should be either `4px` or `999px` (pill); cards are `6px`.
- **Avoid colored text on colored backgrounds** — Maintain minimum WCAG AA contrast ratios; test color combinations.
- **Don't use thick borders (`>2px`) casually** — Reserve thickness for focus rings and deliberate emphasis.
- **Never apply shadows to flat elements** — Flat buttons and ghost elements should have `box-shadow: none`.
- **Don't center-align body text** — Left-align paragraphs for readability; center only headlines and single-line labels.
- **Avoid nesting multiple elevation levels** — Limit shadow stacking to 2–3 layers to maintain clarity.
- **Don't use brand accent colors for disabled or secondary states** — Reserve them for enabled, interactive moments.
- **Avoid mixing font families** — GeistSans is the default; use Geist Mono only for code.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile | `0px–640px` | Single-column layout, `16px` horizontal padding, typography scales down by 20–30%, full-width buttons, collapsed navigation, `32px` section gaps |
| Tablet | `641px–1024px` | 2-column grid, `24px` horizontal padding, display sizes reduce by 10–15%, navigation compacts but remains visible, `48px` section gaps |
| Desktop | `1025px–1440px` | 3–4 column layouts, `40px` horizontal padding, full typography scale, expanded navigation, `72px–120px` section gaps |
| Large Desktop | `1441px+` | Fixed max-width containers (`1440px`), centered on page with flanking whitespace, full navigation bar, maximum spacing |

### Touch Targets

- **Minimum Interactive Size:** `44px × 44px` (WCAG AAA standard for buttons and links)
- **Button Minimum Height:** `40px` on mobile, `40px–44px` on touch devices
- **Spacing Between Touch Targets:** Minimum `8px` gap to prevent accidental activation
- **Icon Buttons:** `32px × 32px` with `8px–12px` internal padding
- **Form Inputs:** `36px–44px` height to accommodate thumb interaction

### Collapsing Strategy

- **Two-Column to Single-Column:** Stack pricing cards, feature panels, and image-text pairs vertically at `<768px`
- **Navigation Collapse:** Convert top navigation to hamburger menu at `<640px`; show 3–4 nav items on tablet, full menu on desktop
- **Typography Collapse:** H1 sizes drop from `72px` (desktop) → `48px` (tablet) → `32px` (mobile)
- **Spacing Collapse:** Horizontal padding reduces from `40px` → `24px` → `16px` as viewport narrows
- **Grid Collapse:** Move from 3-column to 2-column at tablet, to 1-column on mobile
- **Button Width:** Buttons expand to full-width on mobile (`width: 100%`); desktop buttons retain fixed widths or use flexbox gaps

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Dark Text & Button (`#171717`), white text overlay
- **Secondary CTA:** Deep Blue (`#0070F3`)
- **Accent Highlights:** Vercel Purple (`#7928CA`) or Hot Pink (`#EB367F`)
- **Background:** Near-White (`#FAFAFA`) or Pure White (`#FFFFFF`)
- **Heading Text:** Dark Text (`#171717`)
- **Body Text:** Dark Text (`#171717`), secondary `#4D4D4D`
- **Border:** Light Gray (`#EBEBEB`)
- **Disabled State:** Medium Gray (`#8F8F8F`)
- **Success State:** Teal (`#50E3C2`)
- **Error State:** Red (`#EE0000`)
- **Warning State:** Orange (`#FF9900`)

### Iteration Guide

1. **Text color hierarchy:** Always default to `#171717`; use `#4D4D4D` for secondary or muted text; never dilute with opacity—use the actual gray from the palette.

2. **Button variants:** Primary buttons are `#171717` with white text and `4px` radius; secondary buttons are transparent with `#171717` text and `#EBEBEB` border; ghost buttons have no border and use `#4D4D4D` text.

3. **Card elevation:** Use the small shadow (`rgba(0, 0, 0, 0.08) 0px 0px 0px 1px, rgba(0, 0, 0, 0.02) 0px 1px 1px 0px, rgba(0, 0, 0, 0.04) 0px 4px 8px 0px`) for all elevated cards; flat cards have no shadow.

4. **Spacing layers:** Apply `32px` for internal padding in cards, `48px` for section margins, and `72px–120px` for major layout breaks; never use arbitrary spacing.

5. **Focus states:** All interactive elements receive a dual-ring focus indicator: inner white ring `2px`, outer accent ring (`#0070F3`) `4px`.

6. **Typography:** Use GeistSans weight `500` for headings, weight `400` for body; Geist Mono only for code blocks; maintain line-height > font-size for all text.

7. **Input styling:** Text inputs are `36px` height, `#FAFAFA` placeholder text on white background, `#EBEBEB` border, with focus state applying the standard focus ring.

8. **Responsive collapse:** At `<768px`, switch from multi-column to single-column; reduce typography by one size tier; expand buttons to full-width; collapse navigation into hamburger menu.

9. **Accent color deployment:** Reserve `#7928CA`, `#0070F3`, and `#EB367F` for interactive states and call-to-action elements only; never use on passive content unless explicitly highlighting.