export async function handleView(request, env) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${env.SECRET_KEY}`) {
        return new Response('Não autorizado', { status: 401 });
    }
    const { results } = await env.DB.prepare('SELECT * FROM fingerprints').all();
    return new Response(JSON.stringify(results), {
        headers: { 'Content-Type': 'application/json' }
    });
};