import { createFileRoute } from "@tanstack/react-router";
import { headForPath } from "../lib/seo";
import { CalculatorPage } from "../pages/CalculatorPage";

export const Route = createFileRoute("/calculator")({
  head: () => headForPath("/calculator"),
  component: CalculatorPage,
});
