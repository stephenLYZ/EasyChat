import { createContext, PropsWithChildren, useContext } from "react";
import { Conversation, Profile } from "../types";

export interface IGlobalContext {
  socket: any;
  activeConversation?: Conversation;
  setActiveConversation: (conversation?: Conversation) => void;
  myProfile?: Profile;
}

export const GlobalContext = createContext<IGlobalContext | undefined>(
  undefined
);

export function GlobalContextProvider({
  children,
  value,
}: PropsWithChildren<{
  value: IGlobalContext;
}>) {
  return (
    <GlobalContext.Provider value={value as unknown as IGlobalContext}>
      {children}
    </GlobalContext.Provider>
  );
}

export function useGlobalContext() {
  const contextValue = useContext(GlobalContext);
  return contextValue as unknown as IGlobalContext;
}
