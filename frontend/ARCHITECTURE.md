# Frontend Architecture

## Структура проєкту (Feature-Sliced Design)

```
frontend/
├── app/                    # Next.js App Router pages
├── components/            # Shared UI components (shadcn/ui)
│   ├── ui/               # Base UI primitives
│   ├── navbar.tsx        # Global navigation
│   ├── category-filter.tsx
│   └── theme-provider.tsx
├── features/             # Feature-based modules
│   ├── auth/            # Аутентифікація
│   │   ├── components/
│   │   │   ├── auth-form.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── use-auth.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── dashboard/       # Головна панель
│   │   ├── components/
│   │   │   ├── feature-card.tsx
│   │   │   ├── info-section.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── profile/         # Профіль користувача
│   │   ├── components/
│   │   │   ├── progress-chart.tsx
│   │   │   ├── accuracy-chart.tsx
│   │   │   ├── achievement-status.tsx
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── simulation/      # Симуляція фішингу
│   │   ├── components/
│   │   │   ├── email-card.tsx
│   │   │   ├── email-decision.tsx
│   │   │   ├── email-feedback.tsx
│   │   │   ├── email-history-modal.tsx
│   │   │   └── index.ts
│   │   ├── hooks/
│   │   │   ├── use-simulation.ts
│   │   │   └── index.ts
│   │   └── index.ts
│   └── shared/          # Спільні компоненти та хуки
│       ├── ui/
│       │   ├── loading-spinner.tsx
│       │   ├── error-message.tsx
│       │   ├── logo.tsx
│       │   ├── stat-card.tsx
│       │   └── index.ts
│       ├── hooks/
│       │   ├── use-stats.ts
│       │   └── index.ts
│       └── index.ts
├── hooks/               # Global hooks (use-mobile, use-toast)
├── lib/                # Utilities and API
│   ├── api/           # RTK Query API slice
│   └── utils/         # Utility functions
└── public/            # Static assets
```

## Принципи організації

### Feature-Sliced Design (FSD)

Кожна feature містить:

-   **components/** - React компоненти для конкретної features
-   **hooks/** - Custom hooks для бізнес-логіки
-   **index.ts** - Barrel export для зручного імпорту

### Імпорти

**З features:**

```typescript
// Auth
import { AuthForm } from "@/features/auth/components";
import { useAuth } from "@/features/auth/hooks";

// Dashboard
import { FeatureCard, InfoSection } from "@/features/dashboard/components";

// Profile
import {
    ProgressChart,
    AccuracyChart,
    AchievementStatus,
} from "@/features/profile/components";

// Simulation
import {
    EmailCard,
    EmailDecision,
    EmailFeedback,
    EmailHistoryModal,
} from "@/features/simulation/components";
import { useSimulation, useEmailHistory } from "@/features/simulation/hooks";

// Shared
import {
    LoadingSpinner,
    ErrorMessage,
    Logo,
    StatCard,
} from "@/features/shared/ui";
import { useStats, useWeeklyProgress } from "@/features/shared/hooks";
```

**Глобальні компоненти:**

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navbar } from "@/components/navbar";
```

**Utilities:**

```typescript
import { formatPercentage, capitalize } from "@/lib/utils/formatters";
import { ERROR_MESSAGES, CHART_COLORS } from "@/lib/utils/constants";
import { validateEmail, validatePassword } from "@/lib/utils/validation";
```

## Переваги Feature-Sliced Design

1. **Масштабованість** - Легко додавати нові features без конфліктів
2. **Ізоляція** - Кожна feature є самодостатнім модулем
3. **Читабельність** - Зрозуміла структура та зв'язки між модулями
4. **Підтримка** - Легко знайти та оновити функціонал
5. **Тестування** - Кожна feature тестується незалежно

## Додавання нової feature

1. Створіть директорію в `features/`:

    ```
    features/new-feature/
    ├── components/
    │   ├── component-name.tsx
    │   └── index.ts
    ├── hooks/ (optional)
    │   ├── use-feature.ts
    │   └── index.ts
    └── index.ts
    ```

2. Експортуйте з index.ts:

    ```typescript
    export * from "./components";
    export * from "./hooks";
    ```

3. Використовуйте в pages:
    ```typescript
    import { ComponentName } from "@/features/new-feature/components";
    import { useFeature } from "@/features/new-feature/hooks";
    ```

## Code Quality

-   ✅ TypeScript strict mode
-   ✅ No console.log statements
-   ✅ No comments in code (self-documenting)
-   ✅ DRY principle (no duplication)
-   ✅ SOLID principles
-   ✅ Next.js 14 App Router best practices
