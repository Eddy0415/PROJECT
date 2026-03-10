# Item Store — Angular 20 Project Documentation

A fully modern Angular 20 e-commerce storefront built with every current best practice: zoneless change detection, signals-first architecture, standalone components, lazy loading, and OnPush everywhere. This document covers every architectural decision and pattern implemented across the codebase.

---

## ✅ Modern Angular Checklist

- ✅ **Zoneless Change Detection** — `provideZonelessChangeDetection()`, Zone.js not used
- ✅ **Lazy Loading** — All 9 routes use `loadComponent()` with dynamic `import()`
- ✅ **OnPush Change Detection** — Every component uses `ChangeDetectionStrategy.OnPush`
- ✅ **Signals for state** — Zero `Subject` / `BehaviorSubject` anywhere
- ✅ **Signal-based inputs & outputs** — No `@Input()` or `@Output()` decorators
- ✅ **`inject()` for dependency injection** — No constructor parameter injection
- ✅ **`effect()` for reactivity** — No `ngOnInit`, `ngOnChanges`, `ngAfterViewInit`
- ✅ **Standalone components** — Zero NgModules
- ✅ **New template control flow** — `@if` / `@for` / `@switch` everywhere
- ✅ **Functional guards & interceptors** — Plain functions, no classes
- ✅ **Typed reactive forms** — `fb.nonNullable` with TypeScript interfaces throughout
- ✅ **No manual subscriptions** — `firstValueFrom()` + `toSignal()` + `destroyRef`

---

## Part 1 — Optimization Techniques

### 1. Lazy Loading

**What it is:** Instead of bundling the whole app into one JS file, lazy loading splits each route into its own separate chunk. The browser only downloads a chunk when the user actually navigates to that route.

**Why it matters:** A regular user never touches the admin panel or profile editor on their first visit. Without lazy loading they'd still download all that code upfront. With it, the initial load is only the home page chunk — everything else is fetched on demand.

**How we implemented it:** Every route in `app.routes.ts` uses `loadComponent()` with a dynamic `import()`. Vite/esbuild sees each `import()` and automatically code-splits it into a separate file at build time.

```typescript
// app.routes.ts — all 9 routes are lazy
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart').then((m) => m.CartPage),
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin/admin').then((m) => m.Admin),
  },
  // Login and signup are modals — still lazy, only loaded when first opened
  {
    path: 'login',
    outlet: 'modal',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search/search').then((m) => m.SearchComponent),
  },
];
```

---

### 2. OnPush Change Detection

**What it is:** Angular's default change detection checks every component in the entire tree on every browser event. `OnPush` tells Angular to skip a component and its subtree unless one of its signal or input values has actually changed.

**Why it matters:** The hero carousel has a `setInterval` firing every 3.5 seconds. Without `OnPush` that timer would trigger change detection across the entire app tree on every tick — checking every component and every binding constantly. With `OnPush` + signals, only the carousel itself re-evaluates.

**How we implemented it:** Every component in the project declares `ChangeDetectionStrategy.OnPush`:

```typescript
// hero-carousel.ts — has a setInterval, OnPush is critical here
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroCarouselComponent {
  active = signal(0); // signal mutation precisely notifies Angular to re-check only this component
}

// product-card.ts — rendered 20+ times per page in the product grid
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  product = input.required<IProduct>(); // only re-renders when this input changes
  readonly stars = computed(() => {
    /* recomputes only when product() changes */
  });
}

// about.ts — static page, never needs to re-check
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {}
```

---

### 3. Zoneless Change Detection

**What it is:** Zone.js is a library that patches every browser API (`setTimeout`, `Promise`, `addEventListener`, `fetch`) so Angular can detect async events and trigger change detection. Zoneless removes Zone.js entirely — Signals take over the job of notifying Angular about changes.

**Why it matters:** Zone.js adds bundle weight and runtime overhead. More importantly it triggers change detection on _every_ async event whether or not anything actually changed. Signals are surgical — they only notify the exact components that read the signal that changed.

