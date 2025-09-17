// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    output: 'static',
    redirects: {
        '/': {
            status: 302,
            destination: '/pokemon'
        }
    }
});
