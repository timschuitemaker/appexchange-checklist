# Contributing

Thanks for helping improve the AppExchange Security Review Checklist! This is a community-maintained tool and contributions from ISV partners are welcome.

## Adding or updating checklist items

The checklist data lives in [`data/checklist.ts`](data/checklist.ts). Each item has this structure (see [`types/index.ts`](types/index.ts) for the source of truth):

```typescript
{
  id: string                    // Unique ID (e.g. 'onboard-01')
  category: string              // Must match one of the categories in the `categories` array
  title: string                 // Short, actionable title
  subtitle: string              // One-line explanation shown under the title
  details: string[]             // Bullet points shown when expanded
  severity: 'critical' | 'important' | 'recommended' | 'nice'
  severityNote?: string         // Short label next to the severity badge (e.g. 'Auto-reject')
  docUrl?: string               // Link to official documentation
  docLabel?: string             // Display text for the doc link
  tip?: string                  // Pro tip shown on expand
  appTypes?: string[]           // Only show for these app types (empty = show always)
  codeExamples?: CodeExample[]  // Optional bad/good code snippets
  howTo?: string[]              // Step-by-step instructions (markdown links supported)
}
```

### Guidelines

- **Be specific**: Vague advice like "write secure code" isn't helpful. Include concrete, actionable steps.
- **Cite sources**: Link to official Salesforce documentation where possible.
- **Keep items atomic**: Each item should represent one thing to check, not a bundle of related items.
- **Use the right severity**:
  - `critical` = automatic fail / gating step if missed
  - `important` = likely to cause issues or delay
  - `recommended` = good practice that smooths the review
  - `nice` = best practice, won't cause a fail

### App type IDs

When an item only applies to certain app types, use these IDs in the `appTypes` array:

**On-platform**
- `managed_package_1gp` — First-generation managed package
- `managed_package_2gp` — Second-generation managed package
- `lightning_components` — Lightning Web Components / Aura
- `base_extension` — Base + extension package structure
- `apex_callouts` — Uses Apex callouts to external services
- `agentforce_app` — Agentforce app / AgentExchange listing

**External**
- `external_web_app` — External / composite web app
- `api_endpoints` — REST API / web services
- `external_client_app` — External Client App (ECA, 2GP-native replacement for Connected Apps)
- `connected_app` — Connected App (legacy)
- `mobile_ios` — iOS mobile app
- `mobile_android` — Android mobile app
- `browser_extension` — Browser extension
- `desktop_app` — Desktop/client app

**Special**
- `marketing_cloud` — Marketing Cloud Engagement app
- `quip_app` — Quip app
- `paid_listing` — Paid listing ($999 per review attempt)

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
