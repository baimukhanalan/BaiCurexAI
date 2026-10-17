<div align="center">

# BaiCurex AI

### AI-assisted exploration of EEG & ECG biosignals

*A concept Decision Support System (DSS) that turns signal features into neutral, human-readable clinical narratives — it never diagnoses.*

<br/>

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)

</div>

---

## 📖 About

**BaiCurex AI** is an early, experimental concept for an EEG/ECG **Decision Support System**. The idea it explores: take the mathematical features extracted from a biosignal (rhythms, spectral bands, heart rate, variability, signal quality) and use a large language model to draft a clear, descriptive clinical summary for a reviewing physician.

The project grew out of a Google AI Studio (Gemini) React starter. In its current form it is a **front-end prototype with a mocked analysis pipeline** — the UI, the triage flow, and the Gemini report generation are real; the underlying signal processing is simulated with placeholder data so the experience can be demonstrated end to end.

> ⚠️ This is a proof-of-concept. It has **no medical validation**, performs **no real signal analysis on uploaded files**, and must **not** be used for any clinical purpose.

## ✨ Vision / What it explores

- Converting quantitative signal features into **neutral, non-diagnostic** clinical narrative text.
- A **rule-based triage** concept (🟢 Green / 🟡 Yellow / 🔴 Red) to flag studies for human review.
- A **physician-in-the-loop** workflow where every AI draft is explicitly framed as requiring clinician interpretation.
- A multi-tenant **clinic / admin portal** shell (onboarding, quotas, billing, audit log) around the analysis idea.

## 🚀 Features (what the code actually does today)

- 🧩 **Multi-view SPA** — landing page, auth, a clinic portal (dashboard, upload, archive, billing, live-SLA, profile) and an admin portal, all in React.
- 🤖 **Gemini-generated reports** — real calls via `@google/genai` turn the study's feature set into a narrative EEG/ECG summary, guided by a strict "describe, do not diagnose" system prompt.
- 🚦 **Rule-based triage** — deterministic logic assigns a triage color and marks studies that need an auditor.
- 📊 **Charts & metrics** — `recharts`-based dashboards and animated live-performance tiles.
- 🌐 **i18n scaffolding** — a translation layer with English and Russian strings.
- 💾 **Browser-local persistence** — studies, clinics, users and audit logs are stored in `localStorage`; there is no server.

> 🧪 **Honest note:** the "mathematical analysis" of uploaded files is **simulated** (placeholder feature values and randomized findings) inside a backend *simulator*. There is no real EEG/ECG processing, no backend, and no persistence beyond the browser. The AI-driven report generation is the direction this prototype is exploring.

## 🛠️ Tech Stack

| Layer | Technology |
| --- | --- |
| Language | TypeScript (~5.8) |
| UI | React 19 |
| Build | Vite 6 |
| AI | Google Gemini via `@google/genai` |
| Charts | Recharts |
| Styling | Tailwind CSS (CDN) |

## 🏁 Getting Started

**Prerequisites:** [Node.js](https://nodejs.org/)

```bash
# 1. Install dependencies
npm install

# 2. Provide your Gemini API key
#    Create a .env.local file in the project root:
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env.local

# 3. Start the dev server (http://localhost:3000)
npm run dev
```

Other scripts:

```bash
npm run build     # production build
npm run preview   # preview the production build
```

> The Gemini key is read at build time via Vite's `define` and exposed to the client. Keep real keys out of version control, and treat any key used here as demo-only.

## 📌 Status

🧪 **Early prototype / proof-of-concept.** This is exploratory work, not a product. Expect mocked analysis, hard-coded demo data, in-browser storage, and rough edges. Nothing here is clinically validated or intended for real patient data.

## 🗺️ Roadmap

- [ ] Replace the mocked analysis with a real EEG/ECG signal-processing backend
- [ ] Support actual signal file formats (e.g. EDF) instead of filename-only uploads
- [ ] Move persistence from `localStorage` to a real, secured datastore
- [ ] Add proper authentication and remove hard-coded demo accounts
- [ ] Introduce tests and validation around the triage logic
- [ ] Explore (clearly out of scope for now) what clinical validation would even require

## 📄 License

Released under the [MIT License](LICENSE). © 2026 Alan Bai.

---

<div align="center">
<sub>BaiCurex AI is an experimental concept. It is not a medical device and does not provide medical advice or diagnoses.</sub>
</div>
