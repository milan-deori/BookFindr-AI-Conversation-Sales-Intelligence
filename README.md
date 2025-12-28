# BookFindr — AI Conversation & Sales Intelligence 

## Project Overview

**BookFindr** is a marketplace for buying, selling, and sharing books with an integrated AI assistant. It's a lightweight full-stack application where users can list books, search by categories, manage wishlists, and get AI-powered assistance for common tasks like search optimization, summarization, pricing suggestions, and content creation.

**Focus:** The AI assistant is a first-class feature; this README emphasizes how it's integrated, how it works, and how to extend it.

---

## About the AI Assistant

### Role

The AI Assistant is an in-app helper that:
- Answers user questions about books and categories
- Summarizes long book descriptions into concise snippets
- Suggests optimal pricing for sellers based on market data
- Assists with writing or improving book listings
- Rewrites search queries to improve relevance
- Optionally helps with content moderation and safety screening

### Implementation

Server-side integration lives in `server/utils/` with an abstraction layer (e.g., `gemini.js`) that handles communication with an LLM service (Google Gemini, OpenAI, or other provider). This abstraction allows swapping providers without touching frontend or route logic.

### Key Capabilities

- **Query Rewriting:** Improves buyer search terms for better results (e.g., "old math book" → "Advanced Calculus Textbook 2nd Edition")
- **Smart Summaries:** Condenses lengthy descriptions into 1–2 sentences
- **Seller Guidance:** Helps sellers write titles, pick categories, and estimate fair prices
- **Auth-Aware Suggestions:** Personalizes hints based on user history and preferences
- **Multi-turn Chat:** Optional conversational mode for deeper assistance (roadmap feature)

---

## High-Level Architecture

### Frontend
- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **Location:** `frontend/`
- **Key directories:**
  - `src/components/` — UI building blocks (Header, BannerSlider, SearchResults, Dashboard)
  - `src/pages/` — Full-page views (Home, Login, Signup, Sell, BookDetails, Wishlist, AuthSuccess)
  - `src/utils/` — Helpers (image base64 conversion, location utilities)

### Backend
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Location:** `server/`
- **Key directories:**
  - `models/` — Mongoose schemas (User, Sell/Book)
  - `routes/` — API endpoints (auth, books, chat, wishlist)
  - `middleware/` — Auth middleware for protected routes
  - `utils/` — Cloudinary integration, file uploads, AI provider adapter

### Data Persistence
- **MongoDB:** Stores users, book listings, wishlists, chat history
- **Cloudinary:** CDN for book images and user avatars
- **Environment:** Secrets and config via `.env` file

### AI Integration
The abstraction in `server/utils/gemini.js` (or provider-specific module):
- Manages API keys and authentication
- Shapes requests into provider-specific formats
- Handles rate limiting and retry logic
- Caches repeated queries to reduce cost
- Returns structured JSON responses

---

## Project Structure (Short Overview)

```
BooksBazer/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route-level views
│   │   ├── utils/               # Image and location helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                      # Express backend
│   ├── models/
│   │   ├── user.js              # User schema
│   │   └── sell.js              # Book listing schema
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── books.js             # Book CRUD + search
│   │   ├── chat.js              # AI chat endpoint (main AI integration)
│   │   └── wishlist.js          # Wishlist CRUD
│   ├── middleware/
│   │   └── authMiddleware.js    # JWT verification
│   ├── utils/
│   │   ├── cloudinary.js        # Image hosting setup
│   │   ├── upload.js            # Multer + file handling
│   │   └── gemini.js            # AI provider adapter
│   ├── app.js                   # Server entrypoint
│   └── package.json
│
├── README.md                    # This file
└── AI_ASSISTANT_DOCUMENTATION.md
```

---

## Why the AI Assistant is Central

1. **Reduce Friction:** Sellers unfamiliar with writing listings get instant templates and suggestions
2. **Improve Discovery:** Buyers get query improvements that surface more relevant books
3. **Boost Conversion:** Micro-copy suggestions (titles, descriptions, prices) increase confidence
4. **Extensible:** Foundation for future features—chat support, notifications, recommendations, moderation

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 16 (ideally 18+)
- **npm** or **yarn**
- **MongoDB** connection (Atlas free tier or local)
- **Cloudinary** account (optional, for image hosting)
- **API Key** for AI provider (Gemini, OpenAI, etc.)

