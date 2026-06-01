# BR-Homes — Complete AI Development Prompt

> Paste this entire file into Cursor, Windsurf, Claude Code, or any AI coding assistant to scaffold and build the BR-Homes platform from scratch.

---

## 1. Project Overview

**BR-Homes** is a no-broker real estate marketplace for **Amreli, Gujarat** and nearby areas.

- Property owners list **houses, flats, shops, and land** for **sale or rent**
- Buyers browse freely; the owner's **phone number is shown directly** on the listing — no messaging, no middleman
- **Admin approves owners** (before they can post) **and properties** (before they go live)
- Goal: save commission costs, connect buyers directly with owners

---

## 2. Core Principles

1. **No brokers** — direct owner-to-buyer contact via phone number shown on listing
2. **Minimal UI** — clean, not overwhelming; only essential shadcn/ui components
3. **Mobile-first** — fully responsive, works perfectly on small screens
4. **TypeScript everywhere** — strict mode, both frontend and backend
5. **Developer-friendly** — standardized responses, error handling, clean structure
6. **Performance** — TanStack Query caching, skeleton loaders, image lazy loading

---

## 3. Architecture Diagrams (Eraser — TODO: export and embed)

- [ ] System Architecture → https://app.eraser.io/workspace/hEvyXUtFuntoNQwjy3Mz
- [ ] Database Schema (MongoDB) → https://app.eraser.io/workspace/ACIJ0U6jQYs17am3kpQ8
- [ ] Full API Reference → https://app.eraser.io/workspace/WvsqSbtOUSBZndwmn89b
- [ ] App Flow & Sitemap → https://app.eraser.io/workspace/ixlupIlS6Kbfwyc1r3ov

---

## 4. Tech Stack

### Frontend
| Tool | Package | Purpose |
|------|---------|---------|
| Framework | `react` + `react-dom` v18 | SPA |
| Build | `vite` v5 | Dev server + bundler |
| Language | `typescript` v5 (strict) | Type safety |
| Styling | `tailwindcss` v3 | Utility-first CSS |
| Components | `shadcn/ui` (minimal) | Button, Input, Card, Badge, Dialog, Select, Skeleton, Sonner only |
| Global State | `zustand` v4 | Auth, UI state, filters |
| Server State | `@tanstack/react-query` v5 | API calls, caching, loading, refetch |
| Routing | `react-router-dom` v6 | Client-side routing |
| HTTP | `axios` v1 | API calls with interceptors |
| Forms | `react-hook-form` v7 | Form state management |
| Validation | `zod` v3 + `@hookform/resolvers` | Form + schema validation |
| Icons | `lucide-react` | Icon set (installed with shadcn) |

### Backend
| Tool | Package | Purpose |
|------|---------|---------|
| Runtime | Node.js v20+ | Server |
| Framework | `express` v4 | REST API |
| Language | `typescript` v5 (strict) | Type safety |
| Auth | `@auth/express` (Auth.js v5) | Session management |
| Auth Adapter | `@auth/mongodb-adapter` | Auth.js → MongoDB via mongoose client |
| ORM | `mongoose` v8 | MongoDB schema + queries |
| Password | `bcryptjs` + `@types/bcryptjs` | Hash passwords |
| Upload | `multer` (memory storage) | Parse multipart/form-data |
| Images | `cloudinary` v2 | Upload + CDN delivery |
| Email | `resend` v2 | Transactional email (free tier) |
| Validation | `zod` v3 | Request body validation |
| Security | `helmet` + `cors` | HTTP security headers |
| Logging | `morgan` | Request logging (dev) |
| Dev | `tsx` + `rimraf` | TypeScript runner + clean |

### Infrastructure
| Service | Purpose | Free Tier |
|---------|---------|-----------|
| MongoDB Atlas | Database | Free M0 (512MB) |
| Cloudinary | Image storage + CDN | Free (25GB storage, 25GB bandwidth) |
| Resend | Transactional email | Free (3,000 emails/month, 100/day) |
| Vercel | Frontend hosting | Free |
| Railway | Backend hosting | Starter ($5 credit/month) |

> ⚠️ **Use Railway for Express backend, NOT Vercel serverless.** Multer (file uploads) and Auth.js session cookies require a long-running server process.

---

## 5. Folder Structure

### Frontend — `br-homes-client/`

```
br-homes-client/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                       # static images, logo
│   ├── components/
│   │   ├── ui/                       # shadcn/ui auto-generated — do not edit
│   │   ├── common/
│   │   │   ├── Navbar.tsx            # top nav with role-aware links
│   │   │   ├── Footer.tsx
│   │   │   ├── PropertyCard.tsx      # used in listings grid + saved page
│   │   │   ├── PropertyGrid.tsx      # responsive 1/2/3 column grid
│   │   │   ├── LoadingSkeleton.tsx   # skeleton for property cards
│   │   │   └── ProtectedRoute.tsx    # role + auth guard wrapper
│   │   ├── forms/
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── PropertyForm.tsx      # shared by AddProperty + EditProperty
│   │   │   └── CompleteProfileForm.tsx
│   │   └── layout/
│   │       ├── MainLayout.tsx        # Navbar + Footer wrapper
│   │       ├── DashboardLayout.tsx   # sidebar layout for owner + admin
│   │       └── AuthLayout.tsx        # centered card for login/register
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.tsx          # hero + featured listings
│   │   │   ├── ListingsPage.tsx      # browse + filter all properties
│   │   │   └── PropertyDetailPage.tsx # full detail + owner phone shown
│   │   ├── auth/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── VerifyEmailPage.tsx   # shows after email registration
│   │   │   ├── CompleteProfilePage.tsx # Google users set role + phone
│   │   │   └── OwnerPendingPage.tsx  # shown when ownerApproved=false
│   │   ├── buyer/
│   │   │   └── SavedPage.tsx         # all saved/favorited properties
│   │   ├── owner/
│   │   │   ├── OwnerDashboardPage.tsx
│   │   │   ├── OwnerPropertiesPage.tsx
│   │   │   ├── AddPropertyPage.tsx
│   │   │   └── EditPropertyPage.tsx
│   │   └── admin/
│   │       ├── AdminDashboardPage.tsx
│   │       ├── PendingOwnersPage.tsx
│   │       ├── PendingPropertiesPage.tsx
│   │       ├── ManagePropertiesPage.tsx
│   │       ├── ManageUsersPage.tsx
│   │       └── SettingsPage.tsx
│   ├── store/                        # Zustand stores
│   │   ├── authStore.ts              # session user, role, loading
│   │   ├── filterStore.ts            # property search filters + pagination
│   │   └── uiStore.ts                # mobile menu, image dialog state
│   ├── hooks/
│   │   ├── useAuth.ts                # read from authStore
│   │   ├── useProperties.ts          # TanStack Query for listings
│   │   └── useImageUpload.ts         # local preview before upload
│   ├── lib/
│   │   ├── axios.ts                  # Axios instance (baseURL + interceptors)
│   │   ├── queryClient.ts            # TanStack Query client config
│   │   └── utils.ts                  # cn(), formatPrice(), formatDate()
│   ├── validations/                  # Zod schemas (forms)
│   │   ├── auth.schema.ts
│   │   ├── property.schema.ts
│   │   └── profile.schema.ts
│   ├── types/
│   │   └── index.ts                  # IUser, IProperty, IApiResponse, etc.
│   ├── router/
│   │   └── index.tsx                 # React Router + ProtectedRoute config
│   ├── App.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── .env
├── .env.example
├── tailwind.config.ts
├── tsconfig.json
├── vite.config.ts
└── package.json
```

