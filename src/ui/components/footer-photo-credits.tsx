import type { HomepagePhotoCredit } from "@/lib/content/types";

const linkClassName =
	"text-inverse-subtle underline-offset-2 transition-colors hover:text-inverse hover:underline";

function PhotoCreditLink({ name, href }: HomepagePhotoCredit) {
	return (
		<a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
			{name}
		</a>
	);
}

function formatCreditList(credits: readonly HomepagePhotoCredit[]) {
	if (credits.length === 1) {
		return (
			<>
				Lifestyle photography by <PhotoCreditLink {...credits[0]} />
			</>
		);
	}

	return (
		<>
			Lifestyle photography by{" "}
			{credits.map((credit, index) => {
				const isLast = index === credits.length - 1;
				const isSecondToLast = index === credits.length - 2;

				return (
					<span key={credit.href}>
						<PhotoCreditLink {...credit} />
						{!isLast ? (isSecondToLast ? " and " : ", ") : null}
					</span>
				);
			})}
		</>
	);
}

export function FooterPhotoCredits({ credits }: { credits: readonly HomepagePhotoCredit[] }) {
	if (credits.length === 0) {
		return null;
	}

	return <p className="text-xs text-inverse-muted">{formatCreditList(credits)}</p>;
}
