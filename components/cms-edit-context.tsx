"use client";
import { createContext, useContext, type ReactNode } from "react";
import { createDataAttribute } from "next-sanity";
import { dataset, projectId } from "@/sanity/env";
const Context = createContext<{ id: string; type: string } | null>(null);
export function CmsEditProvider({ id, type, children }: { id?: string; type: string; children: ReactNode }) {
  return <Context.Provider value={id ? { id, type } : null}>{children}</Context.Provider>;
}
export function keyedPath(array: string, key?: string) {
  return key && /^[a-zA-Z0-9_-]+$/.test(key) ? `${array}[_key==${JSON.stringify(key)}]` : undefined;
}
export function useCmsEdit() {
  const source = useContext(Context);
  return (path?: string) => source && path ? createDataAttribute({ projectId, dataset, ...source, path }).toString() : undefined;
}