### Backend — `br-homes-server/`

```
br-homes-server/
├── src/
│   ├── config/
│   │   ├── db.ts                     # Mongoose connect to MongoDB Atlas
│   │   ├── cloudinary.ts             # Cloudinary v2 SDK config
│   │   ├── auth.ts                   # Auth.js config (providers, callbacks, adapter)
│   │   └── env.ts                    # Zod env validation — throws on missing vars
│   ├── models/
│   │   ├── User.model.ts             # Extended Auth.js user schema
│   │   ├── Account.model.ts          # Auth.js OAuth accounts (Google only)
│   │   ├── Session.model.ts          # Auth.js sessions
│   │   ├── VerificationToken.model.ts
│   │   ├── Property.model.ts
│   │   ├── SavedProperty.model.ts
│   │   ├── AdminAction.model.ts
│   │   └── Setting.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── property.routes.ts
│   │   ├── owner.routes.ts
│   │   ├── saved.routes.ts
│   │   └── admin.routes.ts
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── property.controller.ts
│   │   ├── owner.controller.ts
│   │   ├── saved.controller.ts
│   │   └── admin.controller.ts
│   ├── middleware/
│   │   ├── sessionGuard.ts           # verify Auth.js session — 401 if missing
│   │   ├── roleGuard.ts              # check user.role — 403 if wrong
│   │   ├── ownerApprovedGuard.ts     # check ownerApproved — 403 if false
│   │   ├── imageLimitGuard.ts        # resolve + check image limit
│   │   └── errorMiddleware.ts        # global Express error handler
│   ├── utils/
│   │   ├── asyncHandler.ts           # wraps async controllers — auto catches
│   │   ├── AppError.ts               # custom error (statusCode, code, message)
│   │   ├── responseHandler.ts        # sendSuccess() + sendError() helpers
│   │   ├── email.ts                  # Resend — send verification emails
│   │   ├── cloudinaryUtils.ts        # uploadImage() + deleteImage() helpers
│   │   └── tokenUtils.ts             # generate + hash verification tokens
│   ├── validations/                  # Zod request body schemas
│   │   ├── auth.validation.ts
│   │   ├── property.validation.ts
│   │   └── admin.validation.ts
│   ├── types/
│   │   ├── express.d.ts              # extend Request: add req.sessionUser
│   │   └── index.ts                  # IUser, IProperty, IApiResponse interfaces
│   └── index.ts                      # Express app entry point
├── .env
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 6. MongoDB Collections (Mongoose Schemas)

> All use `{ timestamps: true }` for `createdAt` / `updatedAt` unless noted.
> All IDs are MongoDB `ObjectId` (`_id`).

### `users` collection
```typescript
// Extended Auth.js user model — custom fields added
{
  _id: ObjectId,
  name: string,                  // required
  email: string,                 // required, unique, lowercase
  emailVerified: Date | null,    // null until verified; auto-set for Google
  image: string | null,          // Google profile picture URL

  // Custom fields (not in default Auth.js schema)
  passwordHash: string | null,   // bcrypt hash for email users; null for Google
  phone: string | null,          // required after complete-profile; null initially
  role: 'buyer' | 'owner' | 'admin',  // default: 'buyer'
  isActive: boolean,             // default: true; admin can set false to block
  isProfileComplete: boolean,    // default: false for Google; true for email reg
  ownerApproved: boolean,        // default: false; admin must approve for owners
  imageLimit: number | null,     // null = use globalImageLimit from settings
}

// Indexes:
// email: unique
// role: 1
// ownerApproved: 1
// isActive: 1
```

### `accounts` collection (Auth.js — auto-managed)
```typescript
// IMPORTANT: Only Google OAuth users get an entry here.
// Email/password users do NOT have an accounts document.
{
  _id: ObjectId,
  userId: ObjectId,              // ref: users
  type: 'oauth',
  provider: 'google',
  providerAccountId: string,
  access_token: string | null,
  refresh_token: string | null,
  expires_at: number | null,
  token_type: string | null,
  scope: string | null,
  id_token: string | null,
  session_state: string | null,
}

// Compound unique index: provider + providerAccountId
```

### `sessions` collection (Auth.js — auto-managed)
```typescript
{
  _id: ObjectId,
  sessionToken: string,          // unique; indexed with TTL
  userId: ObjectId,              // ref: users
  expires: Date,                 // TTL index — auto-deleted when expired
}
```

### `emailVerifications` collection (custom — NOT Auth.js)
```typescript
// ⚠️ This is OUR custom collection for email verification.
// Auth.js MongoDB adapter uses its own `verification_tokens` collection (snake_case)
// for Magic Links. Keep them separate to avoid conflicts.
{
  _id: ObjectId,
  email: string,                 // user's email address
  token: string,                 // raw token sent in email link (NOT stored)
  hashedToken: string,           // SHA-256 hash of token — stored in DB
  expires: Date,                 // 24 hours from creation
  createdAt: Date,
}

// Index: token (unique), email
// Never store the raw token — always hash before saving, compare hashes
```

### `properties` collection
```typescript
{
  _id: ObjectId,
  ownerId: ObjectId,             // ref: users (role=owner)
  title: string,                 // required
  description: string,           // required
  propertyType: 'house' | 'flat' | 'shop' | 'land',
  listingType: 'sale' | 'rent',
  bhk: number | null,            // 1-5; only for house/flat; null for shop/land
  areaSqft: number | null,       // optional
  price: number,                 // required, in INR
  city: string,                  // required (e.g. "Amreli")
  areaLocality: string,          // required (e.g. "Madhav Nagar")
  pincode: string,               // required
  contactPhone: string,          // shown directly to all visitors on detail page
  status: 'pending' | 'approved' | 'rejected' | 'hidden' | 'sold' | 'rented',
  rejectionNote: string | null,  // set by admin on reject; shown to owner
  images: Array<{                // embedded — max count = effective imageLimit
    imageUrl: string,            // Cloudinary secure_url
    cloudinaryPublicId: string,  // MUST store — used to delete from Cloudinary
    isPrimary: boolean,          // first image = true (shown in listing cards)
  }>,
  // ⚠️ Do NOT use nested `{ }` blocks for embedded arrays in Eraser ERD DSL
  // Represent in ERD as flat fields: images_imageUrl, images_cloudinaryPublicId, images_isPrimary
}

// Indexes:
// status: 1
// ownerId: 1
// Compound: { status: 1, city: 1, propertyType: 1, listingType: 1 }
// price: 1 (for sorting)
```

### `savedProperties` collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,              // ref: users (role=buyer)
  propertyId: ObjectId,          // ref: properties
  savedAt: Date,
}

// Compound UNIQUE index: { userId: 1, propertyId: 1 }
// Prevents duplicate saves
```

