// mimicking mini salesforce context with expiration

import { SalesforceCartContext } from "../type/cart.ts";
import { v4 as uuidv4 } from "uuid";

export class SalesforceCartClient {
  private contexts = new Map<string, SalesforceCartContext>();
  private ttlMs: number;

  constructor(ttlSeconds = 300) {
    this.ttlMs = ttlSeconds * 1000;
  }

  // create
  createContext(): SalesforceCartContext {
    const id = uuidv4();
    const expiresAt = Date.now() + this.ttlMs;
    const context: SalesforceCartContext = { id, expiresAt, data: {} };
    this.contexts.set(id, context);
    return context;
  }

  // get
  getContext(id: string): SalesforceCartContext | null {
    const context = this.contexts.get(id);
    if (!context) return null;
    if (Date.now() > context.expiresAt) {
      this.contexts.delete(id);
      throw new Error("Salesforce context expired");
    }
    return context;
  }

  // update
  patchContext(id: string, data: any): SalesforceCartContext | null {
    const context = this.getContext(id);
    if (!context) return null;
    context.data = { ...context.data, ...data };
    return context;
  }
}
