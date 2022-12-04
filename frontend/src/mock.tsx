import liff from "@line/liff";
import LiffMockPlugin from "@line/liff-mock";

liff.use(new LiffMockPlugin());

export const isMocked = import.meta.env.VITE_LIFF_MOCK === "true";
