export async function handleCollect(request, env) {
    if (request.method !== 'POST') {
        return new Response('Método não permitido', { status: 405 });
    }
    const data = await request.json();
    await env.DB.prepare('INSERT INTO fingerprints (data) VALUES (?)').bind(JSON.stringify(data)).run();
    return new Response('Fingerprint salvo', { status: 200 });
};