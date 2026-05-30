import { customAlphabet } from "nanoid";

// Unambiguous lowercase + digits for shareable slugs (no 0/o/1/l/i).
const slugAlphabet = "23456789abcdefghjkmnpqrstuvwxyz";
const tokenAlphabet = slugAlphabet + "ABCDEFGHJKLMNPQRSTUVWXYZ";

export const newSlug = customAlphabet(slugAlphabet, 7);
export const newManageToken = customAlphabet(tokenAlphabet, 28);
