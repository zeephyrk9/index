import { Context } from "@workflows/context";
import { promisify } from "util";

export class WebhooksContainer {
    constructor(
        private readonly context: Context
    ) {}

    public async initialize() {
        // Waiting for redis to connect
        await promisify((callback) => {
            const interval = setInterval(() => {
                if (this.context.redis.isReady) {
                    clearInterval(interval);
                    callback(null, true);
                };
            }, 100);
        })();

        console.log("[WebhooksContainer] Redis connected");
    
        // @todo do something? probably
    }

    // public async 
};