**How we implemented it:** One provider in `app.config.ts`, and Zone.js is never imported anywhere:

```typescript
// app.config.ts
import { provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(), // replaces Zone.js entirely
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

```typescript
// main.ts — clean bootstrap, no zone.js import anywhere
bootstrapApplication(App, appConfig);
```

---

## Part 2 — Signals Instead of RxJS for State

**The rule:** `signal()`, `computed()`, and `effect()` for all state. Never `Subject`, `BehaviorSubject`, or `.subscribe()` for managing component or application state.

**Why:** Signals are synchronous, automatically tracked by Angular's renderer, and compose naturally via `computed()`. Any component can call `auth.isAuthenticated()` and it reactively updates — no subscription, no pipe, no manual cleanup.

**`AuthService`** — entire auth state as read-only signals:

```typescript
// auth-service.ts
private _token = signal<string | null>(null);
private _currentUser = signal<IUser | null>(null);
private _isAuthenticated = signal<boolean>(false);

// Exposed as readonly — only this service can mutate them
readonly token = this._token.asReadonly();
readonly currentUser = this._currentUser.asReadonly();
readonly isAuthenticated = this._isAuthenticated.asReadonly();
```

**`CartStore`** — cart entries as a signal, derived totals as `computed()`:

```typescript
// cart-store.ts
private readonly entriesSig = signal<CartEntry[]>(this.readFromStorage());
readonly entries = this.entriesSig.asReadonly();

readonly totalItems = computed(() =>
  this.entriesSig().reduce((sum, e) => sum + e.qty, 0)
);
readonly subtotal = computed(() =>
  this.entriesSig().reduce((sum, e) => {
    const product = this.catalog.findById(e.id);
    return sum + (product?.price ?? 0) * e.qty;
  }, 0)
);
// Joins two stores — recomputes when either cart entries or the product catalog changes
readonly cartLines = computed(() =>
  this.entriesSig().map(e => ({ entry: e, product: this.catalog.findById(e.id) }))
);
```

**`ProductsCatalogStore`** — loading, error, and data as signals:

```typescript
readonly loading = signal(false);
readonly error = signal<string | null>(null);
readonly products = signal<IProduct[]>([]);
readonly categories = computed(() => {
  const set = new Set(this.products().map(p => p.category).filter(Boolean));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
});
```

**Local component state** — always signals:

```typescript
// profile-edit.ts
readonly isSaving = signal(false);
readonly submitted = signal(false);
readonly apiError = signal<string | null>(null);
readonly saveState = signal<'idle' | 'saving' | 'success'>('idle');
readonly selectedFile = signal<File | null>(null);
readonly previewUrl = signal<string | null>(null);
```

---

## Part 3 — Signal Inputs & Outputs Instead of @Input() / @Output()

**The rule:** Use `input()` and `output()` functions. Never `@Input()` or `@Output()` decorators.

**Why:** Signal inputs _are_ signals — they participate in Angular's reactivity graph automatically. You can read them inside `computed()` and `effect()` with zero extra wiring. The old `@Input()` required `ngOnChanges` to react to changes, which needed manual previous/current value comparison.

```typescript
// cart-table.ts
export class CartTable {
  readonly lines = input.required<CartLine[]>(); // required — Angular throws if not provided
  readonly removeClick = output<number>();        // typed — emits the cart entry id
  readonly incClick = output<number>();
  readonly decClick = output<number>();
}

// product-form-modal.ts — optional input with a default
readonly product = input<IProduct | null>(null); // null = add mode, IProduct = edit mode

