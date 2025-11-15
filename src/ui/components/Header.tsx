import { Logo } from "./Logo";
import { Nav } from "./nav/Nav";
import { TopBanner } from "./nav/components/TopBanner";
import { SearchBar } from "@/ui/components/nav/components/SearchBar";
import { CartNavItem } from "@/ui/components/nav/components/CartNavItem";
import { UserMenuContainer } from "@/ui/components/nav/components/UserMenu/UserMenuContainer";
import { MobileNavToggle } from "@/ui/components/nav/components/MobileNavToggle";

export function Header({ channel }: { channel: string }) {
	return (
		<header id="header" className="header sticky-top">
			<TopBanner />
			<div className="main-header">
				<div className="container-fluid container-xl">
					<div className="d-flex align-items-center justify-content-between py-3">
						<Logo />
						<SearchBar channel={channel} />
						<div className="header-actions d-flex align-items-center justify-content-end">
							<button
								className="header-action-btn mobile-search-toggle d-xl-none"
								type="button"
								data-bs-toggle="collapse"
								data-bs-target="#mobileSearch"
								aria-expanded="false"
								aria-controls="mobileSearch"
							>
								<i className="bi bi-search"></i>
							</button>

							<div className="dropdown account-dropdown">
								<UserMenuContainer />
								<div className="dropdown-menu">
									<div className="dropdown-header">
										<h6>
											Welcome to <span className="sitename">FashionStore</span>
										</h6>
										<p className="mb-0">Access account &amp; manage orders</p>
									</div>
									<div className="dropdown-body">
										<a className="dropdown-item d-flex align-items-center" href="account.html">
											<i className="bi bi-person-circle me-2"></i>
											<span>My Profile</span>
										</a>
										<a className="dropdown-item d-flex align-items-center" href="account.html">
											<i className="bi bi-bag-check me-2"></i>
											<span>My Orders</span>
										</a>
										<a className="dropdown-item d-flex align-items-center" href="account.html">
											<i className="bi bi-gear me-2"></i>
											<span>Settings</span>
										</a>
									</div>
									<div className="dropdown-footer">
										<a href="register.html" className="btn btn-primary w-100 mb-2">
											Sign In
										</a>
										<a href="login.html" className="btn btn-outline-primary w-100">
											Register
										</a>
									</div>
								</div>
							</div>

							<CartNavItem channel={channel} />
							<MobileNavToggle />
						</div>
					</div>
				</div>
			</div>
			<div className="header-nav">
				<div className="container-fluid container-xl position-relative">
					<Nav channel={channel} />
				</div>
			</div>
		</header>
	);
}
