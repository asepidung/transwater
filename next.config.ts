import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import { withPayload } from '@payloadcms/next/withPayload';

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: '/api/media/file/**' },
      { pathname: '/images/**' },
    ],
  },
};

const config = withPayload(withNextIntl(nextConfig), { devBundleServerPackages: false });
const payloadHeaders = config.headers;

export default {
  ...config,
  // withPayload memasang header client-hint (Accept-CH/Critical-CH) untuk tema gelap panel
  // admin ke SEMUA rute. Critical-CH membuat browser mengulang request halaman di kunjungan
  // pertama (~600 ms lebih lambat di situs publik). Batasi hanya untuk /admin.
  async headers() {
    const rules = (await payloadHeaders?.()) ?? []
    return rules.map((rule) => (rule.source === '/:path*' ? { ...rule, source: '/admin/:path*' } : rule))
  },
} satisfies NextConfig;
