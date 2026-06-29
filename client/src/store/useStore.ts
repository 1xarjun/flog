import type { Post } from "@/PostsN";
import { create } from "zustand";
import type { JSONContent } from "@tiptap/react";

type StoreActions = {
  setReplyingTo: (value?: Post) => void;
  setContent: (value?: JSONContent) => void;
  createPost: (value: React.HTMLElementType) => void;
  setCurrentPage: (value: number) => void;
};

type Store = {
  replyingTo?: Post;
  content?: JSONContent;
  currentPage: number;
  totalPages: number;
  actions: StoreActions;
};

const useStore = create<Store>((set) => ({
  replyingTo: undefined,
  content: undefined,
  currentPage: 1,
  totalPages: 1,
  actions: {
    setReplyingTo: (post) => {
      set({ replyingTo: post });
    },

    setContent: (content) => {
      set({ content });
    },

    setCurrentPage: (currentPage) => {
      set({ currentPage });
    },

    createPost: async () => {},
  },
}));

export default useStore;