### `adminActions` collection (audit log)
```typescript
{
  _id: ObjectId,
  adminId: ObjectId,             // ref: users (role=admin)
  targetId: ObjectId,            // polymorphic: property _id OR user _id
  targetType: 'property' | 'user',
  action:
    | 'property_approved'
    | 'property_rejected'
    | 'property_hidden'
    | 'property_restored'
    | 'owner_approved'
    | 'user_deactivated'
    | 'user_activated'
    | 'image_limit_changed',
  note: string | null,           // required for property_rejected
  actedAt: Date,
}
```

### `settings` collection
```typescript
// Platform-wide configuration — seeded on first server start
{
  _id: ObjectId,
  key: string,                   // unique — e.g. 'globalImageLimit'
  value: any,                    // Mixed type
  updatedBy: ObjectId,           // ref: users (admin who last changed)
  updatedAt: Date,
}

// Seed: { key: 'globalImageLimit', value: 7 }
// Unique index: key
```

---

## 7. Authentication Flows

### A. Email Registration Flow
```
1. POST /api/auth/register { name, email, phone, password, role }
2. Server: validate → bcrypt hash password (10 rounds)
3. Create user: { emailVerified: null, isProfileComplete: true, ownerApproved: false }
4. Generate raw token: crypto.randomBytes(32).toString('hex')
5. Hash token: SHA-256 of raw token → store HASH in emailVerifications collection
6. Send email via Resend: link contains RAW token (never the hash)
7. Response 201: "Check your email to verify your account"
8. User clicks link: GET /api/auth/verify-email?token=<raw>
9. Server: hash the incoming token → find match in emailVerifications by hashedToken
10. Check not expired → set user.emailVerified = Date.now()
11. Delete emailVerifications record
12. User can now POST /api/auth/signin
```
> ⚠️ Our `emailVerifications` collection is separate from Auth.js's own `verification_tokens`
> collection (used internally for Magic Links). Never mix them.

### B. Google OAuth Flow
```
1. User clicks "Continue with Google"
2. GET /api/auth/signin/google → Auth.js redirects to Google
3. Google returns: name, email, image (emailVerified auto-set)
4. Auth.js creates user in MongoDB (or finds existing)
5. If isProfileComplete = false → redirect frontend to /complete-profile
6. POST /api/auth/complete-profile { phone, role }
7. Server: update user { phone, role, isProfileComplete: true }
8. If role = 'owner' → ownerApproved remains false → redirect to /owner/pending
9. If role = 'buyer' → redirect to /properties
```

### C. Owner Account Approval Flow
```
1. Owner registers (email or Google) → ownerApproved = false
2. Owner is shown /owner/pending page (cannot access dashboard)
3. Admin sees new owner in GET /api/admin/owners/pending
4. Admin clicks Approve → PUT /api/admin/owners/:id/approve
5. Server: set ownerApproved = true → log to adminActions
6. Owner can now access /owner/dashboard and post properties
```

### D. Middleware Chain (private routes)
```
Request
  → sessionGuard     (getSession → 401 if no session, 403 if isActive=false)
  → roleGuard(role)  (check session.user.role === required → 403 if wrong)
  → [ownerApprovedGuard] (if route needs ownerApproved → 403 if false)
  → [imageLimitGuard]    (resolve: user.imageLimit ?? globalLimit ?? 7)
  → controller
```

---

## 8. Standard API Response Format

**Every single API response must follow this exact structure.**

### Success Response
```typescript
interface SuccessResponse<T> {
  success: true
  message: string
  data: T | null
  meta?: {           // only for paginated list endpoints
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

### Error Response
```typescript
interface ErrorResponse {
  success: false
  message: string    // human-readable description
  error: {
    code: string     // machine-readable — use from list below
    details?: any    // Zod validation errors, etc.
  }
}
```

### Standard Error Codes
| Code | HTTP | When |
|------|------|------|
| `AUTH_REQUIRED` | 401 | No session cookie |
| `INVALID_CREDENTIALS` | 401 | Wrong email/password |
| `EMAIL_NOT_VERIFIED` | 401 | Email not confirmed yet |
| `ACCOUNT_DEACTIVATED` | 403 | Admin deactivated this user |
| `ACCESS_DENIED` | 403 | Wrong role for this route |
| `OWNER_NOT_APPROVED` | 403 | Owner pending admin approval |
| `PROFILE_INCOMPLETE` | 403 | Google user hasn't set role+phone |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `ALREADY_EXISTS` | 409 | Duplicate (email, saved property) |
| `VALIDATION_ERROR` | 422 | Zod schema validation failed |
| `IMAGE_LIMIT_EXCEEDED` | 400 | Too many images uploaded |
| `INTERNAL_ERROR` | 500 | Unexpected server error |

---

## 9. Utility Files (Backend — implement exactly as below)

### `utils/asyncHandler.ts`
```typescript
import { Request, Response, NextFunction, RequestHandler } from 'express'

const asyncHandler =
  (fn: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }

export default asyncHandler
```

### `utils/AppError.ts`
```typescript
class AppError extends Error {
  statusCode: number
  code: string
  isOperational: boolean

  constructor(message: string, statusCode: number, code: string) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

export default AppError
```

### `utils/responseHandler.ts`
```typescript
import { Response } from 'express'

interface Meta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data: T | null = null,
  statusCode = 200,
  meta?: Meta
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta && { meta }),
  })
}

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  code = 'INTERNAL_ERROR',
  details?: unknown
): void => {
  res.status(statusCode).json({
    success: false,
    message,
    error: { code, ...(details !== undefined && { details }) },
  })
}
```

### `middleware/errorMiddleware.ts`
```typescript
import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/AppError'

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: { code: err.code },
    })
    return
  }
  console.error('UNHANDLED ERROR:', err)
  res.status(500).json({
    success: false,
    message: 'Something went wrong. Please try again.',
    error: { code: 'INTERNAL_ERROR' },
  })
}

export default errorMiddleware
```

### `utils/email.ts` (Resend)
```typescript
import { Resend } from 'resend'
import { env } from '../config/env'

const resend = new Resend(env.RESEND_API_KEY)

export const sendVerificationEmail = async (
  to: string,
  name: string,
  token: string
): Promise<void> => {
  const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}`
  await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to,
    subject: 'Verify your BR-Homes account',
    html: `
      <h2>Welcome to BR-Homes, ${name}!</h2>
      <p>Click the link below to verify your email address:</p>
      <a href="${verifyUrl}" style="...">Verify Email</a>
      <p>This link expires in 24 hours.</p>
    `,
  })
}
```

---

## 10. API Endpoints Reference

> Full request body, response body, and status codes are in the Eraser API diagram.
> See: https://app.eraser.io/workspace/WvsqSbtOUSBZndwmn89b

### Auth Routes
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/auth/signin/google` | Public | Google OAuth — handled by Auth.js |
| POST | `/api/auth/signin` | Public | Email login — handled by Auth.js |
| POST | `/api/auth/signout` | Session | Sign out |
| GET | `/api/auth/session` | Any | Get current session |
| POST | `/api/auth/register` | Public | Email registration + send verify email |
| GET | `/api/auth/verify-email` | Public | Confirm email via token link |
| POST | `/api/auth/resend-verification` | Public | Resend verification email |
| POST | `/api/auth/complete-profile` | Session | Google users set role + phone |
| GET | `/api/auth/me` | Session | Get full user profile |

### Property Routes
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/properties` | Public | Browse approved listings (filterable + paginated) |
| GET | `/api/properties/:id` | Public | Property detail + owner phone number |
| POST | `/api/properties` | Owner ✓ Approved | Create listing → status: pending |
| PUT | `/api/properties/:id` | Owner (own) | Edit own property |
| PATCH | `/api/properties/:id/hide` | Owner (own) | Toggle hide/show |
| PATCH | `/api/properties/:id/mark` | Owner (own) | Mark as sold or rented |
| DELETE | `/api/properties/:id` | Owner (own) | Delete + remove all Cloudinary images |

