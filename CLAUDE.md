# CLAUDE.md

## Common Commands

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm start      # Start production server after build
```

## Core Files

### data/builds.json
```json
{
  "builds": [
    {
      "id": "string",
      "projectName": "string",
      "builderName": "string",
      "school": "string",
      "githubUrl": "string",
      "videoUrl": "string (YouTube or Loom URL)",
      "description": "string (max 250 chars)",
      "tags": ["string"],
      "difficulty": "beginner | intermediate | advanced",
      "submittedAt": "YYYY-MM-DD",
      "featured": "boolean"
    }
  ]
}
```

### components/BuildCard.tsx
Props:
- `projectName: string` - Project title
- `builderName: string` - Creator's name
- `school: string` - School/university
- `description: string` - Project description
- `tags: string[]` - Category tags (productivity, automation, creative, tool, data analysis, game)
- `githubUrl: string` - Link to source code
- `videoUrl: string` - YouTube or Loom demo URL
- `colorClass: string` - Background color (bg-warm-pink, bg-warm-green, etc.)

**Features:**
- Integrated VideoModal for in-page video playback
- Color-matched gradient overlays for long descriptions
- Tag colors adapt when they clash with card background

### components/VideoModal.tsx
Props:
- `videoUrl: string` - YouTube or Loom URL to parse and embed
- `projectName: string` - Used in modal title (screen reader only)
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Callback to close modal

**Features:**
- Parses multiple YouTube URL formats (watch, youtu.be, embed)
- Parses Loom share URLs
- Full-screen overlay with backdrop blur
- Autoplay on open (where browser allows)
- Focus trap and keyboard navigation
- Smooth fade-in and zoom animations

### components/FilterBar.tsx
Props:
- `selectedTags: string[]` - Currently active tag filters
- `onTagToggle: (tag: string) => void` - Toggle tag selection
- `searchQuery: string` - Current search text
- `onSearchChange: (query: string) => void` - Update search
- `onClearFilters: () => void` - Reset all filters

**Features:**
- Multi-select tag filtering (OR logic)
- Real-time search (matches name, description, builder)
- Shows "Clear all filters" when filters are active

### app/submit/page.tsx
Submission form with comprehensive validation:

**Form Fields:**
- Project Name (max 100 chars, required)
- Builder Name (max 50 chars, required)
- School (dropdown, required)
- GitHub URL (must start with https://github.com/, required)
- Video Demo URL (YouTube or Loom, required)
- Description (50-250 chars, required)
- Tags (multi-select, at least 1 required)

**Validation Patterns:**
- Real-time validation after field blur
- Dynamic character counters with color feedback
- Inline error messages with icons
- Helper text vs error text (mutually exclusive)
- Submit button disabled with tooltip when invalid
- Loading state during submission (1.5s simulated delay)

**UX Features:**
- Pre-filled builder name (empty by default)
- Live character counter for description
- Checkmark icons on selected tags
- Success modal on submission
- Form clears after successful submission
- Console logs JSON data (for development)

## Code Patterns

### Styling
- All styling uses Tailwind CSS (no custom CSS files)
- Mobile-first responsive design with sm:/md:/lg: breakpoints
- Warm color palette: #F7F5F2 (bg), #2C2416 (text), pastel accents
- Coral (#D4896C) as primary accent/CTA color
- Serif font (Freight Text Pro) for headings, Inter for body

### Video URL Parsing
Located in `components/VideoModal.tsx`:

```typescript
// Supported YouTube formats:
// https://www.youtube.com/watch?v=VIDEO_ID
// https://youtu.be/VIDEO_ID
// https://youtube.com/embed/VIDEO_ID

// Supported Loom format:
// https://www.loom.com/share/VIDEO_ID

// Regex patterns:
const youtubePatterns = [
  /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
  /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
  /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
];

const loomMatch = url.match(/loom\.com\/share\/([a-zA-Z0-9]+)/);

// Converts to embed format with autoplay:
// https://www.youtube.com/embed/VIDEO_ID?autoplay=1&rel=0
// https://www.loom.com/embed/VIDEO_ID?autoplay=1
```

### Form Validation Pattern
Located in `app/submit/page.tsx`:

```typescript
// Real-time validation on blur
const handleBlur = (e) => {
  const { name, value } = e.target;
  setTouched((prev) => ({ ...prev, [name]: true }));
  const error = validateField(name, value);
  setErrors((prev) => ({ ...prev, [name]: error }));
};

