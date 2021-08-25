import { PageInfoFragment } from "../saleor/api";
export interface PaginationProps {
  pageInfo?: PageInfoFragment;
  onLoadMore: () => void;
}

export const Pagination: React.VFC<PaginationProps> = ({
  pageInfo,
  onLoadMore,
}) => {
  if (!pageInfo || !pageInfo?.hasNextPage) {
    return <></>;
  }
  return (
    <nav className="mt-8 p-4 border-t border-gray-200">
      <div className="flex justify-center">
        <a
          onClick={onLoadMore}
          className="ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:border-blue-300"
        >
          Load More
        </a>
      </div>
    </nav>
  );
};