### Owner Routes
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/owner/properties` | Owner | All own listings with status |
| GET | `/api/owner/stats` | Owner | Stats + effective image limit |

### Saved Routes
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/saved` | Buyer | All saved properties |
| POST | `/api/saved/:propertyId` | Buyer | Save a property |
| DELETE | `/api/saved/:propertyId` | Buyer | Remove from saved |

### Admin Routes
| Method | Path | Access | Description |
|--------|------|--------|-------------|
| GET | `/api/admin/stats` | Admin | Platform overview stats |
| GET | `/api/admin/owners/pending` | Admin | Owners awaiting approval |
| PUT | `/api/admin/owners/:id/approve` | Admin | Approve owner account |
| GET | `/api/admin/properties/pending` | Admin | Properties awaiting approval |
| PUT | `/api/admin/properties/:id/approve` | Admin | Approve property → goes live |
| PUT | `/api/admin/properties/:id/reject` | Admin | Reject with required note |
| GET | `/api/admin/properties` | Admin | All properties (filterable) |
| DELETE | `/api/admin/properties/:id` | Admin | Remove + delete Cloudinary images |
| GET | `/api/admin/users` | Admin | All users (filterable by role) |
| PATCH | `/api/admin/users/:id/deactivate` | Admin | Toggle user isActive |
| GET | `/api/admin/settings` | Admin | Get platform settings |
| PUT | `/api/admin/settings/image-limit` | Admin | Update global image limit |
| PUT | `/api/admin/users/:id/image-limit` | Admin | Override image limit per owner |

---

## 11. Zustand Stores

### `store/authStore.ts`
```typescript
import { create } from 'zustand'

interface SessionUser {
  id: string
  name: string
  email: string
  role: 'buyer' | 'owner' | 'admin'
  image: string | null
  isProfileComplete: boolean
  ownerApproved: boolean
  phone: string | null
}

interface AuthState {
  user: SessionUser | null
  isLoading: boolean
  isAuthenticated: boolean
  setUser: (user: SessionUser | null) => void
  setLoading: (loading: boolean) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}))
```

### `store/filterStore.ts`
```typescript
import { create } from 'zustand'

interface FilterState {
  city: string
  propertyType: '' | 'house' | 'flat' | 'shop' | 'land'
  listingType: '' | 'sale' | 'rent'
  bhk: '' | '1' | '2' | '3' | '4' | '5'
  minPrice: string
  maxPrice: string
  sort: 'newest' | 'price_asc' | 'price_desc'
  page: number
  setFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  resetFilters: () => void
}

const defaultFilters = {
  city: '', propertyType: '' as const, listingType: '' as const,
  bhk: '' as const, minPrice: '', maxPrice: '', sort: 'newest' as const, page: 1,
}

export const useFilterStore = create<FilterState>((set) => ({
  ...defaultFilters,
  setFilter: (key, value) => set({ [key]: value, page: 1 }),
  resetFilters: () => set(defaultFilters),
}))
```

### `store/uiStore.ts`
```typescript
import { create } from 'zustand'

interface UIState {
  isMobileMenuOpen: boolean
  isImageDialogOpen: boolean
  selectedImageIndex: number
  toggleMobileMenu: () => void
  openImageDialog: (index: number) => void
  closeImageDialog: () => void
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  isImageDialogOpen: false,
  selectedImageIndex: 0,
  toggleMobileMenu: () => set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen })),
  openImageDialog: (index) => set({ isImageDialogOpen: true, selectedImageIndex: index }),
  closeImageDialog: () => set({ isImageDialogOpen: false }),
}))
```

---

## 12. TanStack Query Setup

### `lib/queryClient.ts`
```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,  // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})
```

### Query Keys
```typescript
export const queryKeys = {
  properties: {
    all: ['properties'] as const,
    list: (filters: object) => ['properties', 'list', filters] as const,
    detail: (id: string) => ['properties', 'detail', id] as const,
  },
  owner: {
    properties: ['owner', 'properties'] as const,
    stats: ['owner', 'stats'] as const,
  },
  saved: { all: ['saved'] as const },
  admin: {
    stats: ['admin', 'stats'] as const,
    pendingOwners: ['admin', 'owners', 'pending'] as const,
    pendingProperties: ['admin', 'properties', 'pending'] as const,
    allProperties: (f: object) => ['admin', 'properties', f] as const,
    allUsers: (f: object) => ['admin', 'users', f] as const,
    settings: ['admin', 'settings'] as const,
  },
}
```

---

## 13. TypeScript Types

### `types/index.ts` (shared — use in both frontend and backend)
```typescript
export interface IUser {
  _id: string
  name: string
  email: string
  emailVerified: string | null
  image: string | null
  phone: string | null
  role: 'buyer' | 'owner' | 'admin'
  isActive: boolean
  isProfileComplete: boolean
  ownerApproved: boolean
  imageLimit: number | null
  createdAt: string
}

export interface IPropertyImage {
  imageUrl: string
  cloudinaryPublicId: string
  isPrimary: boolean
}

export type PropertyType = 'house' | 'flat' | 'shop' | 'land'
export type ListingType = 'sale' | 'rent'
export type PropertyStatus = 'pending' | 'approved' | 'rejected' | 'hidden' | 'sold' | 'rented'

export interface IProperty {
  _id: string
  ownerId: string
  title: string
  description: string
  propertyType: PropertyType
  listingType: ListingType
  bhk: number | null
  areaSqft: number | null
  price: number
  city: string
  areaLocality: string
  pincode: string
  contactPhone: string
  status: PropertyStatus
  rejectionNote: string | null
  images: IPropertyImage[]
  createdAt: string
  updatedAt: string
  owner?: Pick<IUser, 'name' | 'phone'>  // populated on detail endpoint
}

export interface IApiResponse<T> {
  success: boolean
  message: string
  data: T | null
  error?: { code: string; details?: unknown }
  meta?: { total: number; page: number; limit: number; totalPages: number }
}
```

---

## 14. UI/UX Guidelines

### Design Principles
- **Minimal** — white space is intentional; no visual clutter
- **Mobile-first** — design for 375px width first, then tablet (768px), then desktop (1280px)
- **Fast** — skeleton loaders on every list/detail, lazy-load images, TanStack Query caching
- **Accessible** — aria-label on icon buttons, proper heading hierarchy, sufficient color contrast

### Color Palette (Tailwind classes)
| Use | Class |
|-----|-------|
| Primary text / buttons | `slate-900` |
| Secondary text | `slate-500` |
| Available badge | `emerald-600` bg `emerald-50` |
| Pending badge | `amber-600` bg `amber-50` |
| Rejected badge | `red-600` bg `red-50` |
| Page background | `slate-50` |
| Card background | `white` |
| Border | `slate-200` |
| Price text | `slate-900 font-semibold` |

