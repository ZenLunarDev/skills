# Security & Performance Review: UserProfile Component

## File: `vulnerable-component.jsx`

---

## Security Vulnerabilities

### 1. Exposed API Key in Environment Variable (CRITICAL)
**Location:** Line 4 — `const API_KEY = process.env.REACT_APP_API_KEY;`

**Issue:** The API key is embedded directly in client-side code via `process.env`. In React, any variable prefixed with `REACT_APP_` is bundled into the client-side JavaScript, making it visible to anyone who inspects the browser's DevTools or views the page source.

**Impact:** Attackers can extract the API key and use it to make unauthorized API calls, potentially leading to data breaches, quota exhaustion, or financial damage.

**Recommendation:** Never expose API keys in client-side code. Use a backend proxy or serverless function to handle authenticated API requests. If a key must be used client-side, restrict it heavily by IP/referrer on the API provider's side and rotate it regularly.

---

### 2. dangerouslySetInnerHTML Without Sanitization (HIGH)
**Location:** Line 24 — `<div dangerouslySetInnerHTML={{ __html: htmlContent }} />`

**Issue:** `dangerouslySetInnerHTML` injects raw HTML directly into the DOM. If `htmlContent` contains malicious scripts (e.g., `<script>alert('XSS')</script>`), they will execute in the user's browser.

**Impact:** Cross-Site Scripting (XSS) attacks. An attacker could steal cookies, session tokens, or perform actions on behalf of the user.

**Recommendation:** Avoid `dangerouslySetInnerHTML` entirely. If dynamic HTML is required, sanitize it using a trusted library like `DOMPurify` before rendering. Alternatively, render content using React's standard JSX expressions.

---

### 3. No CSRF Protection (MEDIUM)
**Location:** Lines 11–20 — POST requests to `/api/users` and `/api/users/:id`

**Issue:** The component sends POST requests without CSRF tokens. If the API relies on cookies for authentication, a malicious site could trick the user's browser into making unauthorized state-changing requests.

**Impact:** Cross-Site Request Forgery (CSRF). An attacker could create a user, delete data, or perform other actions without the user's knowledge.

**Recommendation:** Implement CSRF protection:
- Use a CSRF token sent as a header (e.g., `X-CSRF-Token`) with every state-changing request.
- Alternatively, use the `SameSite` cookie attribute and require custom headers for API calls.
- Consider using a library like `csrf-csrf` or framework-level CSRF middleware.

---

### 4. API Key Sent in Request Body (MEDIUM)
**Location:** Lines 12–14 and 17–20 — `body: JSON.stringify({ apiKey: API_KEY })`

**Issue:** The API key is sent in the request body for every API call. This increases the attack surface and makes key rotation difficult. If the API is ever logged (server-side, proxy, or browser), the key may be exposed.

**Impact:** Key leakage through logs, browser history, or proxy servers.

**Recommendation:** Send API keys via standard authorization headers (e.g., `Authorization: Bearer <token>` or `X-API-Key: <key>`). Never log request bodies containing secrets.

---

### 5. Missing Input Sanitization (MEDIUM)
**Location:** Line 29 — `{user.name}` rendered directly

**Issue:** While React automatically escapes string values in JSX, if `user.name` were ever rendered via `dangerouslySetInnerHTML` or if the component is refactored without escaping, XSS is possible.

**Impact:** Potential XSS if the rendering method changes in the future.

**Recommendation:** Ensure all user-generated content is escaped. If the data structure changes, audit rendering paths immediately.

---

## Performance Issues

### 1. Inline Arrow Functions in JSX (LOW-MEDIUM)
**Location:** Line 29 — `onClick={() => handleClick(user.id)}`

**Issue:** Defining a new arrow function inside the render cycle creates a new function reference on every render. This causes the `onClick` handler to be a new function for every list item on every render.

**Impact:**
- Unnecessary re-renders of child components if they receive the handler as a prop.
- Increased garbage collection pressure.
- Minor performance degradation in large lists.

**Recommendation:** Use `useCallback` to memoize the handler, or use the `data-*` attribute pattern:

```jsx
const handleClick = useCallback((id) => {
  fetch(`/api/users/${id`, { ... });
}, []);

// or
<li key={user.id} data-id={user.id} onClick={handleItemClick}>
```

---

### 2. Unnecessary State Update (LOW)
**Location:** Line 5 — `const [users, setUsers] = useState([]);`

**Issue:** Initializing state with an empty array is fine, but if the component re-renders before the fetch completes, the empty array is rendered. This is not a major issue but could be improved.

**Impact:** Minimal. The component will render an empty list while loading.

**Recommendation:** Add a loading state to prevent unnecessary re-renders and improve UX:

```jsx
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch(...)
    .then(data => setUsers(data))
    .finally(() => setLoading(false));
}, []);
```

---

### 3. Missing Error Handling (MEDIUM)
**Location:** Lines 11–19 — Fetch calls without `.catch()`

**Issue:** If the API request fails (network error, 500, 404), the error is silently swallowed. The user sees no feedback, and the component may enter an inconsistent state.

**Impact:** Poor user experience and potential silent failures.

**Recommendation:** Add error handling to all async operations:

```jsx
useEffect(() => {
  fetch('/api/users', { ... })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    })
    .then(data => setUsers(data))
    .catch(err => console.error(err));
}, []);
```

---

## Summary

| Category | Severity | Count |
|----------|----------|-------|
| Security | Critical | 1 |
| Security | High | 1 |
| Security | Medium | 3 |
| Performance | Low-Medium | 1 |
| Performance | Low | 1 |
| Performance | Medium | 1 |

## Priority Recommendations

1. **Move API key to backend** — Never expose secrets in client-side code.
2. **Remove `dangerouslySetInnerHTML`** — Use `DOMPurify` or standard JSX rendering.
3. **Add CSRF tokens** — Protect all state-changing API requests.
4. **Add error boundaries and loading states** — Improve resilience and UX.
5. **Memoize event handlers** — Use `useCallback` for handlers passed to list items.
