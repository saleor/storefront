import { PageInfo } from "@/saleor/api";
export interface PaginationProps {
  pageInfo?: PageInfo;
  onLoadMore: () => void;
  totalCount?: number;
  itemCount?: number;
}

export const Pagination: React.VFC<PaginationProps> = ({
  pageInfo,
  onLoadMore,
  itemCount,
  totalCount,
}) => {
  if (!pageInfo || !pageInfo?.hasNextPage) {
    return <></>;
  }

  return (
    <nav className="mt-8 p-4 ">
      <div className="flex justify-center flex-col items-center">
        <a
          onClick={onLoadMore}
          className="relative inline-flex  items-center px-4 py-2 border text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:border-blue-300 cursor-pointer"
        >
          Load More
        </a>
        {itemCount && totalCount && (
          <div className="text-sm text-gray-500 mt-2">
            {itemCount} out of {totalCount}
          </div>
        )}
      </div>
    </nav>
  );
};