### shadcn/ui — Install Only These Components
```bash
npx shadcn@latest init
npx shadcn@latest add button input card badge dialog select skeleton sonner
```
> Do NOT install other components unless explicitly needed. Keep the bundle lean.

### Property Card
- Image: `aspect-video`, `object-cover`, `loading="lazy"`
- Show: primary image, title (1 line truncate), formatted price, type badge, BHK (if applicable), city
- Grid: 1 col mobile → 2 col tablet → 3 col desktop (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`)
- No status badge for public view; show status badge only to owner in their dashboard

### Navigation
| State | Links shown |
|-------|------------|
| Logged out | Logo · Browse · Login · Register |
| Buyer | Logo · Browse · Saved · Avatar menu |
| Owner | Logo · Dashboard · Browse · Avatar menu |
| Admin | Logo · Admin Panel · Avatar menu |

- Mobile: hamburger → full-screen overlay menu (keep it simple)
- Desktop: horizontal sticky navbar, max-width container, shadow on scroll

### Forms
- Labels above inputs (not placeholder-only)
- Inline validation errors below each field (red text, `text-sm`)
- Submit button: disabled + shows spinner while submitting
- Required fields marked with `*`
- Image upload: show thumbnail preview before submitting

### Loading States
- Use `<LoadingSkeleton />` (shadcn Skeleton) for every page that fetches data
- Never show blank white screen while loading
- Error state: show friendly message + retry button

---

## 15. Environment Variables

### Frontend — `.env`
```env
VITE_API_URL=http://localhost:5000
```

### Backend — `.env`
```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB Atlas
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/br-homes?retryWrites=true&w=majority

# Auth.js
AUTH_SECRET=<generate with: openssl rand -base64 32>
AUTH_URL=http://localhost:5000

# Google OAuth (console.cloud.google.com)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Cloudinary (cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend (resend.com — free tier)
RESEND_API_KEY=re_xxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

---

## 16. Key Business Rules

1. **Owner must be admin-approved** before they can post any property
2. **Every property** starts as `pending` — admin must approve before it's visible to public
3. **Email users** must verify their email before they can sign in
4. **Google users** must complete their profile (role + phone) on first sign-in
5. **Owner phone** (`contactPhone`) is shown to all visitors on property detail — no DM system
6. **Image limit** resolution order: `user.imageLimit ?? settings.globalImageLimit ?? 7`
7. **Admin account** is created directly in MongoDB — no public registration path for admin
8. **Buyers** can only save properties (login required); no other actions
9. **Rejected property** stores `rejectionNote` on the property document — owner can see it
10. **Deleted property** MUST delete all images from Cloudinary using `cloudinaryPublicId` before removing DB record
11. **Deactivated user** is blocked at `sessionGuard` — returns `ACCOUNT_DEACTIVATED`
12. **`bhk` field** only applies to `house` and `flat`; must be `null` for `shop` and `land`
13. **`savedProperties`** has a compound unique index — server returns `ALREADY_EXISTS` on duplicate save
14. **Admin is pre-created** in the database; the `ownerApproved` field is `true` by default for admin

---

## 17. Deployment Checklist

### Frontend (Vercel)
- [ ] Push `br-homes-client/` to GitHub
- [ ] Import repo in Vercel dashboard
- [ ] Set `VITE_API_URL` to Railway backend URL
- [ ] Deploy

### Backend (Railway)
- [ ] Push `br-homes-server/` to GitHub
- [ ] Create Railway project → connect repo
- [ ] Set all `.env` variables in Railway Variables tab
- [ ] Set `CLIENT_URL` to Vercel frontend URL
- [ ] Set `AUTH_URL` to Railway backend URL
- [ ] Deploy → Railway auto-builds with `npm run build && npm start`

### MongoDB Atlas
- [ ] Create free M0 cluster
- [ ] Create DB user + get connection string
- [ ] Network access: add Railway IP (or `0.0.0.0/0` for simplicity)
- [ ] On first server start, seed `settings` collection: `{ key: 'globalImageLimit', value: 7 }`
- [ ] Manually create admin user in `users` collection: set `role: 'admin'`, `isActive: true`, `ownerApproved: true`, `isProfileComplete: true`, `emailVerified: <date>`

### Google OAuth (console.cloud.google.com)
- [ ] Create OAuth 2.0 credentials
- [ ] Add authorized redirect URIs:
  - `http://localhost:5000/api/auth/callback/google` (dev)
  - `https://your-railway-url/api/auth/callback/google` (prod)

### Cloudinary
- [ ] Create free account
- [ ] Create an upload preset named `br-homes` (unsigned, for direct upload)
- [ ] Note: cloud name, API key, API secret

### Resend
- [ ] Create free account at resend.com
- [ ] Add + verify your sending domain (or use `onboarding@resend.dev` for testing)
- [ ] Get API key

---

## 18. Development Setup

### Start Frontend
```bash
cd br-homes-client
npm install
npm run dev   # runs at http://localhost:5173
```

### Start Backend
```bash
cd br-homes-server
npm install
npm run dev   # tsx watch src/index.ts — runs at http://localhost:5000
```

### Backend `package.json` scripts
```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "rimraf dist && tsc",
    "start": "node dist/index.js"
  }
}
```

---

## 19. Key Configuration Files

### Backend — `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Frontend — `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Frontend — `vite.config.ts`
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Frontend — `tailwind.config.ts`
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
```

### Backend — `src/config/env.ts`
```typescript
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  CLIENT_URL: z.string().url(),
  MONGODB_URI: z.string().min(1),
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  RESEND_API_KEY: z.string().startsWith('re_'),
  RESEND_FROM_EMAIL: z.string().email(),
})

export const env = envSchema.parse(process.env)
// Throws on startup if any required var is missing — fail fast
```

---

## 20. Auth.js Express Setup

### `src/config/auth.ts`
```typescript
import { ExpressAuth } from '@auth/express'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import Google from '@auth/express/providers/google'
import Credentials from '@auth/express/providers/credentials'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.model'
import { env } from './env'

// Cached config — set once after mongoose.connect() in index.ts
let _authConfig: ReturnType<typeof buildAuthConfig> | null = null

const buildAuthConfig = () => ({
  secret: env.AUTH_SECRET,
  trustHost: true,

  // ⚠️ @auth/mongodb-adapter uses snake_case collection names:
  //   users, accounts, sessions, verification_tokens
  // Our custom email verification uses a SEPARATE emailVerifications collection
  adapter: MongoDBAdapter(mongoose.connection.getClient() as any),

  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),

    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await User.findOne({ email: credentials.email }).lean()
        if (!user || !user.passwordHash) return null
        if (!user.isActive) throw new Error('ACCOUNT_DEACTIVATED')
        if (!user.emailVerified) throw new Error('EMAIL_NOT_VERIFIED')

        const valid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!valid) return null

        return { id: user._id.toString(), name: user.name, email: user.email, image: user.image ?? null }
      },
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      const dbUser = await User.findById(user.id).lean()
      if (dbUser && session.user) {
        ;(session.user as any).id = dbUser._id.toString()
        ;(session.user as any).role = dbUser.role
        ;(session.user as any).phone = dbUser.phone ?? null
        ;(session.user as any).isActive = dbUser.isActive
        ;(session.user as any).isProfileComplete = dbUser.isProfileComplete
        ;(session.user as any).ownerApproved = dbUser.ownerApproved
      }
      return session
    },
  },

  pages: { signIn: '/login', error: '/login' },
})

