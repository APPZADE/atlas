export default function manifest() {
    return {
        name: 'World Encyclopedia',
        short_name: 'Atlas',
        description: 'A modern, interactive encyclopedia of recognized countries.',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        icons: [
            {
                src: '/globe.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
        ],
    };
}
