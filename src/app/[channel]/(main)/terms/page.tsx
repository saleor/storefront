import type { Metadata } from "next";
import { LegalLayout } from "../legal-layout";

export const metadata: Metadata = {
	title: "Terms of Service | Infinity BioLabs",
	description: "Terms of Service governing access to and use of Infinity BioLabs website and services.",
};

export default function TermsPage() {
	return (
		<LegalLayout title="Terms of Service" lastUpdated="March 19, 2026">
			<p>
				Infinity BioLabs (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). These Terms of Service
				(&ldquo;Terms&rdquo;) govern your access to and use of our website, infinitybiolabs.com (the
				&ldquo;Website&rdquo;), and all products and services offered through it (collectively, the
				&ldquo;Services&rdquo;). By accessing or using our Services, you agree to be bound by these Terms. If
				you do not agree, you must discontinue use immediately.
			</p>

			<h2>1. Acceptance of Terms</h2>
			<p>
				By using our Website, creating an account, or placing an order, you acknowledge that you have read,
				understood, and agree to be bound by these Terms, our Privacy Policy, our Research Use Only (RUO)
				Policy, and our Waiver Agreement. These documents collectively form the complete agreement between you
				and the Company.
			</p>

			<h2>2. Age Requirement</h2>
			<div className="legal-callout">
				You must be at least <strong>21 years of age</strong> to use our Services or purchase products. Orders
				from individuals under 21 will be denied and cancelled without notice.
			</div>

			<h2>3. Research Use Only</h2>
			<p>
				All products sold by the Company are intended solely for in-vitro laboratory research and analytical
				purposes. By purchasing any product, you acknowledge and agree that:
			</p>
			<ul>
				<li>
					Products are <strong>NOT</strong> intended for human or animal consumption, injection, ingestion, or
					inhalation
				</li>
				<li>
					Products are <strong>NOT</strong> intended for use in food, drugs, cosmetics, medical devices, or
					dietary supplements
				</li>
				<li>
					Products are <strong>NOT</strong> intended for diagnostic or therapeutic procedures
				</li>
				<li>
					Products have not been tested, evaluated, or approved by any regulatory body, including the FDA,
					EMA, or any equivalent authority
				</li>
				<li>
					The listing of a product on the Website does not constitute, grant, or imply a license for its use
					in infringement of any patent or intellectual property right
				</li>
			</ul>
			<p>For complete details on research-use requirements, refer to our Research Use Only (RUO) Policy.</p>

			<h2>4. Purchaser Certification</h2>
			<p>By purchasing from the Website, you certify that:</p>
			<ul>
				<li>You are at least 21 years of age</li>
				<li>
					You are a qualified researcher, or affiliated with a qualified institution, laboratory, or research
					entity
				</li>
				<li>
					You possess the necessary qualifications, knowledge, and facilities to handle research materials
					safely
				</li>
				<li>
					You understand and accept the potential hazards associated with the materials and assume full
					responsibility for their safe handling and lawful use
				</li>
				<li>You will comply with all applicable governmental regulations and safety standards</li>
				<li>
					You will <strong>NOT</strong> misuse, adulterate, or resell products for any prohibited use
				</li>
				<li>You will comply with all applicable local, national, and international laws and regulations</li>
			</ul>

			<h2>5. Account Responsibilities</h2>
			<p>When you create an account, you agree to:</p>
			<ul>
				<li>Provide accurate, current, and complete information at registration and maintain its accuracy</li>
				<li>Maintain the security and confidentiality of your account credentials</li>
				<li>Accept sole responsibility for all activities that occur under your account</li>
				<li>Notify us immediately of any unauthorized access to or use of your account</li>
			</ul>

			<h2>6. Products and Orders</h2>
			<ul>
				<li>
					All products are subject to availability. We reserve the right to limit quantities or discontinue
					items at any time without prior notice
				</li>
				<li>
					We strive to display accurate product descriptions and pricing but do not guarantee that all details
					are error-free
				</li>
				<li>
					Orders are accepted upon successful payment processing and confirmation. An order confirmation does
					not constitute a guarantee of shipment
				</li>
				<li>
					We reserve the right to refuse or cancel any order for any reason, including suspected fraud or
					misuse
				</li>
			</ul>

			<h2>7. Order Verification</h2>
			<p>
				To ensure compliance with regulatory guidelines, certain orders may require additional verification
				before processing. This includes orders exceeding specified value thresholds, high-volume orders,
				orders from new customers, and orders flagged by our compliance systems. Unverified orders may be held
				or cancelled.
			</p>

			<h2>8. Final Sale Policy</h2>
			<div className="legal-callout">
				<strong>Orders not yet shipped:</strong> may be cancelled upon request for a full refund.
				<br />
				<br />
				<strong>Orders already shipped or delivered:</strong> all sales are final. No returns, refunds, or
				exchanges will be processed.
			</div>
			<p>
				This policy exists because research materials cannot be restocked or resold once they leave our
				facility, due to quality assurance and chain-of-custody requirements.
			</p>

			<h2>9. Assumption of Risk</h2>
			<p>
				By purchasing any products, you expressly acknowledge and assume all risks associated with handling,
				storing, transporting, or using these compounds. All materials are to be handled exclusively by
				trained and qualified research professionals in appropriate laboratory settings equipped with proper
				safety equipment.
			</p>

			<h2>10. Limitation of Liability</h2>
			<p>
				Our Services and products are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
				warranties of any kind, whether express, implied, or statutory.
			</p>
			<p>
				To the fullest extent permitted by applicable law, the Company shall not be liable for any indirect,
				incidental, special, consequential, or punitive damages, or any loss of profits, revenue, data, or
				use, arising from or related to your use of our Services or products.
			</p>
			<p>
				The Company&apos;s total aggregate liability for any claim shall not exceed the amount you paid for
				the specific product or service giving rise to the claim.
			</p>

			<h2>11. Indemnification</h2>
			<p>
				You agree to indemnify, defend, and hold harmless the Company, its officers, directors, employees,
				agents, and affiliates from and against any and all claims, damages, losses, liabilities, costs, and
				expenses arising from or related to your use or misuse of products, your violation of these Terms, or
				any third-party claims related to your purchase or use of products.
			</p>

			<h2>12. Intellectual Property</h2>
			<p>
				All content on the Website, including text, images, logos, product descriptions, and designs, is owned
				by or licensed to the Company and protected by applicable intellectual property laws. You may not
				reproduce, distribute, modify, or create derivative works without our prior written permission.
			</p>

			<h2>13. Termination</h2>
			<p>
				We may suspend or terminate your access to our Services at our sole discretion, without prior notice,
				for violations of these Terms, suspected fraud, or any conduct we deem harmful to our business or
				compliance obligations.
			</p>

			<h2>14. Governing Law</h2>
			<p>
				These Terms shall be governed by and construed in accordance with the laws of the State of Delaware,
				United States. Any legal disputes will be resolved exclusively in the courts of the State of Delaware.
			</p>

			<h2>15. Changes to These Terms</h2>
			<p>
				We may update these Terms periodically. Changes will be posted on this page with an updated
				&ldquo;Last Updated&rdquo; date. Continued use of our Services following any changes constitutes your
				acceptance of the revised Terms.
			</p>

			<h2>16. Severability</h2>
			<p>
				If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions
				shall continue in full force and effect.
			</p>

			<h2>17. Contact Us</h2>
			<p>For questions about these Terms of Service or for legal correspondence:</p>
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
