# Contributing to Project Scout

Thank you for your interest in contributing to **Project Scout**! We welcome contributions from students, educators, and open-source software engineers.

---

## 1. Development Workflow

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/Ram0507-Reddy/Project_Scout.git
   cd Project_Scout
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 2. Code Standards

- **Zero Emojis**: Maintain a clean, academic, and professional tone across all UI elements and documentation.
- **Strict Error Handling**: Wrap all asynchronous operations in try/catch blocks with deterministic fallbacks.
- **Accessibility**: Ensure all interactive controls have appropriate labels, visible focus states, and semantic HTML5 tags.
- **Client Security**: Never commit API keys or sensitive credentials into Git.

---

## 3. License
Project Scout is open-source software licensed under the **MIT License**.
