# Contributing

Thanks for helping improve the AppExchange Security Review Checklist! This is a community-maintained tool and contributions from ISV partners are welcome.

## Adding or updating checklist items

The checklist data lives in [`data/checklist.ts`](data/checklist.ts). Each item has this structure:

```typescript
{
  id: string           // Unique ID (e.g. 'crud-01')
  category: string     // Must match one of the categories in the `categories` array
  title: string        // Short, actionable title
  description: string  // Detailed explanation
  severity: 'critical' | 'important' | 'nice'
  docUrl?: string      // Link to official documentation
  docLabel?: string    // Display text for the doc link
  tip?: string         // Pro tip shown on expand
  appTypes?: string[]  // Only show for these app types (empty = show always)
  codeExample?: string // Optional code snippet
}
```

### Guidelines

- **Be specific**: Vague advice like "write secure code" isn't helpful. Include concrete, actionable steps.
- **Cite sources**: Link to official Salesforce documentation where possible.
- **Keep items atomic**: Each item should represent one thing to check, not a bundle of related items.
- **Use the right severity**:
  - `critical` = automatic fail if missed
  - `important` = likely to cause issues or delay
  - `nice` = best practice, won't cause a fail

### App type IDs

When an item only applies to certain app types, use these IDs in the `appTypes` array:

- `managed_package_1gp` — First-generation managed package
- `managed_package_2gp` — Second-generation managed package
- `lightning_components` — Lightning Web Components / Aura
- `base_extension` — Base + extension package structure
- `apex_callouts` — Uses Apex callouts to external services
- `external_web_app` — External website / web app
- `api_endpoints` — REST API / web services
- `mobile_ios` — iOS mobile app
- `mobile_android` — Android mobile app
- `browser_extension` — Browser extension
- `desktop_app` — Desktop/client app
- `marketing_cloud` — Marketing Cloud Engagement app
- `free_listing` — Free listing
- `paid_listing` — Paid listing

## Reporting issues

If you find an item that's outdated or incorrect, please open an issue describing:

1. Which checklist item is affected
2. What's wrong or outdated
3. What the correct information should be (with a source link if possible)

## Development

```bash
npm install
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Code of conduct

Be kind and constructive. We're all trying to help each other pass security review.
