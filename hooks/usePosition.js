import useSWR from "swr";
import fetcher from "../lib/fetcher";

export default function usePosition({ fen } = {}) {
  const params = `?${fen ? `fen=${fen}` : ""}`;
  const { data, error, isLoading } = useSWR(`/api/positions${params}`, fetcher);
  return {
    positions: data,
    isLoading,
    isError: error,
  };
}
