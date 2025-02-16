import { handleFingerprintScript } from "./fingerprint";
import { handleCollect } from "./db";
import { handleView } from "./auth";

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (request.method === "OPTIONS") {
            return handleOptions(request);
        }

        if (url.pathname === "/fingerprint.js") {
            return handleFingerprintScript();
        }

        if (url.pathname === "/collect") {
            return handleCollect(request, env);
        }

        if (url.pathname === "/view") {
            return handleView(request, env);
        }

        return new Response("Rota não encontrada", { status: 404 });
    }
};