// product-card.ts — signal input consumed directly inside computed(), no ngOnChanges needed
product = input.required<IProduct>();
readonly stars = computed(() => {
  const rate = this.product().rating?.rate ?? 0; // tracked automatically
  return Array.from({ length: 5 }, (_, i) =>
    rate >= i + 1 ? 'full' : rate >= i + 0.5 ? 'half' : 'empty'
  );
});
```

In templates, signal inputs are called like functions:

```html
<!-- cart-product-card.html -->
<h3>{{ line().product?.title }}</h3>
<span>{{ (line().product?.price ?? 0) | currency }}</span>
<ui-counter-pill [value]="line().entry.qty"></ui-counter-pill>
```

---

## Part 4 — inject() Instead of Constructor Injection

**The rule:** Always `inject()` for dependencies. Never list them as constructor parameters.

**Why:** `inject()` works anywhere in the injection context — as a class field initializer, inside `effect()`, and in plain functions like guards and interceptors. Constructor injection forces everything into the constructor signature and doesn't work at all outside of classes.

```typescript
// cart.ts — clean field declarations
export class CartPage {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly orders = inject(OrdersService);
  private readonly cart = inject(CartStore);
}

// search.ts — inject() inside constructor body is also valid
constructor() {
  const title = inject(Title);
  effect(() => title.setTitle(this.q() ? `Search: "${this.q()}"` : 'Search — Item Store'));
}

// auth-guard.ts — inject() in a plain function, no class needed
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.isAuthenticated()) return true;
  return router.createUrlTree([{ outlets: { modal: ['login'] } }]);
};

// auth-interceptor.ts — inject() inside a functional interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  // attaches Bearer token, handles 401 globally
};
```

---

## Part 5 — effect() Instead of Lifecycle Hooks

**The rule:** React to signal changes with `effect()` in the constructor. No `ngOnInit`, `ngOnChanges`, `ngAfterViewInit`.

**Why:** Lifecycle hooks fire at fixed moments regardless of whether relevant data changed. `effect()` re-runs precisely when a signal it reads emits a new value, and makes the dependency explicit — you can see exactly which signals drive the side effect just by reading the code.

**Patching a form when the edit target changes** — `product-form-modal.ts`:

```typescript
constructor() {
  effect(() => {
    const p = this.product(); // reads the input signal
    if (p) this.form.patchValue({ title: p.title, price: p.price, category: p.category, ... });
    // runs automatically whenever product() changes — no ngOnChanges needed
  });
}
```

**Updating the browser tab title reactively** — `search.ts`:

```typescript
constructor() {
  const title = inject(Title);
  effect(() => {
    const q = this.q();
    title.setTitle(q ? `Search: "${q}" — Item Store` : 'Search — Item Store');
    // reruns every time the URL query param changes
  });
}
```

**Persisting cart to localStorage on every change** — `cart-store.ts`:

```typescript
constructor() {
  effect(() => {
    this.writeToStorage(this.entriesSig()); // runs whenever cart entries change
  });
}
```

**Auto-closing the modal after login** — `login.ts`:

```typescript
constructor() {
  effect(() => {
    if (this.auth.isAuthenticated())
      this.router.navigate([{ outlets: { modal: null } }]);
  });
}
```

**Cleanup with `destroyRef` instead of `ngOnDestroy`** — `hero-carousel.ts`:

```typescript
private readonly destroyRef = inject(DestroyRef);

constructor() {
  this.startAutoPlay();
  this.destroyRef.onDestroy(() => this.stopAutoPlay()); // clears the setInterval on destroy
}
```

---

## Part 6 — Standalone Components, No NgModules

**The rule:** Every component is `standalone: true`. Zero NgModules in the entire project.

**Why:** NgModules added a layer of indirection — you had to declare components in a module and import that module elsewhere. Standalone components declare their own dependencies directly in `imports`, making every component self-contained and explicit.

```typescript
// cart-product-card.ts — imports only exactly what it uses
@Component({
  selector: 'cart-product-card',
  standalone: true,
  imports: [CurrencyPipe, CartBinButton, UiCounterPill],
})

// login.ts — modal page with its own isolated imports
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, UiModal, UiInput, UiButton],
})

