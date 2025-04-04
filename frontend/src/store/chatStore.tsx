import { create } from "zustand";

export type Chat = {
    id: string,
    message: string,
    type: "SENT" | "RECEIVED"
}

type State = {
    chats: Chat[]
}

type Actions = {
    addChat: (message: string, type: "SENT" | "RECEIVED") => void
    reset: () => void
}


const initialState: State = {
    chats : []
}

export const useChatStore = create<State & Actions>()((set, get) => ({
    ...initialState,
    addChat: (message, type) => {
        set({ chats: [{ id: crypto.randomUUID(), message, type}, ...get().chats]})
    },
    reset: () => {
        set(initialState)
    }
}))