import { createContext, useContext, useState, type ReactNode } from 'react';
import { createReviewApi, type ReviewApi } from './reviewApi';

const ReviewApiContext = createContext<ReviewApi | null>(null);

export function ReviewApiProvider({ children }: { children: ReactNode }) {
  const [api] = useState(createReviewApi);
  return <ReviewApiContext.Provider value={api}>{children}</ReviewApiContext.Provider>;
}

export function useReviewApi(): ReviewApi {
  const api = useContext(ReviewApiContext);
  if (!api) throw new Error('ReviewApiProvider is required');
  return api;
}
