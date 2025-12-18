import Image from "next/image";
import Link from "next/link";
import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoney } from "@/lib/utils";

type FeaturedProductShowcaseProps = {
	products: readonly ProductListItemFragment[];
	channel: string;
};

type ShowcaseImageProps = {
	src?: string | null;
	alt: string;
	className: string;
	sizes: string;
	priority?: boolean;
};

const getPricePair = (product?: ProductListItemFragment | null) => {
	if (!product) {
		return { sale: null, original: null };
	}

	const start = product.pricing?.priceRange?.start?.gross;
	const stop = product.pricing?.priceRange?.stop?.gross;

	return {
		sale: start ? formatMoney(start.amount, start.currency) : null,
		original: stop ? formatMoney(stop.amount, stop.currency) : null,
	};
};

const ShowcaseImage = ({ src, alt, className, sizes, priority }: ShowcaseImageProps) => (
	<div className={className}>
		{src ? (
			<Image src={src} alt={alt} fill sizes={sizes} priority={priority} style={{ objectFit: "contain" }} />
		) : (
			<div className="image-placeholder">Image coming soon</div>
		)}
	</div>
);

export const FeaturedProductShowcase = ({ products, channel }: FeaturedProductShowcaseProps) => {
	if (!products.length) {
		return null;
	}

	const featuredProduct = products[0];
	const gridProducts = products.slice(1, 3);
	const encodedChannel = encodeURIComponent(channel ?? "");
	const featuredHref = `/${encodedChannel}/products/${featuredProduct.slug}`;
	const { sale: featuredSale, original: featuredOriginal } = getPricePair(featuredProduct);
	const showOriginalPrice = Boolean(featuredOriginal && featuredOriginal !== featuredSale);

	return (
		<>
			<div className="product-showcase" data-aos="fade-left" data-aos-delay="200">
				<Link href={featuredHref} className="product-card featured">
					<ShowcaseImage
						src={featuredProduct?.thumbnail?.url}
						alt={featuredProduct?.thumbnail?.alt ?? featuredProduct.name}
						className="product-image"
						sizes="(max-width: 992px) 80vw, 500px"
						priority
					/>
					<div className="product-badge">{featuredProduct.category?.name ?? "Featured"}</div>
					<div className="product-info">
						<h4>{featuredProduct.name}</h4>
						<div className="price">
							{featuredSale && <span className="sale-price">{featuredSale}</span>}
							{showOriginalPrice && <span className="original-price">{featuredOriginal}</span>}
						</div>
					</div>
				</Link>

				<div className="product-grid">
					{gridProducts.map((product, index) => {
						const href = `/${encodedChannel}/products/${product.slug}`;
						const { sale } = getPricePair(product);

						return (
							<Link
								key={product.id}
								href={href}
								className="product-mini"
								data-aos="zoom-in"
								data-aos-delay={400 + index * 100}
							>
								<ShowcaseImage
									src={product.thumbnail?.url}
									alt={product.thumbnail?.alt ?? product.name}
									className="product-mini-image"
									sizes="(max-width: 992px) 30vw, 120px"
								/>
								{sale && <span className="mini-price">{sale}</span>}
							</Link>
						);
					})}
				</div>
			</div>

			<div className="floating-elements">
				<div className="floating-icon cart" data-aos="fade-up" data-aos-delay="600">
					<i className="bi bi-cart3" />
					<span className="notification-dot">3</span>
				</div>
				<div className="floating-icon wishlist" data-aos="fade-up" data-aos-delay="700">
					<i className="bi bi-heart" />
				</div>
				<div className="floating-icon search" data-aos="fade-up" data-aos-delay="800">
					<i className="bi bi-search" />
				</div>
			</div>
		</>
	);
};
