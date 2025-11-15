"use client";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { AnnouncementSlider } from "./AnnouncementSlider";

export const TopBanner = () => {
	return (
		<div className="top-bar py-2">
			<Container fluid="xl" className="container-fluid container-xl">
				<Row className="align-items-center">
					<Col lg={4} className="d-none d-lg-flex">
						<div className="top-bar-item">
							<i className="bi bi-telephone-fill me-2"></i>
							<span>Need help? Call us: </span>
							<a href="tel:+1234567890">+1 (234) 567-890</a>
						</div>
					</Col>
					<Col lg={4} md={12} className="text-center">
						<AnnouncementSlider />
					</Col>
					<Col lg={4} className="d-none d-lg-block">
						<div className="d-flex justify-content-end">
							<Dropdown className="top-bar-item dropdown me-3">
								<Dropdown.Toggle
									as="a"
									href="#"
									className="dropdown-toggle"
									aria-expanded="false"
									data-bs-toggle="dropdown"
								>
									<i className="bi bi-translate me-2"></i>EN
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item href="#">
										<i className="bi bi-check2 selected-icon me-2"></i>English
									</Dropdown.Item>
									<Dropdown.Item href="#">Español</Dropdown.Item>
									<Dropdown.Item href="#">Français</Dropdown.Item>
									<Dropdown.Item href="#">Deutsch</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
							<Dropdown className="top-bar-item dropdown">
								<Dropdown.Toggle as="a" href="#" className="dropdown-toggle" data-bs-toggle="dropdown">
									<i className="bi bi-currency-dollar me-2"></i>USD
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item href="#">
										<i className="bi bi-check2 selected-icon me-2"></i>USD
									</Dropdown.Item>
									<Dropdown.Item href="#">EUR</Dropdown.Item>
									<Dropdown.Item href="#">GBP</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	);
};