// search.ts — only needs one child component
@Component({
  selector: 'app-search',
  standalone: true,
  imports: [VisibleProducts],
})
```

No `AppModule`, no `SharedModule`, no `CoreModule`. Every component is fully self-contained.

---

## Part 7 — New Template Control Flow Syntax

**The rule:** `@if`, `@for`, `@switch` everywhere. Zero `*ngIf`, `*ngFor`, `*ngSwitch`.

**Why:** The new syntax is built into Angular's template compiler — no directive imports needed. It has better TypeScript type narrowing, and `track` in `@for` is now mandatory which prevents the common forgotten-`trackBy` performance bug.

```html
<!-- cart.html — @if / @else -->
@if (!hasItems()) {
<div class="cart__empty">
  <p>Your cart is empty.</p>
  <ui-button [text]="'Shop Now'" (clicked)="goHome()"></ui-button>
</div>
} @else {
<div class="cart__grid">
  <cart-table [lines]="lines()" ...></cart-table>
</div>
}

<!-- cart-table.html — @for with mandatory track -->
@for (line of lines(); track line.entry.id) {
<cart-product-card [line]="line" ...></cart-product-card>
}

<!-- visible-products.html — chained @if / @else if / @else -->
@if (loading()) {
<div class="state">Loading products...</div>
} @else if (error()) {
<div class="state state--error">{{ error() }}</div>
} @else {
<products-grid [products]="visibleProducts()"></products-grid>
}
```

---

## Part 8 — Functional Guards & Interceptors

**The rule:** Guards and interceptors are plain functions using `inject()`. No classes, no interfaces to implement.

**Why:** Class-based guards needed a service class, an interface, and a provider registration. Functional guards are just exported functions — simpler to write and simpler to test.

```typescript
// auth-guard.ts — redirects unauthenticated users to the login modal
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.isAuthenticated()) return true;
  return inject(Router).createUrlTree([{ outlets: { modal: ['login'] } }]);
};

// admin-guard.ts — reads the role from the currentUser signal
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  if (auth.currentUser()?.role === 'admin') return true;
  return inject(Router).createUrlTree(['/']);
};

// auth-interceptor.ts — attaches JWT, handles 401 globally
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();
  const authedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authedReq).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        auth.logout();
        inject(Router).navigate([{ outlets: { modal: ['login'] } }]);
      }
      return throwError(() => err);
    }),
  );
};
```

Registered in `app.config.ts` with `withInterceptors([authInterceptor])` — no module, no token.

---

## Part 9 — Typed Reactive Forms

**The rule:** Always `fb.nonNullable` with a TypeScript interface for the form model. No untyped forms.

**Why:** Typed forms give full TypeScript inference on `.value`, `.getRawValue()`, and individual controls. Type errors are caught at compile time, not runtime. `nonNullable` means controls never carry `null` as part of their type.

```typescript
// login.ts
interface LoginFormModel {
  email: FormControl<string>;
  password: FormControl<string>;
}

readonly form = this.fb.nonNullable.group<LoginFormModel>({
  email: this.fb.nonNullable.control('', [Validators.required, Validators.email]),
  password: this.fb.nonNullable.control('', [Validators.required]),
});

// .getRawValue() returns { email: string; password: string } — fully typed, no nulls
await firstValueFrom(this.auth.login(this.form.getRawValue()));
```

```typescript
// profile-edit.ts — complex form with cross-field validator
interface ProfileFormModel {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  username: FormControl<string>;
  email: FormControl<string>;
  dateOfBirth: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  role: FormControl<string>;
}

readonly form = this.fb.nonNullable.group<ProfileFormModel>(
  { /* all 8 controls */ },
  { validators: [passwordMatchValidator] }, // cross-field group validator
);

