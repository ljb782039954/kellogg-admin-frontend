# Company Info Feature Migration Design

## Background

The first adminApp refactoring batch established the foundation for incremental feature migration: TanStack Query, a shared API client, unified application errors, Vitest/MSW test infrastructure, and ESLint dependency boundaries for new feature code.

The second batch will migrate the company information editor into the new feature architecture. This module is intentionally chosen as the first business slice because it is small enough to keep risk low, but complete enough to exercise the desired pattern: query, mutation, defaults, schema, mapper, form controller, and replaceable view.

## Goals

- Keep the existing `/company` route and visual behavior stable.
- Move company information data access out of `ContentContext`.
- Store server state in a company-info TanStack Query instead of global React Context.
- Manage editable draft state with React Hook Form.
- Keep DTO/config key knowledge out of UI components.
- Create a reusable bilingual field control pattern for new feature code.
- Provide a clear sample for later migrations such as categories, footer, and products.

## Non-Goals

- Do not modify `src/components/blocks`.
- Do not migrate products, categories, header, footer, media, pages, blogs, reviews, or inquiries in this batch.
- Do not delete `ContentContext`; old modules still depend on it.
- Do not redesign the page visually.
- Do not replace the existing `ImageInput` upload flow yet. The company information form may continue to consume it as a compatibility UI component until the media-upload batch.
- Do not create a generic schema-driven form platform.

## Recommended Approach

Use `features/company-info` as the first complete business-feature sample:

```text
src/features/company-info/
  api/
    companyInfo.api.ts
    companyInfo.keys.ts
  model/
    companyInfo.defaults.ts
    companyInfo.mapper.ts
    companyInfo.schema.ts
    useCompanyInfoForm.ts
  ui/
    CompanyInfoEditor.tsx
    CompanyInfoFormView.tsx
  index.ts
```

Shared bilingual controls live outside the feature because future features will reuse them:

```text
src/shared/forms/
  controls/
    BilingualTextControl.tsx
    BilingualTextareaControl.tsx
```

The route-level import in `src/App.tsx` changes from the old admin editor to the new feature public index. The old `src/admin/editors/CompanyInfoEditor.tsx` remains in place during the migration window, but it is no longer routed.

## Data Flow

```text
/company route
  -> features/company-info index
  -> CompanyInfoEditor container
  -> useCompanyInfoForm
  -> companyInfo query and mutation
  -> shared api client via companyInfo.api
  -> /api/config/site_settings
```

`CompanyInfoFormView` receives form state and callbacks from the container/hook. It does not import `ContentContext`, `apiClient`, or the legacy `api` facade.

## API Contract

Company information continues to use the existing config key:

- Read: `GET /api/config/site_settings`
- Write: `POST /api/config` with `{ key: 'site_settings', value }`

Missing config should fall back to a blank company information object. This matches the old `ContentContext` behavior where `api.getConfig('site_settings')` returning `null` uses the blank value.

The feature API should use the shared `apiClient` directly from the feature API layer. UI code must not call the shared client.

## Model And Form Contract

The form value shape should match the domain `CompanyInfo` shape closely:

```ts
interface CompanyInfoFormValues {
  name: { zh: string; en: string };
  logo: string;
  description: { zh: string; en: string };
  contact: {
    phone: string;
    email: string;
    address: { zh: string; en: string };
  };
  socialMedia: {
    wechat?: string;
    weibo?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
    whatsapp?: string;
  };
}
```

The mapper owns normalization:

- `toCompanyInfoFormValues(input)` fills missing nested fields with defaults.
- `toCompanyInfoPayload(form)` trims optional social links into `undefined` when blank.
- UI code should not know the config key or backend persistence shape.

The schema validates the nested object and allows empty optional social links. It should reject structurally invalid values, not impose product/business copy rules that do not exist today.

## UI Design

`CompanyInfoEditor` is a container. It handles:

- Query loading and error states.
- Initializing/resetting the form from query data.
- Save mutation submission.
- Success feedback lifetime.

`CompanyInfoFormView` is a replaceable view. It handles:

- Existing cards, labels, icons, and layout.
- Binding form fields to controls.
- Rendering the save button and success message.
- Calling supplied submit handlers.

New bilingual controls are presentational and controlled:

- `BilingualTextControl`
- `BilingualTextareaControl`

They accept `value`, `onChange`, `placeholder`, optional `disabled`, and layout options. They do not know React Hook Form, Query, or company information.

This keeps the first batch modest. A later forms batch may add React Hook Form field adapters when multiple migrated features need them.

## Error Handling

- Query errors render a stable inline error state with a retry action.
- Mutation errors render a stable inline error message near the save action.
- Field validation errors render next to the relevant field when validation is introduced.
- Toast behavior from the old `ContentContext.updateSiteSettings` is not required for the new feature. The page already has an inline saved banner, and the feature should not depend on global Context side effects.

## Cache Behavior

- Query key: `companyInfoKeys.detail()`.
- Saving company information updates or invalidates only the company-info cache.
- Saving company information must not call `refreshData()` or reload unrelated products, blogs, pages, footer, or reviews.
- Other old modules may still read stale `ContentContext.content.companyInfo` until their own migration. That is acceptable in this transitional batch because `/company` itself no longer depends on Context.

## Testing

The batch should add focused tests:

- Defaults and mapper preserve complete nested shape.
- Mapper converts blank optional social media links to `undefined`.
- API functions use the `site_settings` config key and preserve missing-config fallback.
- The form hook/container can initialize from loaded data, submit payloads, and reset after save.
- The routed public feature can render the core fields without importing `ContentContext`.

Full visual snapshot tests are intentionally avoided. The goal is behavior and boundary confidence, not brittle CSS snapshots.

## Acceptance Criteria

- `/company` still renders the company information editor.
- The routed company information editor imports from `@/features/company-info`.
- New feature UI does not import `@/lib/api`, `@/shared/api/client`, or `@/context/ContentContext`.
- Company info data is read with a domain query and saved with a domain mutation.
- Saving company info does not call `ContentContext.refreshData()`.
- `src/components/blocks` is unchanged.
- Tests for the new feature pass.
- Existing app build passes.
- Existing lint baseline is not worsened.
