import type { GlobalConfig } from 'payload'
import { revalidateSite } from '../lib/revalidate'
import { validateHttpUrl, validateWhatsapp } from '../lib/validate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Pengaturan Situs',
  access: { read: () => true },
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidateSite()
        return doc
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'companyName', type: 'text', required: true, defaultValue: 'PT. Transwater Roberi Indonesia', label: 'Nama perusahaan' },
        { name: 'brandName', type: 'text', required: true, defaultValue: 'ARTIC', label: 'Nama brand' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Kontak',
      admin: { initCollapsed: false },
      fields: [
        { name: 'address', type: 'textarea', localized: true, required: true, label: 'Alamat' },
        { name: 'mapsUrl', type: 'text', label: 'Link Google Maps', validate: validateHttpUrl, admin: { description: 'Harus diawali https://' } },
        { name: 'phone', type: 'text', label: 'Telepon' },
        { name: 'email', type: 'email', label: 'Email' },
        { name: 'hours', type: 'text', label: 'Jam operasional', admin: { description: 'Contoh: 08.00 - 16.00 WIB' } },
        { name: 'instagramUrl', type: 'text', label: 'Link Instagram', validate: validateHttpUrl, admin: { description: 'Contoh: https://www.instagram.com/articwater.id/' } },
        {
          name: 'whatsapp',
          type: 'text',
          label: 'Nomor WhatsApp',
          validate: validateWhatsapp,
          admin: { description: 'Boleh ditulis 0812-3456-7890 atau +62 812 3456 7890; situs mengubahnya ke format yang benar.' },
        },
      ],
    },
    {
      name: 'certifications',
      type: 'array',
      label: 'Legalitas & Sertifikasi (footer)',
      admin: { description: 'Hanya isi yang sudah resmi & valid. Contoh: "BPOM MD 123456".' },
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    {
      name: 'showDeveloperCredit',
      type: 'checkbox',
      defaultValue: true,
      label: 'Tampilkan kredit developer di footer',
      admin: { description: 'Menampilkan "Website oleh IDNX" di bagian bawah situs. Matikan jika diminta.' },
    },
    { name: 'footerDescription', type: 'textarea', localized: true, label: 'Deskripsi singkat footer' },
  ],
}