// Show errors only after field is touched
{errors.fieldName && touched.fieldName && (
  <p className="mt-2 text-sm text-red-500">{errors.fieldName}</p>
)}

// Helper text shown when no error
{!errors.fieldName && (
  <p className="mt-2 text-sm text-warm-text/50">Helper text here</p>
)}
```

### Modal Component Pattern
Located in `components/VideoModal.tsx`:

```typescript
// Focus trap on open
useEffect(() => {
  if (isOpen) {
    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
      previouslyFocused?.focus();
    };
  }
}, [isOpen]);

// Click outside to close
const handleBackdropClick = (e) => {
  if (e.target === modalRef.current) {
    onClose();
  }
};

// Escape key to close
useEffect(() => {
  const handleEscape = (e) => {
    if (e.key === "Escape" && isOpen) onClose();
  };
  document.addEventListener("keydown", handleEscape);
  return () => document.removeEventListener("keydown", handleEscape);
}, [isOpen, onClose]);
```

### Color-Matched Gradients
Located in `components/BuildCard.tsx`:

```typescript
// Map card background colors to gradient colors
const cardGradientMap: Record<string, string> = {
  "bg-warm-pink": "from-[#E8B4BC]",
  "bg-warm-green": "from-[#9CAF88]",
  "bg-warm-blue": "from-[#7BA3BC]",
  "bg-warm-coral": "from-[#D4896C]",
  "bg-warm-lavender": "from-[#C4B5D4]",
};

// Use matching gradient for description fade
const gradientColor = cardGradientMap[colorClass];
<div className={`bg-gradient-to-t ${gradientColor} to-transparent`} />
```

## Edge Cases & Quirks

### Video Autoplay
- Autoplay may not work in all browsers due to autoplay policies
- This is expected browser behavior, not a bug
- User clicking "View Demo" counts as interaction, so usually works

### Loom URLs with Trailing Slashes
- Current regex may not handle: `https://www.loom.com/share/abc123/`
- Recommended: test and update regex if needed

### Multiple Modals
- Each BuildCard has its own modal state
- Only one modal should be open at a time (z-index + body scroll lock)
- If issues occur, consider lifting modal state to page level

### Form State on Navigation
- Form data is NOT persisted in localStorage
- Navigating away loses form data
- This is standard web form behavior
- Could add beforeunload warning if needed

### Character Counter Colors
- Gray (0 chars) → Amber (<50 or >220) → Green (50-220) → Red (>250)
- Provides visual feedback on description length requirements

### Tag Display
- Tags with colors matching card background get darkened variants
- Example: "automation" (coral) on coral card uses darker shade
- Ensures readability across all card/tag combinations

## Accessibility Features

### Keyboard Navigation
- All form fields tab in logical order
- Modal traps focus when open
- Escape key closes modal
- Enter key submits form

### Screen Readers
- Form labels properly associated with inputs
- Error messages use ARIA patterns
- Modal has aria-modal and role="dialog"
- Hidden h2 in modal for screen reader title

### Touch Targets
- All buttons: 44px minimum on desktop
- Mobile: 48px minimum for better tapping
- Form inputs: 16px font size (prevents iOS zoom)

## Testing

See `instructions/TESTING-GUIDE.md` for:
- Quick 10-minute smoke test
- Comprehensive testing checklist
- Code review findings
- Known issues and edge cases

## Common Mistakes

### ESLint Issues
- Escape apostrophes in JSX: use `&apos;` not `'`
- Example: `We&apos;ll` instead of `We'll`

### Video URLs
- Always use https:// not http:// for GitHub URLs
- Test Loom URLs with real share links (sample data uses fake IDs)
- YouTube video IDs support letters, numbers, hyphens, underscores

### Form Validation
- Description must be 50-250 chars (not 0-250)
- At least 1 tag must be selected (not optional)
- Builder name is required (defaults to empty, not pre-filled)

### Color Consistency
- All CTAs use: `bg-warm-coral hover:bg-[#c47a5f] active:bg-[#b86f55]`
- Keep hover/active states consistent across components