// Call this ONCE after mongoose.connect() resolves — see index.ts
export const initAuthConfig = () => {
  _authConfig = buildAuthConfig()
  return ExpressAuth(_authConfig)   // returns the Express middleware (authHandler)
}

// Used by sessionGuard and other middleware to read the config
export const getAuthConfig = () => {
  if (!_authConfig) throw new Error('Auth config not initialized. Call initAuthConfig() first.')
  return _authConfig
}
```

### `src/types/express.d.ts`
```typescript
// Extend Express Request to carry session user
import 'express'

declare module 'express' {
  interface Request {
    sessionUser?: {
      id: string
      name: string
      email: string
      role: 'buyer' | 'owner' | 'admin'
      image: string | null
      phone: string | null
      isActive: boolean
      isProfileComplete: boolean
      ownerApproved: boolean
    }
  }
}
```

### `src/middleware/sessionGuard.ts`
```typescript
import { Request, Response, NextFunction } from 'express'
import { getSession } from '@auth/express'
import AppError from '../utils/AppError'

// ⚠️ Import the live authConfig reference set after mongoose connects in index.ts
// We use a lazy getter so this file doesn't import mongoose at module load time
import { getAuthConfig } from '../config/auth'

const sessionGuard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const session = await getSession(req, getAuthConfig())

  if (!session?.user) {
    return next(new AppError('Authentication required', 401, 'AUTH_REQUIRED'))
  }
  if (!(session.user as any).isActive) {
    return next(new AppError('Your account has been deactivated', 403, 'ACCOUNT_DEACTIVATED'))
  }
  if (!(session.user as any).isProfileComplete) {
    return next(new AppError('Please complete your profile first', 403, 'PROFILE_INCOMPLETE'))
  }

  req.sessionUser = session.user as Request['sessionUser']
  next()
}

export default sessionGuard
```

### `src/middleware/roleGuard.ts`
```typescript
import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/AppError'

const roleGuard = (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.sessionUser || !roles.includes(req.sessionUser.role)) {
      return next(new AppError('Access denied', 403, 'ACCESS_DENIED'))
    }
    next()
  }

export default roleGuard
```

### `src/middleware/ownerApprovedGuard.ts`
```typescript
import { Request, Response, NextFunction } from 'express'
import AppError from '../utils/AppError'

const ownerApprovedGuard = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.sessionUser?.ownerApproved) {
    return next(
      new AppError('Your owner account is pending admin approval', 403, 'OWNER_NOT_APPROVED')
    )
  }
  next()
}

export default ownerApprovedGuard
```

### `src/index.ts` (Express entry point)
```typescript
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import { env } from './config/env'
import { initAuthConfig } from './config/auth'   // ← lazy init after DB connect
import errorMiddleware from './middleware/errorMiddleware'
import authRoutes from './routes/auth.routes'
import propertyRoutes from './routes/property.routes'
import ownerRoutes from './routes/owner.routes'
import savedRoutes from './routes/saved.routes'
import adminRoutes from './routes/admin.routes'

const app = express()

app.use(helmet())
app.use(cors({ origin: env.CLIENT_URL, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if (env.NODE_ENV === 'development') app.use(morgan('dev'))

const start = async () => {
  // 1. Connect DB first — adapter needs live MongoClient
  await mongoose.connect(env.MONGODB_URI)
  console.log('✅ MongoDB connected')

  // 2. Init Auth.js AFTER DB is connected — returns Express middleware
  const authHandler = initAuthConfig()
  app.use('/api/auth', authHandler)            // Auth.js built-in routes

  // 3. Custom app routes
  app.use('/api/auth', authRoutes)             // register, verify-email, complete-profile
  app.use('/api/properties', propertyRoutes)
  app.use('/api/owner', ownerRoutes)
  app.use('/api/saved', savedRoutes)
  app.use('/api/admin', adminRoutes)

  // 4. Global error handler — always last
  app.use(errorMiddleware)

  // 5. Seed default settings
  await seedSettings()

  app.listen(env.PORT, () =>
    console.log(`🚀 Server running on http://localhost:${env.PORT}`)
  )
}

const seedSettings = async () => {
  const Setting = (await import('./models/Setting.model')).default
  await Setting.findOneAndUpdate(
    { key: 'globalImageLimit' },
    { $setOnInsert: { key: 'globalImageLimit', value: 7, updatedAt: new Date() } },
    { upsert: true, new: true }
  )
  console.log('✅ Settings seeded')
}

start().catch((err) => {
  console.error('❌ Failed to start server:', err)
  process.exit(1)
})
```

---

## 21. Key Frontend Setup

### `src/lib/axios.ts`
```typescript
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,  // CRITICAL — sends Auth.js session cookie
  headers: { 'Content-Type': 'application/json' },
})

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const code = error.response?.data?.error?.code
    if (code === 'AUTH_REQUIRED') {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
```

### `src/router/index.tsx`
```typescript
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'
// ... import all pages

const router = createBrowserRouter([
  {
    element: <MainLayout><Outlet /></MainLayout>,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/properties', element: <ListingsPage /> },
      { path: '/properties/:id', element: <PropertyDetailPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/verify-email', element: <VerifyEmailPage /> },
      {
        path: '/complete-profile',
        element: <ProtectedRoute requireAuth><CompleteProfilePage /></ProtectedRoute>,
      },
      {
        path: '/saved',
        element: <ProtectedRoute roles={['buyer']}><SavedPage /></ProtectedRoute>,
      },
      {
        path: '/owner',
        element: <ProtectedRoute roles={['owner']} requireOwnerApproved><Outlet /></ProtectedRoute>,
        children: [
          { path: 'dashboard', element: <OwnerDashboardPage /> },
          { path: 'properties', element: <OwnerPropertiesPage /> },
          { path: 'properties/new', element: <AddPropertyPage /> },
          { path: 'properties/:id/edit', element: <EditPropertyPage /> },
        ],
      },
      {
        path: '/owner/pending',
        element: <ProtectedRoute roles={['owner']}><OwnerPendingPage /></ProtectedRoute>,
      },
      {
        path: '/admin',
        element: <ProtectedRoute roles={['admin']}><Outlet /></ProtectedRoute>,
        children: [
          { path: '', element: <AdminDashboardPage /> },
          { path: 'owners/pending', element: <PendingOwnersPage /> },
          { path: 'pending', element: <PendingPropertiesPage /> },
          { path: 'properties', element: <ManagePropertiesPage /> },
          { path: 'users', element: <ManageUsersPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])

export default function AppRouter() {
  return <RouterProvider router={router} />
}
```

### `src/components/common/ProtectedRoute.tsx`
```typescript
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface Props {
  children: React.ReactNode
  roles?: ('buyer' | 'owner' | 'admin')[]
  requireAuth?: boolean
  requireOwnerApproved?: boolean
}

export default function ProtectedRoute({
  children,
  roles,
  requireOwnerApproved = false,
}: Props) {
  const { user, isLoading } = useAuthStore()

  if (isLoading) return <LoadingSkeleton />       // wait for session check
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  if (requireOwnerApproved && !user.ownerApproved) {
    return <Navigate to="/owner/pending" replace />
  }

  return <>{children}</>
}
```

### `src/App.tsx` — session bootstrap on load
```typescript
import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import api from '@/lib/axios'
import AppRouter from '@/router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/queryClient'
import { Toaster } from '@/components/ui/sonner'

export default function App() {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // Check session on every app load
    api.get('/api/auth/session')
      .then(({ data }) => setUser(data?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  )
}
```

---

## 22. Image Upload Implementation

### Backend — `src/utils/cloudinaryUtils.ts`
```typescript
import { v2 as cloudinary } from 'cloudinary'
import { env } from '../config/env'

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
})

export interface UploadedImage {
  imageUrl: string
  cloudinaryPublicId: string
}

export const uploadImage = async (buffer: Buffer, folder = 'br-homes'): Promise<UploadedImage> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', quality: 'auto', fetch_format: 'auto' },
      (error, result) => {
        if (error || !result) return reject(error)
        resolve({ imageUrl: result.secure_url, cloudinaryPublicId: result.public_id })
      }
    )
    stream.end(buffer)
  })
}

export const deleteImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId)
}