### Environment Variables

Create a `.env` file in the `server/` directory with:

```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/booksbazar
PORT=3000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
AI_API_KEY=your_gemini_or_openai_key
AI_PROVIDER=gemini
NODE_ENV=development
```

### Setup & Run (Local Development)

#### Backend
```bash
cd server
npm install
# Add .env with variables above
npm run dev    # Uses nodemon if available
# or: node app.js
```

Server runs on `http://localhost:3000` by default.

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

Opens Vite dev server (typically `http://localhost:5173`).

### Production Build

#### Frontend
```bash
cd frontend
npm run build
# Outputs to dist/
```

#### Backend
1. Set all env variables in production environment
2. Run: `node app.js` or use PM2/Docker for process management
3. Ensure MongoDB and Cloudinary are accessible from production environment

---

## API Endpoints (Overview)

### Authentication
- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/login` — Login and receive JWT token

### Books
- `GET /api/books` — List/search books (query: `category`, `search`, `page`)
- `POST /api/books` — Create a new book listing (protected, seller only)
- `GET /api/books/:id` — Fetch single book details
- `PUT /api/books/:id` — Update listing (protected, owner only)
- `DELETE /api/books/:id` — Delete listing (protected, owner only)

### Wishlist
- `POST /api/wishlist` — Toggle a book in wishlist (protected)
- `GET /api/wishlist` — Fetch user's wishlist (protected)

### Chat & AI (Main Integration)
- `POST /api/chat/ai` — Send a prompt to the AI assistant (core endpoint)

---

## AI Assistant: Endpoints and Data Flow

### Main Endpoint: `POST /api/chat/ai`

**Request Body:**
```json
{
  "type": "listing_help|rewrite_search|summarize|pricing",
  "payload": {
    "text": "...",
    "fields": { "title": "...", "description": "..." },
    "query": "..."
  }
}
```

**Action Types:**

1. **`rewrite_search`** — Improve a buyer's search query
   - Input: `{ "query": "old math book" }`
   - Output: `{ "suggestion": "Advanced Calculus Textbook" }`

2. **`summarize`** — Condense a long description
   - Input: `{ "text": "This is a 500-word description..." }`
   - Output: `{ "summary": "Well-kept calculus notes." }`

3. **`listing_help`** — Assist seller with title, description, category
   - Input: `{ "fields": { "title": "", "description": "Used notes from 2022" } }`
   - Output: `{ "title": "Calculus Notes 2022", "price_suggestion": "₹250" }`

4. **`pricing`** — Suggest a fair price
   - Input: `{ "fields": { "title": "Python Handbook", "condition": "good" } }`
   - Output: `{ "price_suggestion": "₹450–₹600" }`

**Response:**
```json
{
  "status": "success",
  "data": {
    "result": "...",
    "rationale": "...",
    "confidence": 0.85
  },
  "meta": {
    "tokens_used": 150,
    "cached": false
  }
}
```

### Flow Diagram

1. **Frontend** sends prompt to `POST /api/chat/ai`
2. **Backend** validates user auth (JWT token)
3. **Backend** sanitizes & enriches prompt with context (user role, book category, etc.)
4. **Backend** calls `server/utils/gemini.js` (or provider module)
5. **AI Service** (Gemini API) processes and returns structured result
6. **Backend** formats result and returns to frontend
7. **Frontend** displays suggestion with accept/reject/edit options

---

## AI Assistant: Implementation Details

### Provider Abstraction (`server/utils/gemini.js`)

This module handles all provider-specific logic:

```javascript
// Example structure:
class AIProvider {
  constructor(apiKey, config) { /* ... */ }
  
  async chat(prompt, options) {
    // Shape request for provider
    // Call API
    // Parse and return structured response
  }
  
