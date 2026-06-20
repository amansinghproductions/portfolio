# Graphic Designer Portfolio Template

A cinematic, editorial-dark portfolio template inspired by universalpictures.com.
Built with pure HTML, CSS, and vanilla JavaScript — no build tools required.

---

## 📁 File Structure

```
portfolio/
├── index.html          ← Main page (edit this)
├── css/
│   └── style.css       ← All styles (edit colors/fonts here)
├── js/
│   └── main.js         ← Interactions & animations
└── README.md
```

---

## 🚀 Quick Start

1. Open `index.html` in any browser — it works offline.
2. Edit the placeholder text in `index.html` with your real content.
3. Replace gradient `<div class="project-img">` backgrounds with real `<img>` tags.
4. Deploy to any static host (Netlify, Vercel, GitHub Pages, etc.).

---

## ✏️ Customization Guide

### Personal Details
Search `index.html` for these placeholders and replace them:
- `Your Name` / `YN` — your name and initials
- `hello@yourname.com` — your email
- `+1 (000) 000-0000` — your phone
- `[City, Country]` — your location
- `#` in social links — your real profile URLs (Behance, Dribbble, etc.)

### Colors
Edit CSS variables at the top of `css/style.css`:
```css
--accent:  #c8a96e;   /* warm gold — change to your brand color */
--accent2: #e05a4b;   /* cinematic red — used for accents */
```

### Fonts
The template uses Google Fonts (loaded in `<head>`). To change:
1. Replace the Google Fonts `<link>` in `index.html`
2. Update `--font-display`, `--font-serif`, `--font-body` in `:root`

### Project Images
Replace each `<div class="project-img" style="background:...">` with:
```html
<div class="project-img">
  <img src="images/your-project.jpg" alt="Project Name" />
</div>
```
Recommended sizes:
- Featured project: 1920 × 820 px
- Grid projects: 800 × 600 px

### Your Photo (About section)
Replace `<div class="about-img-block">` with:
```html
<div class="about-img-block">
  <img src="images/your-photo.jpg" alt="Your Name" style="width:100%;height:100%;object-fit:cover;" />
</div>
```

### Contact Form
The form currently simulates a send. To make it real:

**Option A — Formspree (easiest):**
1. Sign up at formspree.io
2. In `main.js`, replace the `setTimeout` block with:
```js
const res = await fetch('https://formspree.io/f/YOUR_ID', {
  method: 'POST', headers: {'Content-Type':'application/json'},
  body: JSON.stringify(Object.fromEntries(new FormData(form)))
});
```

**Option B — EmailJS:**
Add EmailJS SDK to `index.html` and call `emailjs.sendForm(...)` in `main.js`.

### Stats (Hero section)
Edit the numbers in the `.hero-stats` section:
- Years Experience
- Projects Delivered
- Clients count

---

## 🎨 Sections Included

| Section       | Purpose                                      |
|---------------|----------------------------------------------|
| Hero          | Full-viewport intro with name, headline, CTA |
| Marquee       | Animated skills/service ticker               |
| Work          | 5-project grid with featured slot            |
| About         | Bio, photo, tools, CV download               |
| Services      | 6 service cards with hover animation         |
| Testimonials  | 3 client quotes                              |
| Contact       | Info + working contact form                  |
| Footer        | Clean minimal footer                         |

---

## 🌐 Deployment

### Netlify (recommended — free)
1. Drag the `portfolio/` folder onto netlify.com/drop
2. Done — live in seconds.

### GitHub Pages
1. Push this folder to a GitHub repo
2. Go to Settings → Pages → Source: main branch / root
3. Your site is live at `username.github.io/repo-name`

### Vercel
```bash
npx vercel --prod
```

---

## 📄 License
Free to use for personal and commercial portfolios.
Please do not resell as a template.

---

Made with care. Go build something memorable.
