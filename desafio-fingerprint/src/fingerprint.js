export async function handleFingerprintScript() {
    const script = `
        (async () => {
            const fingerprintData = {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                screen: { width: screen.width, height: screen.height },
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                hardwareConcurrency: navigator.hardwareConcurrency,
                deviceMemory: navigator.deviceMemory || 'unknown'
            };
            await fetch('/collect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fingerprintData)
            });
        })();
    `;
    return new Response(script, {
        headers: { 'Content-Type': 'application/javascript', 'Access-Control-Allow-Origin': '*' }
    });
};