  async rateLimit() { /* Check if we can make request */ }
  async cache(key) { /* Retrieve cached result */ }
}
```

**Key responsibilities:**
- API authentication
- Request/response formatting
- Rate limiting (prevent abuse & cost spikes)
- Query caching (avoid re-processing identical requests)
- Error handling & retries
- Token counting (track usage)

### Safety & Sanitization

**Input sanitization:**
- Strip HTML/script tags from user text
- Reject payloads larger than limit (e.g., 2000 chars)
- Validate JSON structure before forwarding

**Output validation:**
- Never auto-post AI suggestions; require explicit user confirmation
- Show disclaimer: *"This is an AI suggestion. Please review before saving."*
- Log all AI interactions for audit/debugging

### Cost Management

- **Per-request limits:** Set `max_tokens` to avoid runaway costs
- **Caching:** Store results for identical prompts (e.g., summarizing same description)
- **Sampling:** Free tier users get 3 free AI uses; then require payment or credits
- **Monitoring:** Track token usage and alert if spending exceeds threshold

---

## Frontend Integration Patterns

### Example: Seller Listing Helper

**Component: `src/pages/Sell.jsx`**

1. User fills form (title, description, images)
2. Clicks "Get AI Suggestions"
3. Frontend sends `POST /api/chat/ai` with `type: "listing_help"`
4. Receives suggestions for improved title, price estimate, category
5. Shows suggestions in a modal with **Accept**, **Edit**, **Reject** buttons
6. If accepted, suggestions populate form fields (user can still edit)
7. On submit, form data is saved to database

**Key UX principles:**
- Non-blocking: Show spinner while AI processes, don't freeze UI
- Transparent: Always credit the AI ("Suggested by AI Assistant")
- Editable: User retains full control; AI is advisory
- Optional: AI features don't block workflow

### Example: Buyer Search Improvement

**Component: `src/pages/Home.jsx` or `src/components/SearchBar.jsx`**

1. User types search query
2. Optional: Click "Improve Search"
3. Frontend sends `POST /api/chat/ai` with `type: "rewrite_search"`
4. AI returns improved query (e.g., "old book" → "Vintage Fiction Novel")
5. Frontend displays original + AI suggestion
6. If user clicks suggestion, it replaces search box and triggers fresh search

---

## Security & Safety

### Authentication & Authorization
- Protect `/api/chat/ai` with JWT middleware
- Only authenticated users can access AI (or limit to premium tier)
- Log user ID with each AI request for audit trail

### Rate Limiting
- Implement per-user rate limit (e.g., 10 requests/minute)
- Implement per-IP rate limit (e.g., 100 requests/minute) to block bots
- Return `429 Too Many Requests` if limit exceeded

### Content Validation
- Validate JSON schema on incoming requests
- Reject requests with embedded HTML/script/SQL
- Validate response from AI before returning to frontend

### Cost Protection
- Hard cap on tokens per request (e.g., max 500 tokens output)
- Track cumulative token usage per user/day
- Alert and pause if monthly spending exceeds budget

---

## Testing the Assistant

### Manual Testing (Postman / cURL)

```bash
curl -X POST http://localhost:3000/api/chat/ai \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "summarize",
    "payload": {
      "text": "This is a comprehensive textbook on calculus..."
    }
  }'
```

### Unit Testing

Mock the AI provider:
```javascript
jest.mock('../utils/gemini');
gemini.chat.mockResolvedValue({ result: "..." });
// Test route handler
```

### Integration Testing

1. Spin up test MongoDB instance
2. Create test user + JWT token
3. Call `/api/chat/ai` with sample payloads
4. Assert response structure & content

---

## Extending the Assistant

### Add New Action Types

In `server/routes/chat.js`, add a new case:

```javascript
case 'detect_genre':
  result = await gemini.detectGenre(payload.title);
  break;
