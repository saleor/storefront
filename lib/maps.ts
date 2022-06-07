export interface Edge<T> {
  node: T;
}
export interface Connection<T> {
  edges: Array<Edge<T>> | undefined;
}

export function mapEdgesToItems<T>(data: Connection<T> | undefined | null): T[] {
  return data?.edges?.map(({ node }) => node) || [];
}