readonly passwordMismatch = computed(
  () => this.submitted() && !!this.form.errors?.['passwordMismatch']
);
```

---

## Part 10 — Subscription Management

**The rule:** No raw `.subscribe()` calls. Use `firstValueFrom()` for HTTP, `toSignal()` for ongoing streams, `destroyRef.onDestroy()` for cleanup.

**Why:** Manual subscriptions are memory leaks waiting to happen. The modern alternatives are automatic and leak-proof — no `ngOnDestroy`, no `takeUntil`, no cleanup boilerplate.

**`firstValueFrom()`** — takes one emission and auto-completes, zero cleanup needed:

```typescript
// cart.ts
await firstValueFrom(this.orders.createCartOrder({ userId: 1, entries }));

// profile-edit.ts
await firstValueFrom(this.auth.updateUser({ firstName, email, file, ... }));

// products-store.ts
const data = await firstValueFrom(this.api.getAll());
```

**`toSignal()`** — converts an Observable to a signal, Angular manages the subscription:

```typescript
// search.ts — URL query params become a signal
private readonly queryMap = toSignal(this.route.queryParamMap, {
  initialValue: this.route.snapshot.queryParamMap,
});
readonly q = computed(() => (this.queryMap().get('q') ?? '').trim());

// ui-breadcrumb.ts — router events become a signal
private readonly url = toSignal(
  this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    map(e => (e as NavigationEnd).urlAfterRedirects),
    startWith(this.router.url),
  ),
);
```

**`destroyRef.onDestroy()`** — replaces `ngOnDestroy`:

```typescript
// hero-carousel.ts
private readonly destroyRef = inject(DestroyRef);

constructor() {
  this.startAutoPlay();
  this.destroyRef.onDestroy(() => this.stopAutoPlay()); // clears setInterval automatically
}
```

---

## Part 11 — Overlay Routing with Named Outlets

**What it is:** Angular supports multiple `<router-outlet>` elements on the same page, each with a name. This lets the login and signup modals be real routes that render _on top of_ the current page without replacing it.

**Why it's powerful:**

- The back button naturally closes the modal
- Guards can redirect unauthenticated users to the login modal without losing their current page
- The HTTP interceptor can open the login modal globally on a 401 without knowing what page is active
- The URL reflects the modal state — `/cart(modal:login)` is shareable and bookmarkable

**Setup — two outlets in `app.html`:**

```html
<ui-navbar></ui-navbar>

<main class="shell">
  <router-outlet></router-outlet>
  <!-- main page renders here -->
</main>

<router-outlet name="modal"></router-outlet>
<!-- modals overlay on top -->

<ui-footer></ui-footer>
```

**Routes declared with `outlet: 'modal'`:**

```typescript
{ path: 'login',  outlet: 'modal', loadComponent: () => import('./pages/login/login').then(m => m.Login) },
{ path: 'signup', outlet: 'modal', loadComponent: () => import('./pages/signup/signup').then(m => m.Signup) },
```

**Opening the modal from anywhere:**

```typescript
// cart.ts — checkout while not logged in
this.router.navigate([{ outlets: { modal: ['login'] } }]);

// authGuard — unauthenticated user visits /profile
return router.createUrlTree([{ outlets: { modal: ['login'] } }]);

// authInterceptor — any 401 response, globally
router.navigate([{ outlets: { modal: ['login'] } }]);
```

**Closing the modal:**

```typescript
// ui-modal.ts — close button / backdrop
closeModal(): void {
  this.router.navigate([{ outlets: { modal: null } }]);
}

