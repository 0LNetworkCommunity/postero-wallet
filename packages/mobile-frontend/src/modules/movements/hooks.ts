import { useApolloClient } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_MOVEMENTS, GetAccountMovementsRes } from "./gql-types";
import { gqlMovementMapper } from "./mappers";
import { Movement } from "./types";

export const useMovements = (
  walletAddress: string
): {
  loading: boolean;
  total?: number;
  prevCursor?: string;
  nextCursor?: string;
  error?: string;
  movements?: Movement[];
} => {
  const apolloClient = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [movements, setMovements] = useState<Movement[]>();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await apolloClient.query<GetAccountMovementsRes>({
          query: GET_MOVEMENTS,
          variables: {
            walletAddress,
          },
        });
        if (res.data) {
          const { movements } = res.data;
          setMovements(
            movements.edges.map((edge) => gqlMovementMapper(edge.node))
          );
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [walletAddress]);

  return { loading, movements };
};
