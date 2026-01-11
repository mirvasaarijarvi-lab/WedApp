import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

const KEY = 'current_wedding_id';

type WeddingContextValue = {
  weddingId: string | null;
  ready: boolean;
  setWeddingId: (id: string | null) => Promise<void>;
};

const Ctx = createContext<WeddingContextValue>({ weddingId: null, ready: false, setWeddingId: async () => {} });

export function WeddingProvider({ children }: { children: React.ReactNode }) {
  const [weddingId, setWeddingIdState] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync(KEY).then((val) => {
      setWeddingIdState(val ?? null);
      setReady(true);
    });
  }, []);

  const setWeddingId = useCallback(async (id: string | null) => {
    setWeddingIdState(id);
    if (id) await SecureStore.setItemAsync(KEY, id);
    else await SecureStore.deleteItemAsync(KEY);
  }, []);

  return <Ctx.Provider value={{ weddingId, ready, setWeddingId }}>{children}</Ctx.Provider>;
}

export function useWedding() {
  return useContext(Ctx);
}
