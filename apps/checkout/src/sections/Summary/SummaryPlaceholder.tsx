import { useFormattedMessages } from "@hooks/useFormattedMessages";
import { Text } from "@components/Text";
import { Skeleton } from "@components/Skeleton";
import { Divider } from "@components/Divider";

export const SummaryPlaceholder = () => {
  const formatMessage = useFormattedMessages();

  return (
    <div className="summary px-6">
      <div className="flex flex-col">
        <div className="summary-row mb-6">
          <Text size="lg" weight="bold" className="hidden sm:block">
            {formatMessage("summary")}
          </Text>
          <Skeleton className="w-1/3 block sm:hidden" />
          <Skeleton className="w-1/4 block sm:hidden" />
        </div>
        <Skeleton className="h-8 w-5/12 block sm:hidden" />
      </div>
      <div className="hidden sm:block">
        <div className="summary-row h-18 mb-4">
          <div className="flex flex-col items-start justify-center flex-wrap">
            <Skeleton className="h-18 w-18 mr-4" />
            <Skeleton className="w-22 mb-4" />
            <Skeleton className="w-18 mb-4" />
            <Skeleton className="w-12" />
          </div>
          <div className="flex flex-col items-end justify center">
            <Skeleton className="w-22 mb-4" />
            <Skeleton className="w-18 mb-4" />
          </div>
        </div>
        <div className="summary-row h-18 mb-8">
          <div className="flex flex-col items-start justify-center flex-wrap">
            <Skeleton className="h-18 w-18 mr-4" />
            <Skeleton className="w-22 mb-4" />
            <Skeleton className="w-18 mb-4" />
          </div>
          <div className="flex flex-col items-end justify center">
            <Skeleton className="w-22 mb-4" />
            <Skeleton className="w-18" />
          </div>
        </div>
        <div className="flex flex-col md:ml-22">
          <div className="summary-row mb-6">
            <Skeleton className="w-22" />
            <Skeleton className="w-18" />
          </div>
          <Divider className="bg-skeleton" />
          <div className="summary-row my-6">
            <Skeleton className="w-16" />
            <Skeleton className="w-14" />
          </div>
          <div className="summary-row mb-6">
            <Skeleton className="w-19" />
            <Skeleton className="w-10" />
          </div>
          <Divider className="bg-skeleton" />
          <div className="summary-row my-6">
            <Skeleton className="w-14" />
            <Skeleton className="w-12" />
          </div>
        </div>
      </div>
    </div>
  );
};
