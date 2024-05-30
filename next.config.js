/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
            "utf-8-validate": "commonjs utf-8-validate",
            bufferutil: "commonjs bufferutil"
        });

        return config
    },
    images: {
        remotePatterns: [
            {
                hostname: 'res.cloudinary.com'
            },
            {
                hostname: 'giphy.com'
            },
            {
                hostname: '**.giphy.com'
            },
            {
                hostname: "chxnlyfrzmwfiheawqdk.supabase.co"
            }
        ]
    }
}

module.exports = nextConfig