export const deleteImages = async (publicIds: string[]): Promise<void> => {
  await Promise.all(publicIds.map(deleteImage))
}
```

### Backend — `src/middleware/imageLimitGuard.ts`
```typescript
import { Request, Response, NextFunction } from 'express'
import User from '../models/User.model'
import Setting from '../models/Setting.model'
import AppError from '../utils/AppError'

const imageLimitGuard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const files = req.files as Express.Multer.File[] | undefined
  if (!files || files.length === 0) return next()

  const owner = await User.findById(req.sessionUser!.id).lean()
  const globalSetting = await Setting.findOne({ key: 'globalImageLimit' }).lean()

  const limit: number = owner?.imageLimit ?? globalSetting?.value ?? 7

  if (files.length > limit) {
    return next(new AppError(`Maximum ${limit} images allowed`, 400, 'IMAGE_LIMIT_EXCEEDED'))
  }

  // Attach resolved limit to request for controller use
  ;(req as any).imageLimit = limit
  next()
}

export default imageLimitGuard
```

---

## 23. Mongoose Model Examples

### `src/models/User.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface IUserDocument extends Document {
  name: string
  email: string
  emailVerified: Date | null
  image: string | null
  passwordHash: string | null
  phone: string | null
  role: 'buyer' | 'owner' | 'admin'
  isActive: boolean
  isProfileComplete: boolean
  ownerApproved: boolean
  imageLimit: number | null
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    emailVerified: { type: Date, default: null },
    image: { type: String, default: null },
    passwordHash: { type: String, default: null },
    phone: { type: String, default: null },
    role: { type: String, enum: ['buyer', 'owner', 'admin'], default: 'buyer' },
    isActive: { type: Boolean, default: true },
    isProfileComplete: { type: Boolean, default: false },
    ownerApproved: { type: Boolean, default: false },
    imageLimit: { type: Number, default: null },
  },
  { timestamps: true }
)

UserSchema.index({ role: 1 })
UserSchema.index({ ownerApproved: 1 })
UserSchema.index({ isActive: 1 })

export default mongoose.model<IUserDocument>('User', UserSchema)
```

### `src/models/Property.model.ts`
```typescript
import mongoose, { Schema, Document } from 'mongoose'

const ImageSchema = new Schema({
  imageUrl: { type: String, required: true },
  cloudinaryPublicId: { type: String, required: true },
  isPrimary: { type: Boolean, default: false },
}, { _id: false })

export interface IPropertyDocument extends Document {
  ownerId: mongoose.Types.ObjectId
  title: string
  description: string
  propertyType: 'house' | 'flat' | 'shop' | 'land'
  listingType: 'sale' | 'rent'
  bhk: number | null
  areaSqft: number | null
  price: number
  city: string
  areaLocality: string
  pincode: string
  contactPhone: string
  status: 'pending' | 'approved' | 'rejected' | 'hidden' | 'sold' | 'rented'
  rejectionNote: string | null
  images: Array<{ imageUrl: string; cloudinaryPublicId: string; isPrimary: boolean }>
}

const PropertySchema = new Schema<IPropertyDocument>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    propertyType: { type: String, enum: ['house', 'flat', 'shop', 'land'], required: true },
    listingType: { type: String, enum: ['sale', 'rent'], required: true },
    bhk: { type: Number, default: null },
    areaSqft: { type: Number, default: null },
    price: { type: Number, required: true },
    city: { type: String, required: true },
    areaLocality: { type: String, required: true },
    pincode: { type: String, required: true },
    contactPhone: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'hidden', 'sold', 'rented'],
      default: 'pending',
    },
    rejectionNote: { type: String, default: null },
    images: { type: [ImageSchema], default: [] },
  },
  { timestamps: true }
)

// Compound index for filtered browse queries
PropertySchema.index({ status: 1, city: 1, propertyType: 1, listingType: 1 })
PropertySchema.index({ ownerId: 1 })
PropertySchema.index({ price: 1 })

export default mongoose.model<IPropertyDocument>('Property', PropertySchema)
```

### `src/models/SavedProperty.model.ts`
```typescript
import mongoose, { Schema } from 'mongoose'

const SavedPropertySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    savedAt: { type: Date, default: Date.now },
  }
)

// Prevent duplicate saves
SavedPropertySchema.index({ userId: 1, propertyId: 1 }, { unique: true })

export default mongoose.model('SavedProperty', SavedPropertySchema)
```

### `src/models/EmailVerification.model.ts`
```typescript
// ⚠️ This is OUR custom collection — separate from Auth.js's verification_tokens
import mongoose, { Schema, Document } from 'mongoose'

export interface IEmailVerification extends Document {
  email: string
  token: string          // unique raw token (NOT stored — only for index)
  hashedToken: string    // SHA-256 hash — what's stored and compared
  expires: Date
  createdAt: Date
}

