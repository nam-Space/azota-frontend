const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    includePaths: [path.join(__dirname, "styles")],
    images: {
        domains: ['localhost'],
    },
    i18n: {
        locales: ['en', 'vi'],
        defaultLocale: 'vi',
        localeDetection: false
    }
};

module.exports = nextConfig;
