import { Tooltip } from "@mui/material";

interface TrashButtonProps {
  isRemoveProductLoading: boolean;
  handleProductRemove: () => void;
}

export function TrashButton({ isRemoveProductLoading, handleProductRemove }: TrashButtonProps) {
  return (
    <button disabled={isRemoveProductLoading} type="button" onClick={handleProductRemove}>
      <Tooltip
        title={<p className="text-xs">Usuń z koszyka</p>}
        arrow
        enterDelay={300}
        className="hover:fill-red-600"
      >
        <svg height="22" viewBox="0 0 32 32" width="22">
          <path d="M28.496 5.327h-6.236v-1.017c0-1.818-1.479-3.297-3.297-3.297h-5.928c-1.818 0-3.297 1.479-3.297 3.297v1.017h-6.236c-0.462 0-0.832 0.37-0.832 0.832s0.37 0.832 0.832 0.832h1.504v19.546c0 2.452 1.996 4.449 4.449 4.449h13.088c2.452 0 4.449-1.997 4.449-4.449v-19.546h1.504c0.462 0 0.832-0.37 0.832-0.832s-0.37-0.832-0.832-0.832zM11.403 4.311c0-0.9 0.733-1.633 1.633-1.633h5.928c0.9 0 1.633 0.733 1.633 1.633v1.017h-9.194v-1.017zM25.329 26.537c0 1.534-1.251 2.785-2.785 2.785h-13.088c-1.534 0-2.785-1.251-2.785-2.785v-19.546h18.665v19.546h-0.006z M16 26.341c0.462 0 0.832-0.37 0.832-0.832v-14.702c0-0.462-0.37-0.832-0.832-0.832s-0.832 0.37-0.832 0.832v14.696c0 0.462 0.37 0.838 0.832 0.838z M10.571 25.423c0.462 0 0.832-0.37 0.832-0.832v-12.872c0-0.462-0.37-0.832-0.832-0.832s-0.832 0.37-0.832 0.832v12.872c0 0.462 0.376 0.832 0.832 0.832z M21.428 25.423c0.462 0 0.832-0.37 0.832-0.832v-12.872c0-0.462-0.37-0.832-0.832-0.832s-0.832 0.37-0.832 0.832v12.872c0 0.462 0.37 0.832 0.832 0.832z" />
        </svg>
      </Tooltip>
    </button>
  );
}
