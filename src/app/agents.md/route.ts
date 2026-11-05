import { isStorefrontAgentsEnabled } from "@/config/agents";
import { getAgentDiscovery } from "@/lib/agents/discovery";
import { agentNotFound, markdownResponse } from "@/lib/agents/response";

export async function GET() {
	if (!isStorefrontAgentsEnabled()) return agentNotFound();
	return markdownResponse(await getAgentDiscovery());
}
