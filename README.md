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

| Command                        | Description                                     |
| ------------------------------ | ----------------------------------------------- |
| `ng serve`                     | Start local dev server                          |
| `ng build`                     | Production build (outputs to `dist/`)           |
| `ng test`                      | Run unit tests with Vitest                      |
| `ng lint`                      | Run ESLint across all TypeScript and HTML files |
| `ng generate component <name>` | Scaffold a new standalone component             |

## Project Structure

└───app
├───core
│ └───auth
│ ├───Guards
│ ├───Interceptors
│ └───Interfaces
├───pages
│ ├───about
│ ├───admin
│ │ └───components
│ │ ├───delete-button-renderer
│ │ ├───product-form-modal
│ │ └───products-dashboard
│ ├───cart
│ │ └───components
│ │ ├───bin-button
│ │ ├───cart-table
│ │ │ └───components
│ │ │ └───cart-product-card
│ │ │ └───components
│ │ │ └───bin-button
│ │ └───order-summary
│ ├───home
│ │ └───components
│ │ └───hero-carousel
│ ├───login
│ ├───product-detail
│ │ └───components
│ │ └───detail-product-card
│ ├───profile
│ │ └───components
│ │ └───profile-edit
│ ├───search
│ └───signup
└───shared
├───components
│ ├───logo
│ ├───page-sidebar
│ ├───ui-breadcrumb
│ ├───ui-button
│ ├───ui-counter-pill
│ │ └───components
│ │ ├───counter-btn
│ │ └───counter-value
│ ├───ui-footer
│ │ └───components
│ │ ├───footer-bottom
│ │ ├───footer-link-col
│ │ ├───footer-socials
│ │ └───footer-support
│ ├───ui-input
│ ├───ui-modal
│ ├───ui-navbar
│ │ └───components
│ │ ├───navbar-cart
│ │ ├───navbar-link
│ │ ├───navbar-pfp
│ │ └───navbar-search
│ ├───ui-pill
│ └───visible-products
│ └───components
│ ├───products-grid
│ │ └───components
│ │ └───product-card
│ └───products-toolbar
│ └───components
│ ├───toolbar-categories
│ └───toolbar-select
├───interfaces
├───services
│ ├───nav
│ ├───orders
│ │ └───interfaces
│ ├───products
│ └───signin-signup
└───stores
├───cart
│ └───interfaces
└───products

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
