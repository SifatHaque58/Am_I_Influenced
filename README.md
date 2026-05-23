# Am I Influenced?

A dynamic, interactive web application designed to rigorously evaluate a user's susceptibility to influence across **10 Psychometric Dimensions**. The app combines an engaging, adaptive questionnaire with an aesthetic UI, interactive data visualizations, and secure AI-driven psychological insights.

## ✨ Features

- **Adaptive Psychometric Engine**: Instead of randomly picking questions, the engine calculates statistical variance and "confidence" in real-time, actively hunting down questions to resolve contradictory answers and maximize accuracy.
- **Dynamic Quiz Extension**: If the engine detects a "Low Confidence" profile due to contradictory answers, it actively prompts the user to answer an additional set of highly targeted questions to improve data validity before final analysis.
- **10-Dimension Scoring System**: Evaluates the user across 10 distinct variables:
  - *External*: Social, Algorithmic, Advertising, Peer, Status, Insecurity, Habitual, Cultural
  - *Internal*: Practical, Independent
- **Normalized Data Models**: Uses standardized `mc`, `binary`, and `graded` (1-5 Likert scale) question formats with factor loadings to map answers accurately to the influence dimensions.
- **Data Visualization**: Live interactive Radar Charts powered by Recharts, alongside a real-time "Data Confidence" validity score.
- **Secure AI Deep Dive**: Connects to OpenRouter to generate a personalized, empathetic behavioral analysis based on the user's specific 0-100 dimensional spread.
- **High-End UI/UX**: Built with Tailwind CSS featuring glassmorphism, rich gradients, smooth Framer Motion transitions, and fully responsive design.

## 🛠 Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Charting**: Recharts
- **Icons**: Lucide React
- **Backend/Deployment**: Cloudflare Workers / Wrangler

## 🔒 Architecture & Security

The application is engineered with security in mind. The frontend *never* exposes API keys. 

Instead of calling the OpenRouter AI directly from the browser, the app utilizes a **Cloudflare Worker Entrypoint** (`src/worker.js`). 
- When a user clicks "Generate AI Analysis", the React frontend sends a POST request to `/api/analyze`.
- The Cloudflare edge worker intercepts this request, securely attaches the `OPENROUTER_API_KEY` stored in its environment variables, and communicates with the AI model.

## 🚀 Getting Started

To run this project locally, follow these steps to run the Vite frontend and the Wrangler backend side-by-side.

### Prerequisites
- **Node.js** v22 or higher
- **npm** (v10+)
- A free API key from [OpenRouter](https://openrouter.ai/) (Required if you want to test the AI functionality locally).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YourUsername/Am_I_Influenced.git
   cd Am_I_Influenced
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure the AI Backend:**
   Create a `.dev.vars` file in the root directory and add your OpenRouter API key:
   ```env
   OPENROUTER_API_KEY=your_api_key_here
   ```

4. **Run the local development environment:**
   You will need to open **two terminal windows** to run the frontend and backend simultaneously.
   
   **Terminal 1 (Frontend):**
   ```bash
   npm run dev
   ```
   *(This starts the Vite dev server at http://localhost:5173 and automatically proxies `/api` requests to port `8787`)*

   **Terminal 2 (Backend Worker):**
   ```bash
   npx wrangler dev src/worker.js
   ```
   *(This boots up the Cloudflare worker on port `8787` to handle the AI analysis requests)*

## 📦 Deployment

This project is configured for deployment to **Cloudflare**.

**Option A: Cloudflare Workers (CLI Deployment)**
If you deploy directly via the terminal, simply run:
```bash
npm run build
npx wrangler deploy
```
Cloudflare will automatically read the `wrangler.json` configuration, deploy `src/worker.js` as the backend, and serve the built static assets from the `./dist` folder.

**Option B: Cloudflare Pages (GitHub Auto-Deploy)**
If you connect your GitHub repository to Cloudflare Pages for automatic deployments, you must update your `package.json` build script so Cloudflare Pages recognizes your backend worker. Change your build script to:
`"build": "tsc -b && vite build && cp src/worker.js dist/_worker.js"`
Cloudflare Pages looks for a file specifically named `_worker.js` in the output directory to handle backend routing. Make sure your environment variables (`NODE_VERSION=22` and `OPENROUTER_API_KEY`) are set in the Pages dashboard.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
