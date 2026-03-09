# Item Store

A modern Angular ecommerce application built with Angular 21, featuring a fully standalone component architecture, zoneless change detection, and reactive state management via signals.

## Tech Stack

- **Framework:** Angular 21 (standalone, zoneless)
- **State:** Angular Signals + Signal Store
- **Styling:** SCSS
- **Tables:** AG Grid
- **Auth:** JWT + ngx-cookie-service
- **Testing:** Vitest
- **Linting:** ESLint + angular-eslint + typescript-eslint

## Prerequisites

- Node.js 20+
- npm 10+
- Angular CLI 21: `npm install -g @angular/cli`

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
ng serve
```

Navigate to `http://localhost:4200/`. The app reloads automatically on file changes.

## Available Scripts

| Command | Description |
|---|---|
| `ng serve` | Start local dev server |
| `ng build` | Production build (outputs to `dist/`) |
| `ng test` | Run unit tests with Vitest |
| `ng lint` | Run ESLint across all TypeScript and HTML files |
| `ng generate component <name>` | Scaffold a new standalone component |

## Project Structure

```
src/
├── main.ts
├── index.html
├── styles.scss
└── app/
    ├── app.ts
    ├── app.config.ts
    ├── app.routes.ts
    ├── core/
    │   └── auth/
    │       ├── Interfaces/          # AuthError, Login, Signup, Resp, EditResp
    │       ├── auth-service.ts
    │       ├── auth-interceptor.ts
    │       ├── auth-guard.ts
    │       └── admin.guard.ts
    ├── pages/
    │   ├── home/
    │   │   └── components/
    │   │       ├── hero-carousel/
    │   │       └── products-toolbar/
    │   │           ├── toolbar-categories/
    │   │           └── toolbar-select/
    │   ├── about/
    │   ├── search/
    │   ├── cart/
    │   │   └── components/
    │   │       ├── cart-table/
    │   │       │   └── cart-product-card/
    │   │       │       └── bin-button/
    │   │       └── order-summary/
    │   ├── product-detail/
    │   │   └── components/detail-product-card/
    │   ├── profile/
    │   │   └── components/profile-edit/
    │   ├── login/
    │   ├── signup/
    │   └── admin/
    │       └── components/
    │           ├── products-dashboard/
    │           ├── product-form-modal/
    │           ├── delete-button-renderer/
    │           └── admin-sidebar/
    └── shared/
        ├── interfaces/              # product.ts, user.ts
        ├── services/                # products, cart.store, orders, nav, auth-modal
        └── components/
            ├── ui-navbar/
            │   ├── navbar-cart/
            │   ├── navbar-link/
            │   ├── navbar-pfp/
            │   └── navbar-search/
            ├── ui-footer/
            │   ├── footer-bottom/
            │   ├── footer-link-col/
            │   ├── footer-socials/
            │   └── footer-support/
            ├── visible-products/
            │   ├── products-grid/
            │   │   └── product-card/
            │   └── products-toolbar/
            │       ├── toolbar-categories/
            │       └── toolbar-select/
            ├── ui-modal/
            ├── ui-button/
            ├── ui-input/
            ├── ui-pill/
            ├── ui-counter-pill/
            │   ├── counter-btn/
            │   └── counter-value/
            ├── ui-breadcrumb/
            ├── page-sidebar/
            └── logo/
```

## Architecture Conventions

- All components are **standalone** with `OnPush` change detection
- **No NgModules** — routing is configured per feature via `routes.ts`
- Dependencies injected via `inject()` — no constructor injection
- Reactive state managed with **signals** — no RxJS Subjects or `.subscribe()`
- No lifecycle hooks (`ngOnInit` etc.) — effects and computed values used instead
- Forms use typed reactive forms only

## Building for Production

```bash
ng build
```

Build artifacts are output to the `dist/` directory, optimized for performance.

## Running Tests

```bash
ng test
```

Unit tests are powered by [Vitest](https://vitest.dev/) with jsdom.

## Linting

```bash
ng lint
```

ESLint is configured with `angular-eslint` and `typescript-eslint`. All rules pass with zero errors.