```

### Add Multi-Turn Conversation

- Store conversation history in MongoDB
- Add `conversationId` to requests
- Retrieve prior messages and pass as context to AI
- Return conversation ID so frontend can continue chain

### Add Analytics

- Log which AI suggestions users accept/reject
- Track most common request types
- Use data to refine prompts and improve acceptance rate

---

## Examples (Prompts & Responses)

### Example 1: Listing Helper

**Frontend sends:**
```json
{
  "type": "listing_help",
  "payload": {
    "fields": {
      "title": "",
      "description": "Used calculus notes, 200 pages, good condition, from 2023 edition"
    }
  }
}
```

**AI returns:**
```json
{
  "status": "success",
  "data": {
    "result": {
      "title": "Calculus Textbook Notes 2023 Edition - 200 Pages",
      "price_suggestion": "₹250–₹350",
      "category": "StudyPage",
      "short_summary": "Well-organized calculus notes covering derivatives, integrals, and applications."
    }
  }
}
```

### Example 2: Search Rewrite

**Frontend sends:**
```json
{
  "type": "rewrite_search",
  "payload": { "query": "old bio book" }
}
```

**AI returns:**
```json
{
  "status": "success",
  "data": {
    "result": {
      "original": "old bio book",
      "suggestion": "Biology Textbook Vintage Edition",
      "rationale": "More specific term matching likely listings"
    }
  }
}
```

---

## Developer Notes

### Where to Change AI Provider
- File: `server/utils/gemini.js`
- Steps:
  1. Create new provider module (e.g., `openai.js`)
  2. Implement same interface (`.chat()`, `.cache()`, etc.)
  3. Update `server/routes/chat.js` to import new provider
  4. Update `.env` with new API key
  5. Test with `curl` or Postman

### Where to Add UI Hooks
- `src/pages/Sell.jsx` — Add "Get AI Suggestions" button
- `src/components/SearchBar.jsx` — Add "Improve Search" suggestion
- `src/pages/BookDetails.jsx` — Show price context powered by AI
- `src/pages/Dashboard.jsx` — Show personalized book recommendations

### Key Files
- `server/routes/chat.js` — Main AI request handler
- `server/utils/gemini.js` — AI provider adapter
- `frontend/src/pages/Sell.jsx` — Seller flow integration
- `frontend/src/components/SearchBar.jsx` — Search integration

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **AI calls fail (500 error)** | Check `AI_API_KEY` in `.env`; verify API credentials active; check network/firewall rules |
| **Images fail to upload** | Verify Cloudinary credentials; check CORS settings; ensure file size < limit |
| **DB connection fails** | Verify `MONGO_URI` in `.env`; check MongoDB connection permissions; whitelist server IP in Atlas |
| **AI response is generic/poor** | Refine prompt in `gemini.js`; add more context (e.g., book category, condition); increase `max_tokens` |

---

## Performance Tips

- **Offload long-running AI calls** to background jobs (e.g., Bull queue) to keep API responsive
- **Stream AI responses** if provider supports it (good for chat)
- **Cache frequently-summarized books** to reduce API calls
- **Batch requests** when possible (e.g., summarize 5 books in one call if API allows)
- **Monitor token usage** and set alerts for anomalies

---

## UX Guidelines for AI Suggestions

1. **Label AI-generated content:** Always show "Suggested by AI Assistant"
2. **Make it editable:** Allow users to tweak before saving
3. **Show confidence:** Indicate if suggestion is high/medium/low confidence
4. **Provide rationale:** Explain why (e.g., "based on similar listings")
5. **Allow rejection:** Option to dismiss and try again or skip
6. **No auto-save:** Never save AI suggestions without explicit user action

---

## Contributing

1. **Fork** the repository
2. **Branch:** `git checkout -b feature/my-feature`
3. **Commit:** `git commit -am 'Add feature X'`
4. **Test:** Ensure all tests pass (`npm test`)
5. **Push:** `git push origin feature/my-feature`
6. **Pull Request:** Submit PR with description

---

## Roadmap / Future Ideas

- [ ] Multi-turn conversational chat (remember context across messages)
- [ ] Analytics dashboard to track AI suggestion acceptance rates
- [ ] Localization support for non-English markets
- [ ] Premium tier with unlimited AI requests (free tier limits 5/month)
- [ ] AI-powered book recommendations based on wishlist
- [ ] Automated content moderation (filter inappropriate listings)
- [ ] Price comparison across platforms (eBay, Amazon, etc.)
- [ ] OCR for handwritten notes → digital summaries

---

## Acknowledgements & Credits

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Database:** MongoDB, Mongoose
- **Media:** Cloudinary
- **AI:** Google Gemini API (or provider of choice)
- **Community:** Contributors and testers

---

## License

This project does not yet include a license file. To add one:
- For open-source: Choose MIT, GPL, or Apache 2.0 from [choosealicense.com](https://choosealicense.com)
- For proprietary: Add a custom license or contact the maintainer

---

## Appendix: Quick Dev Commands

### Backend (Development)
```bash
cd server
npm install
npm run dev          # Starts with nodemon
```

### Frontend (Development)
```bash
cd frontend
npm install
npm run dev          # Starts Vite dev server
```

### Frontend (Production Build)
```bash
cd frontend
npm run build
npm run preview      # Preview production build locally
```

### Run Both (Concurrent)
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

---