const EmailVerificationSchema = new Schema<IEmailVerification>(
  {
    email: { type: String, required: true, lowercase: true },
    token: { type: String, required: true, unique: true },
    hashedToken: { type: String, required: true },
    expires: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
)

// TTL index — MongoDB auto-deletes expired records
EmailVerificationSchema.index({ expires: 1 }, { expireAfterSeconds: 0 })

export default mongoose.model<IEmailVerification>('EmailVerification', EmailVerificationSchema)
```

### `src/utils/tokenUtils.ts`
```typescript
import crypto from 'crypto'
import EmailVerification from '../models/EmailVerification.model'

export const generateVerificationToken = async (email: string): Promise<string> => {
  // Generate raw token — sent in email link
  const rawToken = crypto.randomBytes(32).toString('hex')
  // Hash it — only hash goes into DB (prevents DB leak = token theft)
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

  // Remove any existing token for this email first
  await EmailVerification.deleteMany({ email })

  await EmailVerification.create({
    email,
    token: rawToken,           // stored for unique index, not for comparison
    hashedToken,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  })

  return rawToken   // return RAW — sent in email URL
}

export const verifyEmailToken = async (rawToken: string): Promise<string | null> => {
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

  const record = await EmailVerification.findOne({
    hashedToken,
    expires: { $gt: new Date() },   // not expired
  })

  if (!record) return null

  const email = record.email
  await record.deleteOne()   // one-time use — delete after success

  return email
}
```

---

## 24. Important Implementation Notes

1. **`withCredentials: true`** must be set on Axios — without it, Auth.js session cookies won't be sent cross-origin.

2. **CORS `credentials: true`** must be set on Express, and `origin` must be the **exact** frontend URL (not `*`). Using `*` with credentials will throw a browser CORS error.

3. **Auth.js init order** in `index.ts`:
   - Step 1: `await mongoose.connect()` — DB must be open
   - Step 2: `const authHandler = initAuthConfig()` — creates adapter using live MongoClient
   - Step 3: `app.use('/api/auth', authHandler)` — mount Auth.js routes
   - Never call `initAuthConfig()` at module load time (before DB connects)

4. **Auth.js collection names** (managed automatically by `@auth/mongodb-adapter`):
   - `users`, `accounts`, `sessions`, `verification_tokens` (snake_case)
   - Our custom email verification uses `emailverifications` (Mongoose model `EmailVerification`)
   - These never conflict

5. **Email verification token** — never store the raw token. Store only the SHA-256 hash. Send the raw token in the email link. On verify, hash the incoming token and compare hashes in DB.

6. **Google OAuth redirect URI** must exactly match what's registered in Google Cloud Console:
   - Dev: `http://localhost:5000/api/auth/callback/google`
   - Prod: `https://your-railway-url.railway.app/api/auth/callback/google`

7. **Multer memory storage** stores files as `Buffer` in `req.files`. Pass the buffer directly to Cloudinary's upload stream — never write to disk (Railway is ephemeral).

8. **`bcrypt` rounds**: Use 10 rounds (`bcrypt.hash(password, 10)`). Never store plain text passwords.

9. **Admin user creation** — run this once in MongoDB Atlas Query editor:
   ```javascript
   // First generate bcrypt hash using: node -e "require('bcryptjs').hash('yourpassword',10).then(console.log)"
   db.users.insertOne({
     name: "Admin",
     email: "admin@brhomes.in",
     passwordHash: "<bcrypt hash>",
     emailVerified: new Date(),
     role: "admin",
     isActive: true,
     isProfileComplete: true,
     ownerApproved: true,
     phone: "9999999999",
     imageLimit: null,
     image: null,
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

10. **TanStack Query invalidation** — after any mutation call `queryClient.invalidateQueries({ queryKey: queryKeys.xxx })` to automatically refetch fresh data.

11. **`bhk` field** — always set to `null` on the server if `propertyType` is `shop` or `land`, regardless of what the client sends. Validate this in the Zod schema too.

12. **`getAuthConfig()` in sessionGuard** — always calls the cached config, never rebuilds it. The config is built once in `initAuthConfig()` and reused for every request.

13. **Settings seed** — `seedSettings()` uses `$setOnInsert` with upsert, so it's safe to run on every server start. Only inserts if the key doesn't already exist.

14. **Property deletion flow**:
    ```
    1. Find property → get all cloudinaryPublicId values from images array
    2. Call deleteImages(publicIds) → Cloudinary API
    3. Only if Cloudinary succeeds → delete from MongoDB
    4. If Cloudinary fails → return error, DO NOT delete from DB
    ```

15. **Rejected properties** — store `rejectionNote` directly on the property document so the owner can read it in their dashboard without a separate query to adminActions.

16. **Session callback performance** — the `session` callback queries MongoDB on every authenticated request. For a city-level startup with low traffic this is fine. At scale, cache the user fields in the session JWT instead.

---

## 25. Eraser ERD — Manual Paste (Corrected DSL)

> Eraser's MCP hit its rate limit. Paste the DSL below manually into your Eraser ERD file.
> Open https://app.eraser.io/workspace/ACIJ0U6jQYs17am3kpQ8 → click the diagram → press Ctrl+` (backtick) to open the code editor → replace all content with the DSL below → press Enter to render.

```
typeface:clean
colorMode:pastel

title BR-Homes - MongoDB Schema (Mongoose ODM)

users [icon: user, color: blue] {
  _id ObjectId pk
  name String required
  email String unique required
  emailVerified Date nullable
  image String nullable
  passwordHash String nullable
  phone String nullable
  role String enum(buyer,owner,admin) default(buyer)
  isActive Boolean default(true)
  isProfileComplete Boolean default(false)
  ownerApproved Boolean default(false)
  imageLimit Number nullable
  createdAt Date
  updatedAt Date
}

accounts [icon: link, color: orange] {
  _id ObjectId pk
  userId ObjectId fk
  type String required
  provider String required
  providerAccountId String required
  access_token String nullable
  refresh_token String nullable
  expires_at Number nullable
  id_token String nullable
  session_state String nullable
}

sessions [icon: clock, color: orange] {
  _id ObjectId pk
  sessionToken String unique required
  userId ObjectId fk
  expires Date required
}

emailVerifications [icon: mail, color: purple] {
  _id ObjectId pk
  email String required
  token String unique required
  hashedToken String required
  expires Date required
  createdAt Date
}

properties [icon: home, color: green] {
  _id ObjectId pk
  ownerId ObjectId fk
  title String required
  description String required
  propertyType String enum(house,flat,shop,land) required
  listingType String enum(sale,rent) required
  bhk Number nullable
  areaSqft Number nullable
  price Number required
  city String required
  areaLocality String required
  pincode String required
  contactPhone String required
  status String enum(pending,approved,rejected,hidden,sold,rented) default(pending)
  rejectionNote String nullable
  images_imageUrl String embedded
  images_cloudinaryPublicId String embedded
  images_isPrimary Boolean embedded
  createdAt Date
  updatedAt Date
}

savedProperties [icon: bookmark, color: yellow] {
  _id ObjectId pk
  userId ObjectId fk
  propertyId ObjectId fk
  savedAt Date default(now)
}

adminActions [icon: shield, color: red] {
  _id ObjectId pk
  adminId ObjectId fk
  targetId ObjectId polymorphic
  targetType String enum(property,user)
  action String enum(property_approved,property_rejected,property_hidden,property_restored,owner_approved,user_deactivated,user_activated,image_limit_changed)
  note String nullable
  actedAt Date default(now)
}

settings [icon: settings, color: purple] {
  _id ObjectId pk
  key String unique required
  value Mixed required
  updatedBy ObjectId fk
  updatedAt Date default(now)
}

users._id < accounts.userId
users._id < sessions.userId
users._id < properties.ownerId
users._id < savedProperties.userId
users._id < adminActions.adminId
users._id < settings.updatedBy
properties._id < savedProperties.propertyId
properties._id < adminActions.targetId
```

### What was fixed vs the broken version:
| Problem | Fix |
|---------|-----|
| Floating `updatedAt`/`createdAt` boxes | Removed nested `{ }` block inside `images Array embedded` — caused parser to treat it as a new entity |
| No connection lines between tables | Removed group wrappers (Auth.js Collections / App Collections) — groups block ERD relationship rendering in Eraser |
| `verificationTokens` conflict | Renamed to `emailVerifications` — Auth.js adapter manages its own `verification_tokens` (snake_case) separately |
| `settings` floating alone | Added `users._id < settings.updatedBy` relationship |
| Embedded images | Represented as flat fields: `images_imageUrl`, `images_cloudinaryPublicId`, `images_isPrimary` |