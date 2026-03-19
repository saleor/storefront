import type { Metadata } from "next";
import { LegalLayout } from "../legal-layout";

export const metadata: Metadata = {
	title: "Waiver & Release Agreement | Infinity BioLabs",
	description:
		"Waiver and Release Agreement governing the purchase, handling, and research use of products from Infinity BioLabs.",
};

export default function WaiverPage() {
	return (
		<LegalLayout title="Waiver & Release Agreement" lastUpdated="March 19, 2026">
			<p>
				This Waiver and Release Agreement (&ldquo;Agreement&rdquo;) sets forth the terms and conditions
				governing the purchase, handling, and research use of products provided by Infinity BioLabs
				(&ldquo;the Company&rdquo;). By purchasing or using any product from the Company, you agree to the
				terms outlined herein. Please review this Agreement carefully before completing your purchase.
			</p>

			<h2>1. Acknowledgment of Research Risks</h2>
			<p>
				You acknowledge and agree that experimental research chemicals and peptides involve inherent risks and
				uncertainties. These products are provided strictly for in-vitro laboratory research purposes and are
				not intended for human or animal consumption, injection, ingestion, inhalation, or any therapeutic or
				diagnostic application.
			</p>
			<div className="legal-callout">
				<strong>IMPORTANT:</strong> These products have not been evaluated, tested, or approved by any
				regulatory authority &mdash; including the FDA, EMA, or any equivalent body &mdash; for safety,
				efficacy, or quality for human use. By purchasing and handling these products, you assume all risks
				associated with their research use, including risks arising from the experimental and uncharacterized
				nature of the materials.
			</div>

			<h2>2. Product Intended Use</h2>
			<p>
				All products are exclusively intended for in-vitro laboratory research. They are expressly not
				designed, tested, or approved for:
			</p>
			<ul>
				<li>Human or animal consumption, injection, or administration by any route</li>
				<li>Diagnostic or therapeutic procedures of any kind</li>
				<li>Use in food, drugs, cosmetics, medical devices, or dietary supplements</li>
				<li>Any clinical, veterinary, or patient-facing application</li>
			</ul>

			<h2>3. International Nonproprietary Names (INN)</h2>
			<p>
				Certain product names used on the Company&apos;s Website are recognized International Nonproprietary
				Names (INN) established by the World Health Organization (WHO). These designations are not subject to
				trademark protection and are used solely to identify the underlying chemical substances for research
				reference purposes. The use of INN nomenclature does not imply any affiliation with, endorsement by,
				or equivalence to approved pharmaceutical products bearing the same name.
			</p>

			<h2>4. Waiver and Release of Claims</h2>
			<p>
				By purchasing any product from the Company, you voluntarily, knowingly, and irrevocably waive,
				release, and forever discharge the Company, its affiliates, officers, directors, employees, agents,
				successors, and assigns from any and all claims, actions, demands, liabilities, damages, losses,
				costs, and expenses of any kind, whether known or unknown, arising from or related to the purchase,
				possession, handling, storage, transport, or research use of products.
			</p>
			<p>This waiver includes, but is not limited to, claims for:</p>
			<ul>
				<li>Personal injury or illness</li>
				<li>Property damage or loss</li>
				<li>Economic or financial loss</li>
				<li>Consequential, incidental, special, or punitive damages</li>
				<li>Any other damages of any nature arising from product use, misuse, or handling</li>
			</ul>

			<h2>5. Indemnification</h2>
			<p>
				You agree to indemnify, defend, and hold harmless the Company from and against any and all claims,
				damages, liabilities, costs, and expenses arising out of or related to: (a) your research with or
				handling of products; (b) any misuse of products, including any use inconsistent with the RUO Policy;
				(c) your violation of this Agreement or any applicable laws; or (d) any third-party claims arising
				from your use or possession of products.
			</p>

			<h2>6. Limitation of Liability</h2>
			<p>
				To the fullest extent permitted by applicable law, the Company shall not be liable for any direct,
				indirect, incidental, special, consequential, or punitive damages arising from the use or inability to
				use products, any errors or inaccuracies in product information, unauthorized access to our systems,
				or any interruption of services.
			</p>
			<p>
				The Company&apos;s total aggregate liability under this Agreement shall not exceed the purchase price
				of the specific product(s) giving rise to the claim.
			</p>

			<h2>7. No Warranty</h2>
			<div className="legal-callout">
				All products are provided <strong>&ldquo;as is&rdquo;</strong> and{" "}
				<strong>&ldquo;as available&rdquo;</strong> without any warranty of any kind, whether express,
				implied, or statutory. The Company specifically disclaims all warranties, including warranties of
				merchantability, fitness for a particular purpose, and non-infringement.
			</div>

			<h2>8. Severability</h2>
			<p>
				If any provision of this Agreement is found to be invalid or unenforceable, the remaining provisions
				shall remain in full force and effect. The invalid provision shall be modified to the minimum extent
				necessary to make it valid and enforceable.
			</p>

			<h2>9. Governing Law and Jurisdiction</h2>
			<p>
				This Agreement shall be governed by and construed in accordance with the laws of the State of
				Delaware, United States. Any disputes shall be resolved exclusively in the courts of the State of
				Delaware.
			</p>

			<h2>10. Entire Agreement</h2>
			<p>
				This Agreement, together with the Terms of Service, Privacy Policy, and RUO Policy, constitutes the
				entire agreement between you and the Company regarding the subject matter herein.
			</p>

			<h2>11. Modifications</h2>
			<p>
				The Company reserves the right to update or modify this Agreement at any time. Changes will be
				effective immediately upon posting to the Website. Your continued purchase or use of products after
				changes constitutes acceptance.
			</p>

			<h2>12. Contact Information</h2>
			<p>For questions about this Waiver and Release Agreement:</p>
			<div className="legal-contact">
				<p>
					<strong>Email</strong> &mdash;{" "}
					<a href="mailto:support@infinitybiolabs.com">support@infinitybiolabs.com</a>
				</p>
				<p>
					<strong>Address</strong> &mdash; Infinity BioLabs, Address TBD
				</p>
			</div>
		</LegalLayout>
	);
}
