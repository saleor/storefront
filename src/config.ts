import { SaleorRepository } from "@/repositories/product/SaleorRepository";
import { AlgoliaRepository } from "@/repositories/product/AlgoliaRepository";

const searchRepository = new AlgoliaRepository("channel-pln.PLN.products");

export const repositories = {
	searchRepository: searchRepository,
	// searchRepository: SaleorRepository,
};
