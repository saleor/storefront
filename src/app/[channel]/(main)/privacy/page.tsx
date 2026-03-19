import type { Metadata } from "next";
import { LegalLayout } from "../legal-layout";

export const metadata: Metadata = {
	title: "Privacy Policy | Infinity BioLabs",
	description:
		"Privacy Policy for Infinity BioLabs — how we collect, use, share, and safeguard your information.",
};

export default function PrivacyPage() {
	return (
		<LegalLayout title="Privacy Policy" lastUpdated="March 19, 2026">
			<p>
				Infinity BioLabs (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting
				the privacy and personal data of those who interact with our website, infinitybiolabs.com (the
				&ldquo;Website&rdquo;), and our services (collectively, the &ldquo;Services&rdquo;). This Privacy
				Policy explains how we collect, use, share, and safeguard your information.
			</p>

			<h2>1. Updates to This Policy</h2>
			<p>
				We may revise this Privacy Policy periodically to reflect changes in our practices, legal obligations,
				or operational requirements. When we do, we will update the &ldquo;Last Updated&rdquo; date and post
				the revised policy on our Website. Material changes will be communicated via email or a prominent
				notice on the Website.
			</p>

			<h2>2. Information We Collect</h2>

			<h3>2.1 Information You Provide</h3>
			<ul>
				<li>
					<strong>Contact information</strong> &mdash; name, email address, phone number, and mailing address
				</li>
				<li>
					<strong>Order details</strong> &mdash; billing and shipping addresses, payment information, and
					purchase history
				</li>
				<li>
					<strong>Account details</strong> &mdash; username, password, and account preferences
				</li>
				<li>
					<strong>Research credentials</strong> &mdash; institutional affiliation, professional email, and
					verification documents (when required under our RUO Policy)
				</li>
				<li>
					<strong>Communications</strong> &mdash; information you share when contacting us, including
					inquiries, feedback, and support requests
				</li>
			</ul>

			<h3>2.2 Information Collected Automatically</h3>
			<p>
				When you interact with our Website, we may collect certain data using cookies, web beacons, and
				similar tracking technologies, including:
			</p>
			<ul>
				<li>
					<strong>Usage information</strong> &mdash; pages visited, time spent on site, navigation paths, and
					referral sources
				</li>
				<li>
					<strong>Device information</strong> &mdash; browser type, operating system, screen resolution, and
					device identifiers
				</li>
				<li>
					<strong>Connection details</strong> &mdash; IP address, approximate geographic location, and
					referring URLs
				</li>
			</ul>

			<h3>2.3 Information from Third Parties</h3>
			<p>
				We may receive information about you from third-party service providers, including payment processors,
				analytics providers, and marketing partners, solely to the extent necessary to fulfill orders, improve
				our Services, or comply with legal obligations.
			</p>

			<h2>3. How We Use Your Information</h2>
			<ul>
				<li>
					<strong>Order fulfillment</strong> &mdash; processing payments, shipping products, and managing
					order inquiries
				</li>
				<li>
					<strong>Account management</strong> &mdash; creating and maintaining your account and sending
					account-related notifications
				</li>
				<li>
					<strong>Research verification</strong> &mdash; verifying credentials for orders requiring compliance
					checks under our RUO Policy
				</li>
				<li>
					<strong>Customer support</strong> &mdash; responding to questions, resolving issues, and improving
					service quality
				</li>
				<li>
					<strong>Marketing</strong> &mdash; sending updates, offers, and newsletters (with opt-out available
					at any time)
				</li>
				<li>
					<strong>Security</strong> &mdash; detecting and preventing unauthorized access, fraud, and abuse
				</li>
				<li>
					<strong>Legal compliance</strong> &mdash; meeting regulatory requirements, enforcing our terms, and
					responding to lawful requests
				</li>
			</ul>

			<h2>4. Cookies and Tracking Technologies</h2>
			<p>
				We use cookies and similar technologies to enhance your experience, analyze Website performance, and
				deliver relevant content. You can manage cookie preferences through your browser settings.
			</p>
			<ul>
				<li>
					<strong>Essential cookies</strong> &mdash; required for the Website to function properly (e.g.,
					session management, shopping cart)
				</li>
				<li>
					<strong>Analytics cookies</strong> &mdash; help us understand visitor behavior and improve Website
					performance
				</li>
				<li>
					<strong>Marketing cookies</strong> &mdash; used to deliver relevant advertisements and measure
					campaign effectiveness
				</li>
			</ul>

			<h2>5. How We Share Your Information</h2>
			<p>We may share your information with trusted third parties in the following limited circumstances:</p>
			<ul>
				<li>
					<strong>Service providers</strong> &mdash; payment processors, shipping carriers, hosting providers,
					and other vendors bound by contractual confidentiality obligations
				</li>
				<li>
					<strong>Analytics providers</strong> &mdash; companies that help us analyze Website usage and
					improve performance
				</li>
				<li>
					<strong>Legal requirements</strong> &mdash; when required by law, court order, subpoena, or
					government request
				</li>
				<li>
					<strong>Business transactions</strong> &mdash; in connection with a merger, acquisition, or sale of
					assets
				</li>
				<li>
					<strong>Fraud prevention</strong> &mdash; to protect against fraudulent, illegal, or harmful
					activity
				</li>
			</ul>
			<div className="legal-callout">
				We do <strong>not</strong> sell, rent, or trade your personal information to third parties for their
				marketing purposes.
			</div>

			<h2>6. International Data Transfers</h2>
			<p>
				Your information may be transferred to and processed in countries other than your country of
				residence. Where such transfers occur, we will ensure appropriate safeguards are in place in
				accordance with applicable data protection laws, including the EU General Data Protection Regulation
				(GDPR) where applicable.
			</p>

			<h2>7. Data Security and Retention</h2>
			<p>
				We implement reasonable technical and organizational security measures to protect your information,
				including SSL/TLS encryption for data in transit, PCI-compliant payment processing, access controls,
				and regular security assessments. However, no method of transmission or storage is completely secure,
				and we cannot guarantee absolute security.
			</p>
			<p>
				We retain your information only for as long as necessary to provide our Services, fulfill the purposes
				outlined in this policy, comply with legal obligations, and resolve disputes. When data is no longer
				needed, it will be securely deleted or anonymized.
			</p>

			<h2>8. Your Privacy Rights</h2>
			<p>Depending on your jurisdiction, you may have certain rights regarding your personal information:</p>
			<ul>
				<li>
					<strong>Access</strong> &mdash; request a copy of the personal information we hold about you
				</li>
				<li>
					<strong>Correction</strong> &mdash; request correction of inaccurate or incomplete information
				</li>
				<li>
					<strong>Deletion</strong> &mdash; request deletion of your personal information, subject to legal
					retention requirements
				</li>
				<li>
					<strong>Portability</strong> &mdash; request a machine-readable copy of your data
				</li>
				<li>
					<strong>Restriction</strong> &mdash; request restriction of processing in certain circumstances
				</li>
				<li>
					<strong>Objection</strong> &mdash; object to processing based on legitimate interests or direct
					marketing
				</li>
				<li>
					<strong>Opt-out</strong> &mdash; unsubscribe from marketing communications at any time
				</li>
			</ul>
			<p>
				To exercise any of these rights, please contact us using the information below. We will respond within
				the timeframe required by applicable law.
			</p>

			<h2>9. Age Restrictions</h2>
			<p>
				Our Services are intended exclusively for individuals who are at least 21 years of age. We do not
				knowingly collect personal data from individuals under 21. If we become aware that such data has been
				collected, we will take prompt steps to delete it.
			</p>

			<h2>10. Third-Party Websites</h2>
			<p>
				Our Website may contain links to third-party websites that we do not own or control. We are not
				responsible for the privacy practices, content, or security of these external sites. We encourage you
				to review their privacy policies before providing any personal information.
			</p>

			<h2>11. Contact Us</h2>
			<p>For questions about this Privacy Policy, to exercise your privacy rights, or to file a complaint:</p>
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
