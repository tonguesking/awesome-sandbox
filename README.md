# awesome-sandbox

> [!NOTE]
> 🔥 **Important:** To submit a product, just open an issue with the **product name** and **official website**. An AI agent will automatically start and complete the corresponding content.

A curated directory of cloud sandboxes, microVM runtimes, and dev environments for AI agents.

Website: https://awesome-sandbox.dev

## Submit a product

You can propose a new sandbox in two ways:

### 1. Open a GitHub Issue (recommended)

Just open an issue with the **product name** and **official website**. An AI agent will automatically start and complete the corresponding content (description, pricing, capabilities, etc.).

https://github.com/tonguesking/awesome-sandbox/issues/new?template=submit-product.yml

Maintainers will review the generated entry before it is merged.

### 2. Open a Pull Request

1. Fork this repository.
2. Add your entry to the data files under `apps/web/src/data/` (follow the existing `Sandbox` shape).
3. Run checks locally:

   ```bash
   pnpm install
   pnpm check
   ```

4. Open a PR with a short description of the product.

## Development

```bash
pnpm install
pnpm dev
```

Open http://localhost:3001 in your browser.

## Contributing

- Keep submissions legitimate sandbox infrastructure, runtimes, or dev environments.
- Generic chatbot apps or wrapper frontends will not be listed.
- Pricing claims stay "Pending audit" until verified against official docs.
