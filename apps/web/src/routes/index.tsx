import { createFileRoute } from "@tanstack/react-router";
import App from "../App";
import { buildHead, staticPageMeta } from "../lib/seo";

const HOME_META = staticPageMeta("/");

export const Route = createFileRoute("/")({
  // The UI is still mounted on the client (it reads localStorage for saved
  // filters and comparisons), but `head()` runs during SSR, so crawlers get
  // the title, description, canonical and JSON-LD in the server HTML.
  ssr: false,
  head: () => (HOME_META ? buildHead(HOME_META) : { meta: [], links: [], scripts: [] }),
  component: HomeComponent,
});

function HomeComponent() {
  return <App />;
}