// login.ts — auto-close on successful login
effect(() => {
  if (this.auth.isAuthenticated())
    this.router.navigate([{ outlets: { modal: null } }]);
});
```

**Switching between login and signup:**

```typescript
// login.ts
goSignup(): void {
  this.router.navigate([{ outlets: { modal: ['signup'] } }]);
}
```

---

# Item Store — Additional Patterns

---

## Part 12 — ESLint & Prettier

The project uses ESLint with the official Angular ESLint config (`@angular-eslint`) and Prettier for formatting, wired together so they never conflict. Prettier owns all whitespace and formatting decisions. ESLint owns Angular-specific correctness rules. The two are connected via `eslint-config-prettier` which disables any ESLint rules that would clash with Prettier's output.

The ESLint config enforces the same rules this project follows — requiring `standalone: true`, banning `@Input()`/`@Output()` decorators in favour of `input()`/`output()`, enforcing `ChangeDetectionStrategy.OnPush`, and flagging lifecycle hooks. Violations are caught at the editor level before they ever reach a code review.

Prettier is configured project-wide — single quotes, trailing commas, print width — and runs on save in the editor and as a pre-commit check. Every `.ts`, `.html`, and `.scss` file in the project is formatted consistently.

---

## Part 13 — Spec Files

Every component, service, guard, and store has a `.spec.ts` file sitting right next to it. This is Angular's standard co-location pattern — the test lives beside the file it tests, making it immediately obvious when something has no coverage.

```
cart-table.ts
cart-table.html
cart-table.spec.ts

auth-service.ts
auth-service.spec.ts

cart-store.ts
cart-store.spec.ts

auth-guard.ts
auth-guard.spec.ts
```

Spec files use Angular's `TestBed` with `provideZonelessChangeDetection()` to match the actual app config — tests run in the same zoneless environment as production. Component specs use `ComponentFixture` and assert on the DOM after signals are mutated. Service and store specs test signal state directly without needing a component at all.

---

## Part 14 — Cross-Modal Error Passing with SigninSignupService

When a user tries to sign up with an email that already exists, the server returns a `409 Conflict`. The right UX is to redirect them to the login modal with a message explaining what happened — but `Signup` and `Login` are completely independent route components and can't talk to each other directly.

`SigninSignupService` is a minimal signal-based bridge that solves this with a single pending error slot:

```typescript
// signin-signup-service.ts
@Injectable({ providedIn: 'root' })
export class SigninSignupService {
  private readonly _pendingError = signal<string | null>(null);

  setPendingError(message: string): void {
    this._pendingError.set(message);
  }

  // Reads and immediately clears — one-shot consumption
  consumeError(): string | null {
    const err = this._pendingError();
    this._pendingError.set(null);
    return err;
  }
}
```

In `signup.ts`, when a 409 comes back, it stores the message and navigates to the login modal:

```typescript
// signup.ts
catch (err: unknown) {
  const http = err as { status?: number };
  if (http?.status === 409) {
    this.authModal.setPendingError('Account already exists. Please log in.');
    this.router.navigate([{ outlets: { modal: ['login'] } }]);
  } else {
    this.apiError.set('Signup failed. Please check your information.');
  }
}
```

In `login.ts`, the constructor immediately consumes it and sets it as its own `apiError`:

```typescript
// login.ts
constructor() {
  const pending = this.authModal.consumeError(); // reads and clears in one call
  if (pending) this.apiError.set(pending);       // appears as the login error banner
}
```

`consumeError()` reads and resets in the same call — the message shows once and is gone. If the user closes and reopens the login modal it will not reappear.

---

## Part 15 — AG Grid Angular

The admin panel uses AG Grid Angular (`ag-grid-angular`) to render the products table. AG Grid handles sorting, filtering, pagination, column resizing, and inline editing out of the box — all configured declaratively via `colDefs` and `gridOptions`.

The grid is registered once at the top of the dashboard file:

```typescript
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
ModuleRegistry.registerModules([AllCommunityModule]);
```

`rowData` is a `computed()` signal reading directly from `ProductsCatalogStore`, so the grid automatically reflects any store mutation — add a product and the row appears, delete one and it disappears instantly:

```typescript
// products-dashboard.ts
this.rowData = computed(() => this.store.products());
```

In the template the grid receives the signal value directly:

```html
<ag-grid-angular
  class="ag-theme-quartz"
  style="width: 100%; height: 600px"
  [rowData]="rowData()"
  [columnDefs]="colDefs"
  [gridOptions]="gridOptions"
