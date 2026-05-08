# Design System Specification: The Academic Atelier

## 1. Overview & Creative North Star

### Creative North Star: "The Academic Atelier"
This design system moves away from the sterile, rigid grids of traditional EdTech. Instead, it adopts the philosophy of a high-end digital atelier—a space that is curated, intentional, and inspiring. We achieve this through **"Structured Fluidity"**: combining the precision of modern sans-serif typography with organic, floating elements and a sophisticated layering system.

To break the "template" look, designers must embrace intentional asymmetry. Use large-scale typography as a structural anchor, allowing the cartoon illustrations and floating cards to overlap and breathe. This design system is not a cage; it is a canvas where depth is defined by light and tone, not by lines.

---

## 2. Colors & Visual Soul

The color palette is designed to balance the authoritative energy of **Primary Purple** with the friendly, optimistic spark of **Secondary Orange**, all resting on a clean, expansive neutral base.

### The "No-Line" Rule
**Explicit Instruction:** Traditional 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined solely through background color shifts. To separate a feature section from the hero, transition from `surface` (#f5f7f9) to `surface-container-low` (#eef1f3). If a container needs to stand out, use `surface-container-lowest` (#ffffff) to create a natural, "paper-on-table" lift.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. 
1.  **Base Layer:** `surface` or `background`.
2.  **Sectional Layer:** `surface-container-low` for large content blocks.
3.  **Interaction Layer:** `surface-container-lowest` (pure white) for high-priority cards and inputs.
4.  **Information Layer:** `surface-container-high` for subtle UI elements like search bars or inactive tabs.

### The "Glass & Gradient" Rule
To elevate the experience beyond standard flat UI:
*   **Floating Elements:** Use Glassmorphism for overlays and navigation bars. Apply a `surface` color at 70% opacity with a `backdrop-blur` of 12px–20px.
*   **Signature Textures:** Main CTAs and Hero accents should utilize a subtle linear gradient (Top-Left to Bottom-Right) transitioning from `primary` (#702ae1) to `primary_container` (#b28cff). This adds a "jewel-toned" depth that flat hex codes lack.

---

## 3. Typography

The typography scale is built on a high-contrast relationship between **Plus Jakarta Sans** (Character/Expression) and **Inter** (Utility/Clarity).

*   **Display & Headline (Plus Jakarta Sans):** Used for big ideas and brand moments. The geometric yet friendly curves of Jakarta reflect the "approachable professional" persona. 
    *   *Usage:* `display-lg` (3.5rem) should be used with tight letter-spacing (-0.02em) to feel editorial.
*   **Title & Body (Inter):** The workhorse. Inter provides unmatched legibility for educational content. 
    *   *Usage:* `body-lg` (1rem) for lesson descriptions; `title-md` (1.125rem) for card headers.
*   **Label (Inter):** Use `label-sm` (0.6875rem) in all-caps with increased letter-spacing (+0.05em) for category tags or metadata.

---

## 4. Elevation & Depth

We convey hierarchy through **Tonal Layering** rather than structural geometry.

*   **The Layering Principle:** Avoid shadows for static content. Place a `surface-container-lowest` card on a `surface-container-low` background. This "soft lift" feels premium and modern.
*   **Ambient Shadows:** For "floating" elements (e.g., Modals, Primary Action Buttons), use a "shadow-xl" equivalent: 
    *   *Specs:* `X: 0, Y: 20, Blur: 40, Spread: -10`. 
    *   *Color:* Use the `on_surface` color at 6% opacity. Never use pure black or dark grey shadows; they feel "muddy."
*   **The "Ghost Border" Fallback:** If accessibility requirements demand a container boundary, use the `outline_variant` (#abadaf) at **15% opacity**. This creates a "breath" of a border rather than a hard line.
*   **Roundedness:** All primary containers and buttons must use `xl` (1.5rem / rounded-2xl) to maintain the "friendly" brand promise. Smaller elements (chips, inputs) use `md` (0.75rem).

---

## 5. Components

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. White text (`on_primary`). Shadow-xl on hover to simulate "lifting" toward the user.
*   **Secondary:** Ghost-style. No fill, `outline` at 20% opacity. Text in `primary`.
*   **Tertiary:** No border or fill. `primary` text with a `label-md` weight.

### Input Fields
*   **Style:** `surface-container-lowest` background. No border. 
*   **States:** On focus, add a 2px "Ghost Border" using the `primary` color at 40% opacity. Forbid the use of heavy 100% opaque focus rings.

### Cards & Lists
*   **Rule:** Forbid divider lines. Use vertical white space (32px or 48px) to separate items. 
*   **EdTech Specifics:** Incorporate the cartoon student style from the brand assets. Illustrations should "break the box"—part of the illustration (like the student's head or a floating book) should overlap the edge of the card to create 3D depth.

### Course Progress Chips
*   Use `secondary_container` (#ffc5a8) with `on_secondary_container` (#793200) text for high-visibility "In Progress" states. Use the `full` (9999px) corner radius for all chips.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical layouts where text sits on one side and an illustration "floats" off the grid on the other.
*   **Do** use `surface-bright` for the main background to keep the "Sleek" in Sleek Academia.
*   **Do** allow illustrations to overlap multiple color sections to tie the page together.

### Don't
*   **Don't** use 1px solid black or grey borders. They break the "Atelier" feel and make the design look like a generic dashboard.
*   **Don't** stack more than three levels of surface depth (Background > Section > Card). Any more will cause visual clutter.
*   **Don't** use the `secondary` orange for large background blocks. It is a "spice" color, meant for CTAs, notifications, and highlights only.
*   **Don't** use tight spacing. When in doubt, add 16px of extra white space. This system lives on its "breathing room."