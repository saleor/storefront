import type { Metadata } from "next";
import { LegalLayout } from "../legal-layout";

export const metadata: Metadata = {
	title: "Research Use Only Policy | Infinity BioLabs",
	description:
		"Research Use Only (RUO) Policy — product classification, authorized purchasers, and compliance requirements for Infinity BioLabs.",
};

export default function RUOPolicyPage() {
	return (
		<LegalLayout title="Research Use Only (RUO) Policy" lastUpdated="March 19, 2026">
			<p>
				Infinity BioLabs (&ldquo;the Company&rdquo;) exclusively provides research-grade peptides, compounds,
				and related materials designated for in-vitro research, laboratory experimentation, and educational
				purposes only. All products are classified as &ldquo;Research Use Only&rdquo; (RUO). No product is
				intended, marketed, or approved for human or animal use, diagnostic purposes, therapeutic
				applications, or any form of consumption.
			</p>

			<h2>1. Purpose and Scope</h2>
			<div className="legal-callout">
				Any use of our products outside of legitimate research constitutes a violation of this policy and{" "}
				<strong>applicable law</strong>.
			</div>

			<h2>2. RUO Classification</h2>
			<p>
				&ldquo;Research Use Only&rdquo; (RUO) is a regulatory classification recognized by the U.S. Food and
				Drug Administration (FDA) and equivalent international regulatory bodies. RUO products are laboratory
				reagents intended for use in controlled research settings by qualified professionals. They have not
				undergone evaluation or approval for safety, efficacy, or quality under the standards applicable to
				pharmaceutical drugs, biologics, or medical devices.
			</p>
			<p>
				In accordance with FDA guidelines, all RUO products must bear the statement: &ldquo;For Research Use
				Only. Not for use in diagnostic procedures.&rdquo;
			</p>

			<h2>3. Research Reagents vs. Pharmaceutical Drugs</h2>
			<table>
				<thead>
					<tr>
						<th>Characteristic</th>
						<th>Research Reagents (RUO)</th>
						<th>Pharmaceutical Drugs</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Intended Use</td>
						<td>Laboratory research only</td>
						<td>Human/animal treatment</td>
					</tr>
					<tr>
						<td>Regulatory Approval</td>
						<td>Not required</td>
						<td>Required (FDA, EMA, etc.)</td>
					</tr>
					<tr>
						<td>Clinical Trials</td>
						<td>Not conducted</td>
						<td>Mandatory (Phase I&ndash;III)</td>
					</tr>
					<tr>
						<td>GMP Manufacturing</td>
						<td>Not required</td>
						<td>Required</td>
					</tr>
					<tr>
						<td>Dosage Guidelines</td>
						<td>Not provided</td>
						<td>Provided and regulated</td>
					</tr>
					<tr>
						<td>Safety/Efficacy Testing</td>
						<td>Not conducted for human use</td>
						<td>Extensive pre-market testing</td>
					</tr>
					<tr>
						<td>Legal for Consumption</td>
						<td>No</td>
						<td>Yes (as prescribed)</td>
					</tr>
				</tbody>
			</table>

			<h2>4. Authorized Purchasers</h2>
			<p>
				Products are available exclusively to qualified individuals and entities engaged in legitimate, lawful
				research activities:
			</p>
			<ul>
				<li>Independent researchers conducting private scientific investigation</li>
				<li>Academic and educational institutions (universities, colleges, research centers)</li>
				<li>Private or commercial research laboratories</li>
				<li>Medical and clinical research facilities engaged in non-therapeutic research</li>
				<li>Biotechnology and pharmaceutical companies conducting R&amp;D</li>
			</ul>
			<p>
				The Company reserves the right to request documentation to verify the purchaser&apos;s status before
				processing any order.
			</p>

			<h2>5. Conditions of Purchase</h2>
			<p>By purchasing from the Company, the purchaser agrees to and certifies all of the following:</p>
			<ul>
				<li>
					The purchaser is at least <strong>21 years of age</strong>
				</li>
				<li>All purchased products will be used exclusively for in-vitro research and laboratory purposes</li>
				<li>
					Products will <strong>NOT</strong> be used for human or animal consumption, injection, ingestion,
					inhalation, or any therapeutic or diagnostic purpose
				</li>
				<li>
					Products will <strong>NOT</strong> be resold, redistributed, or relabeled for human or animal use
				</li>
				<li>
					The purchaser possesses the necessary qualifications, knowledge, and facilities to handle research
					materials safely
				</li>
				<li>
					The purchaser will comply with all applicable local, national, and international laws and
					regulations
				</li>
				<li>
					The purchaser acknowledges that products have not been evaluated by any regulatory authority for
					safety, efficacy, or quality for human use
				</li>
				<li>
					The purchaser assumes full and sole responsibility for the proper use, handling, storage, and
					disposal of all products purchased
				</li>
			</ul>
			<div className="legal-callout">
				<strong>NOTICE:</strong> Misuse of RUO products, including but not limited to human or animal
				administration, is strictly prohibited and may constitute a criminal offense under applicable law. The
				Company reserves the right to refuse, cancel, or revoke any order where there is reasonable suspicion
				of intended misuse.
			</div>

			<h2>6. Product Documentation</h2>
			<p>
				To support legitimate research activities, the Company provides the following documentation for all
				products:
			</p>
			<ul>
				<li>
					<strong>Certificate of Analysis (COA)</strong> &mdash; third-party laboratory testing results
					verifying identity and purity
				</li>
				<li>
					<strong>Safety Data Sheet (SDS)</strong> &mdash; comprehensive safety, handling, storage, and
					disposal information
				</li>
				<li>
					<strong>Product Specifications</strong> &mdash; molecular weight, sequence, physical properties, and
					storage conditions
				</li>
			</ul>
			<p>Documentation is available on each product page and may be downloaded in PDF format.</p>

			<h2>7. Order Verification and Compliance</h2>
			<p>The Company may implement verification procedures for orders, including but not limited to:</p>
			<ul>
				<li>
					Orders exceeding <strong>$1,000</strong> in total value
				</li>
				<li>Orders containing high-volume quantities</li>
				<li>First-time orders from new customers</li>
				<li>Orders flagged by the Company&apos;s automated compliance systems</li>
				<li>Orders shipped to jurisdictions with heightened regulatory requirements</li>
			</ul>
			<p>
				Verification may require providing institutional email addresses, research credentials, a description
				of research purpose, or other supporting documentation. Unverified orders may be held or cancelled.
			</p>

			<h2>8. Regulatory Compliance Notice</h2>
			<p>
				The purchaser acknowledges that the regulatory status of research peptides and compounds varies by
				jurisdiction. It is the purchaser&apos;s sole responsibility to ensure that the purchase, importation,
				possession, and use of any product complies with all applicable laws.
			</p>
			<p>
				The Company makes no representation that any product is lawful to purchase, possess, or use in any
				particular jurisdiction. Products may be subject to import restrictions, seizure, or other regulatory
				action depending on the destination country.
			</p>

			<h2>9. Disclaimer and Limitation of Liability</h2>
			<p>
				All products are sold &ldquo;as is&rdquo; and exclusively for research purposes. The Company makes no
				warranties, express or implied, regarding the suitability of any product for any particular purpose
				beyond in-vitro research.
			</p>
			<p>
				The Company shall not be liable for any direct, indirect, incidental, consequential, special, or
				punitive damages arising from the use or misuse of products. The purchaser agrees to indemnify and
				hold harmless the Company from any and all claims arising from the purchaser&apos;s use, misuse, or
				redistribution of products.
			</p>

			<h2>10. Policy Updates</h2>
			<p>
				The Company reserves the right to modify this RUO Policy at any time. Changes will be effective
				immediately upon posting. Continued use of the website and purchase of products constitutes acceptance
				of any modifications.
			</p>

			<h2>11. Contact Information</h2>
			<p>For questions regarding this Research Use Only Policy or product classification:</p>
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