/>
```

The description column is inline-editable using AG Grid's built-in `agLargeTextCellEditor` — an admin can double-click any description cell and edit it in a popup, and the change is immediately dispatched to `store.updateDescription()`:

```typescript
{
  field: 'description',
  editable: true,
  cellEditor: 'agLargeTextCellEditor',
  cellEditorPopup: true,
  onCellValueChanged: (e: NewValueParams) => this.onDescriptionChanged(e),
}
```

The actions column uses a custom `cellRenderer` that creates Edit and Delete buttons per row. Edit opens the `ProductFormModal` with that row's product pre-filled via the `product` signal input. Delete calls `store.deleteOnServer()`. The column is pinned to the right so it stays visible regardless of horizontal scrolling:

```typescript
{
  headerName: '',
  width: 160,
  pinned: 'right',
  cellRenderer: (params: ICellRendererParams) => {
    const wrapper = document.createElement('div');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => this.openEdit(params.data as IProduct);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => void this.deleteRow(Number(params.data?.id ?? 0));

    wrapper.appendChild(editBtn);
    wrapper.appendChild(deleteBtn);
    return wrapper;
  },
}
```

Grid-level options enable pagination with a configurable page size selector (10 / 20 / 50 / 100 rows), floating filters on every column for quick filtering, and all columns are sortable and resizable by default via `defaultColDef`:

```typescript
readonly gridOptions: GridOptions = {
  pagination: true,
  paginationPageSize: 10,
  paginationPageSizeSelector: [10, 20, 50, 100],
  rowHeight: 48,
  headerHeight: 46,
  defaultColDef: {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
  },
};
```

## And Much More...

This document covers the main patterns. The codebase also demonstrates many additional techniques:

- **localStorage caching** — `ProductsCatalogStore` hydrates from `localStorage` on startup so there's zero API call on repeat visits. `CartStore` persists on every mutation via `effect()`.
- **`untracked()`** — used in `products-store.ts` to prevent the persist `effect()` from tracking signals inside the storage write, avoiding infinite reactive loops.
- **`asReadonly()`** — all stores expose internal signals via `.asReadonly()` so only the store itself can call `.set()` or `.update()`. Consumers can only read.
- **Smart / dumb component split** — page components own all state and logic; sub-components like `CartTable`, `CartProductCard`, and `UiCounterPill` are purely presentational.
- **Event forwarding pattern** — `CartTable` catches events from `CartProductCard` and re-emits them upward via `removeClick.emit($event)`, keeping all business logic in the page component.
- **Computed signal chains across stores** — `cartLines` in `CartStore` is a `computed()` that joins cart entries with the product catalog, auto-updating when either changes.
- **Cookie-based JWT storage** — auth tokens are stored in secure, same-site cookies via `ngx-cookie-service`, not localStorage, protecting against XSS.
- **Role-based access control** — the admin route chains two guards: `authGuard` (authenticated?) then `adminGuard` (role === 'admin'?).
- **Cross-field form validation** — `profile-edit.ts` has a `passwordMatchValidator` group-level validator with the result exposed as a `computed()` signal for the template.
- **Image upload with live preview** — profile edit uses `URL.createObjectURL()` for preview and `URL.revokeObjectURL()` for cleanup, all tracked with signals.
- **Dynamic browser titles** — every page sets its own `<title>`. The search page does it reactively inside `effect()` so the title updates as the search query changes.

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
│ ├───breadcrumb
│ ├───button
│ ├───counter-pill
│ │ └───components
│ │ ├───counter-btn
│ │ └───counter-value
│ ├───footer
│ │ └───components
│ │ ├───footer-bottom
│ │ ├───footer-link-col
│ │ ├───footer-socials
│ │ └───footer-support
│ ├───input
│ ├───logo
│ ├───modal
│ ├───navbar
│ │ └───components
│ │ ├───navbar-cart
│ │ ├───navbar-link
│ │ ├───navbar-pfp
│ │ └───navbar-search
│ ├───pill
│ ├───sidebar
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
