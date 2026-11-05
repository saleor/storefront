import { isStorefrontAgentsEnabled } from "@/config/agents";
import { getCatalogExamples } from "@/lib/agents/discovery";
import { agentNotFound, markdownResponse } from "@/lib/agents/response";

export function GET() {
	if (!isStorefrontAgentsEnabled()) return agentNotFound();
	return markdownResponse(getCatalogExamples());
}
