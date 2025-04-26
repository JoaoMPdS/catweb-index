import { atom, useAtom } from "jotai";

const open = atom<string | false>(false);

export function useAppPromotionalModal() {
   return useAtom(open);
}