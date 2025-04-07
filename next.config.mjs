/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@storefront-ui/react', 'crypto-js'],
    images: {
        domains: ['storage.extraa.in', 'gbdev.s3.amazonaws.com', 'giftbig.s3.amazonaws.com'],
    },
};

export default nextConfig;
