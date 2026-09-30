// Tipe konten Beranda + teks BAWAAN (data contoh, belum diverifikasi ARTIC).
// Konten yang tampil di situs dibaca dari Payload lewat lib/get-content.ts;
// file ini jadi cadangan dan sumber seed. Teks UI tetap (label form dll) juga di sini.

export type Locale = 'id' | 'en'

export type IconName = 'package' | 'zap' | 'truck' | 'headset'

export interface ProductItem {
  id: string
  name: string
  tagline: string
  image: string
  imageAlt: string
  specs: { label: string; value: string }[]
}

export interface SiteContent {
  locale: Locale
  company: {
    name: string
    brand: string
    address: string
    mapsUrl: string
    phone: string
    email: string
    whatsapp: string
    instagram: string
  }
  banner: string
  nav: { label: string; href: string }[]
  cta: { quote: string; chat: string; whatsappMessage: string }
  lang: { other: Locale; label: string }
  hero: {
    style: 'banner' | 'lake' | 'mountain' | 'forest' | 'photo'
    eyebrow: string
    title: string
    description: string
    facts: { value: string; label: string }[]
  }
  videoSection: { enabled: boolean; eyebrow: string; title: string; text: string }
  trust: { title: string; items: { label: string; status: string }[] }
  products: {
    eyebrow: string
    title: string
    description: string
    quoteCta: string
    items: ProductItem[]
  }
  productPage: {
    listTitle: string
    listDescription: string
    detailsCta: string
    back: string
    specsTitle: string
    quoteCta: string
    chatCta: string
    whatsappMessage: string
    othersTitle: string
  }
  about: {
    eyebrow: string
    title: string
    description: string
    storyTitle: string
    story: string[]
    expertiseTitle: string
    expertise: string[]
    visionTitle: string
    vision: string
    missionTitle: string
    mission: string
    valuesTitle: string
    values: { title: string; text: string }[]
    legalTitle: string
    ctaTitle: string
    ctaText: string
  }
  contactPage: { title: string; description: string }
  quality: {
    eyebrow: string
    title: string
    description: string
    pillarsTitle: string
    pillars: { title: string; text: string }[]
    legalTitle: string
    legalNote: string
    ctaTitle: string
    ctaText: string
  }
  qualityGallery: {
    title: string
    intro: string
    items: { file: string; alt: string; caption: string }[]
  }
  orderPage: {
    eyebrow: string
    title: string
    description: string
    faqTitle: string
    faqs: { q: string; a: string }[]
    ctaTitle: string
    ctaText: string
  }
  privacyPage: {
    title: string
    updated: string
    intro: string
    sections: { title: string; text: string }[]
  }
  benefits: {
    eyebrow: string
    title: string
    items: { icon: IconName; title: string; text: string }[]
  }
  segments: { eyebrow: string; title: string; items: string[] }
  process: { eyebrow: string; title: string; steps: { title: string; text: string }[] }
  quote: {
    eyebrow: string
    title: string
    description: string
    addressTitle: string
    phoneTitle: string
    emailTitle: string
    mapsLabel: string
    form: {
      company: string
      name: string
      contact: string
      product: string
      productPlaceholder: string
      productOther: string
      volume: string
      volumePlaceholder: string
      message: string
      messagePlaceholder: string
      submit: string
      sending: string
      successTitle: string
      successText: string
      error: string
    }
  }
  footer: {
    description: string
    menuTitle: string
    certTitle: string
    certifications: string[]
    rights: string
    privacy: string
    credit: string
  }
  showCredit: boolean
}

const company = {
  name: 'PT. Transwater Roberi Indonesia',
  brand: 'ARTIC',
  address: 'Jl. Ciuncal No. RT.002/001, Cipeucang, Kec. Cileungsi, Kabupaten Bogor, Jawa Barat 16820',
  mapsUrl: 'https://maps.app.goo.gl/H3HvSkB4SLefVigU8',
  // DUMMY sampai TRI kirim data resmi
  phone: '(021) 555-8989',
  email: 'info@articwater.co.id',
  whatsapp: '6281399641608',
  instagram: 'https://www.instagram.com/articwater.id/',
}

const images = {
  p330: '/images/product_330ml.png',
  p600: '/images/product_600ml.png',
  gallon: '/images/product_gallon.png',
}

const id: SiteContent = {
  locale: 'id',
  company,
  banner: 'Mockup tampilan dengan data contoh. Isi belum diverifikasi ARTIC.',
  showCredit: true,
  nav: [
    { label: 'Produk', href: '/id/produk' },
    { label: 'Tentang', href: '/id/tentang' },
    { label: 'Kualitas', href: '/id/kualitas' },
    { label: 'Cara Pesan', href: '/id/cara-pesan' },
    { label: 'Kontak', href: '/id/kontak' },
  ],
  cta: {
    quote: 'Minta Penawaran',
    chat: 'Chat WhatsApp',
    whatsappMessage: 'Halo ARTIC, saya ingin menanyakan penawaran untuk kebutuhan bisnis kami.',
  },
  lang: { other: 'en', label: 'EN' },
  hero: {
    style: 'banner',
    eyebrow: 'Air minum dalam kemasan untuk bisnis',
    title: 'Air mineral ARTIC untuk kebutuhan bisnis Anda',
    description:
      'Tersedia dalam kemasan botol 330 ml, 600 ml, dan galon 19 liter untuk distributor, hotel, restoran, perkantoran, dan acara. Kirim kebutuhan Anda dan tim kami akan menghubungi kembali dengan penawaran.',
    facts: [
      { value: '3', label: 'varian kemasan' },
      { value: '330 ml - 19 L', label: 'rentang ukuran' },
      { value: 'Bogor', label: 'Jawa Barat' },
    ],
  },
  videoSection: {
    enabled: true,
    eyebrow: 'Sekilas ARTIC',
    title: 'Segar dari sumbernya',
    text: 'Air minum dalam kemasan ARTIC diproduksi di Cileungsi, Bogor, dengan pengolahan bertahap dan kontrol kualitas di setiap tahap.',
  },
  trust: {
    title: 'Legalitas & sertifikasi',
    items: [
      { label: 'DJKI', status: 'Merek terdaftar · IDM000818024' },
      { label: 'BPOM', status: 'MD 122882000900549 (botol)' },
      { label: 'BPOM', status: 'Galon: menyusul (perpanjangan diproses)' },
      { label: 'Halal', status: 'Nomor menyusul' },
      { label: 'SNI', status: 'Nomor menyusul' },
      { label: 'ISO', status: 'Nomor menyusul' },
    ],
  },
  products: {
    eyebrow: 'Katalog produk',
    title: 'Pilih kemasan sesuai kebutuhan',
    description: 'Tiga varian kemasan dengan spesifikasi ringkas. Harga diberikan lewat penawaran sesuai volume pesanan.',
    quoteCta: 'Minta Penawaran',
    items: [
      {
        id: '330ml',
        name: 'ARTIC 330 ml',
        tagline: 'Praktis untuk rapat, acara, dan tamu.',
        image: images.p330,
        imageAlt: 'Botol ARTIC 330 ml',
        specs: [
          { label: 'Volume', value: '330 ml' },
          { label: 'Kemasan', value: 'Botol' },
          { label: 'Isi per karton', value: '24 botol' },
        ],
      },
      {
        id: '600ml',
        name: 'ARTIC 600 ml',
        tagline: 'Pilihan harian untuk kantor dan pelanggan.',
        image: images.p600,
        imageAlt: 'Botol ARTIC 600 ml',
        specs: [
          { label: 'Volume', value: '600 ml' },
          { label: 'Kemasan', value: 'Botol' },
          { label: 'Isi per karton', value: '24 botol' },
        ],
      },
      {
        id: 'gallon',
        name: 'ARTIC Galon 19 L',
        tagline: 'Pasokan utama untuk kantor dan usaha.',
        image: images.gallon,
        imageAlt: 'Galon ARTIC 19 liter',
        specs: [
          { label: 'Volume', value: '19 liter' },
          { label: 'Kemasan', value: 'Galon' },
          { label: 'Minimum order', value: 'Menyusul' },
        ],
      },
    ],
  },
  productPage: {
    listTitle: 'Katalog Produk',
    listDescription: 'Pilih ukuran kemasan sesuai kebutuhan. Harga dan ketersediaan kami informasikan lewat penawaran.',
    detailsCta: 'Lihat detail',
    back: 'Semua produk',
    specsTitle: 'Spesifikasi',
    quoteCta: 'Minta Penawaran',
    chatCta: 'Tanya via WhatsApp',
    whatsappMessage: 'Halo ARTIC, saya ingin menanyakan produk {product}.',
    othersTitle: 'Produk lainnya',
  },
  about: {
    eyebrow: 'Tentang kami',
    title: 'Air minum kemasan yang "Baik dan Benar", diproduksi di Bogor',
    description:
      'PT. Transwater Roberi Indonesia berdiri pada 2017 dan memproduksi air minum dalam kemasan ARTIC di Cileungsi, Bogor: botol 330 ml, 600 ml, dan galon 19 liter untuk bisnis maupun masyarakat.',
    storyTitle: 'Tentang perusahaan',
    story: [
      'Kami adalah produsen air minum dalam kemasan (AMDK) yang berbasis di Cileungsi, Kabupaten Bogor. Selain air mineral ARTIC, kami menyediakan air alkali (pH tinggi) dan air alkali elektron.',
      'Bagi pelanggan bisnis, air minum harus aman dan konsisten dari satu pengiriman ke pengiriman berikutnya. Karena itu setiap tahap, mulai dari pengolahan air sampai pengemasan, dijalankan dengan kontrol kualitas yang ketat.',
      'Di balik itu ada tim karyawan terlatih yang fokus pada mutu produk dan inovasi berkelanjutan, dalam lingkungan kerja yang asri, aman, dan nyaman.',
    ],
    expertiseTitle: 'Yang kami olah',
    expertise: ['Reverse Osmosis (RO)', 'Air mineral', 'Air alkali (pH tinggi)', 'Air alkali elektron'],
    visionTitle: 'Visi',
    vision:
      'Menjadi produsen air minum dalam kemasan yang "Baik dan Benar" untuk Indonesia yang sehat, dan menjangkau pasar internasional.',
    missionTitle: 'Misi',
    mission:
      'Menyediakan air minum yang "Baik dan Benar" dengan teknologi modern demi kesehatan masyarakat Indonesia. Membangun citra merek dan layanan yang unggul, serta menjalin kemitraan yang saling menguntungkan.',
    valuesTitle: 'Nilai yang kami pegang',
    values: [
      { title: 'Integritas', text: 'Bekerja dengan jujur dan dapat dipercaya.' },
      { title: 'Kemitraan', text: 'Membangun kerja sama jangka panjang dengan pelanggan dan mitra.' },
      { title: 'Profesional', text: 'Tim yang berdaya dan profesional di setiap bagian.' },
      { title: 'Pertumbuhan', text: 'Tumbuh bersama untuk Indonesia yang lebih sehat.' },
    ],
    legalTitle: 'Legalitas & sertifikasi',
    ctaTitle: 'Butuh pasokan air minum untuk bisnis Anda?',
    ctaText: 'Ceritakan kebutuhan Anda, tim kami akan mengirimkan penawaran.',
  },
  contactPage: {
    title: 'Hubungi kami',
    description: 'Kirim formulir, chat WhatsApp, atau kunjungi kantor kami. Tim kami akan menghubungi Anda kembali.',
  },
  quality: {
    eyebrow: 'Kualitas',
    title: 'Kualitas dijaga di setiap tahap',
    description:
      'Dari pengujian sumber air sampai pengemasan dan gudang, setiap tahap produksi ARTIC melewati kontrol kualitas yang ketat.',
    pillarsTitle: 'Cara kami menjaga mutu',
    pillars: [
      { title: 'Sumber air diuji dulu', text: 'Proses dimulai dari pengujian sumber air yang ketat, sebelum air masuk ke produksi.' },
      { title: 'Pengolahan bertahap', text: 'Air diolah dengan teknologi modern, termasuk reverse osmosis, untuk menyingkirkan kemungkinan kontaminasi.' },
      { title: 'Diuji lagi setelah diolah', text: 'Pengujian tambahan setelah pengolahan memastikan air benar-benar bebas dari kontaminasi.' },
      { title: 'Higienis sampai dikemas', text: 'Kebersihan dan sterilisasi dijaga selama proses pengemasan.' },
      { title: 'Bisa dilacak per batch', text: 'Setiap batch diberi kode sehingga asal produksinya dapat ditelusuri.' },
      { title: 'Diaudit rutin', text: 'Audit rutin memastikan prosedur dipatuhi dan setiap masalah cepat ditangani.' },
    ],
    legalTitle: 'Legalitas & sertifikasi',
    legalNote:
      'Nomor BPOM tertera di atas. Sertifikat lain akan kami tampilkan setelah nomornya diverifikasi. Untuk kebutuhan tender atau vendor, silakan minta salinan dokumen lewat formulir penawaran.',
    ctaTitle: 'Butuh dokumen atau sampel produk?',
    ctaText: 'Sampaikan kebutuhan Anda, tim kami siap membantu.',
  },

  qualityGallery: {
    title: 'Dari pengolahan air sampai gudang',
    intro: 'Beberapa sudut fasilitas produksi kami di Cileungsi, Bogor.',
    items: [
      { file: 'filter', alt: 'Tangki penyaringan air di area produksi', caption: 'Penyaringan air awal' },
      { file: 'alkali', alt: 'Tangki pengolahan air alkali', caption: 'Pengolahan air alkali' },
      { file: 'ro', alt: 'Unit reverse osmosis', caption: 'Unit reverse osmosis (RO)' },
      { file: 'filling-inside', alt: 'Bagian dalam mesin pengisian botol', caption: 'Mesin pengisian botol' },
      { file: 'capped-label', alt: 'Botol berlabel ARTIC di jalur produksi', caption: 'Botol berlabel ARTIC di jalur produksi' },
      { file: 'packing', alt: 'Petugas memasukkan botol ke dalam karton', caption: 'Pengemasan ke dalam karton' },
      { file: 'warehouse', alt: 'Gudang produk jadi dengan tumpukan karton ARTIC', caption: 'Gudang produk jadi' },
    ],
  },

  orderPage: {
    eyebrow: 'Cara pesan',
    title: 'Pesan air minum untuk bisnis Anda',
    description: 'Prosesnya singkat: kirim kebutuhan, terima penawaran, sepakati jadwal, lalu pengiriman berjalan.',
    faqTitle: 'Pertanyaan yang sering diajukan',
    faqs: [
      { q: 'Berapa minimum pemesanan?', a: 'Minimum pemesanan akan kami informasikan lewat penawaran karena dapat berbeda untuk tiap produk. Hubungi kami untuk detailnya.' },
      { q: 'Apakah bisa dikirim rutin setiap minggu atau bulan?', a: 'Bisa. Jadwal pengiriman rutin dapat disepakati saat penawaran.' },
      { q: 'Wilayah mana saja yang dilayani?', a: 'Kami melayani wilayah Jabodetabek. Sebutkan lokasi pengiriman Anda pada formulir agar kami dapat memastikan.' },
      { q: 'Bagaimana pembayarannya?', a: 'Metode dan termin pembayaran disepakati bersama dalam penawaran.' },
      { q: 'Bisakah meminta sampel atau dokumen legalitas?', a: 'Silakan sampaikan lewat formulir penawaran atau WhatsApp, dan tim kami akan menindaklanjuti.' },
    ],
    ctaTitle: 'Siap memesan?',
    ctaText: 'Kirim kebutuhan Anda dan kami hubungi kembali.',
  },
  privacyPage: {
    title: 'Kebijakan Privasi',
    updated: 'Terakhir diperbarui: 30 September 2026',
    intro:
      'PT. Transwater Roberi Indonesia ("kami") menghargai privasi Anda. Kebijakan ini menjelaskan data apa yang kami kumpulkan lewat situs ini, untuk apa, dan bagaimana kami menjaganya.',
    sections: [
      { title: 'Data yang kami kumpulkan', text: 'Saat Anda mengirim formulir permintaan penawaran, kami menerima data yang Anda isi: nama perusahaan, nama Anda, nomor WhatsApp atau telepon, produk yang diminati, perkiraan kebutuhan, dan catatan tambahan. Server kami juga mencatat data teknis dasar seperti alamat IP dan jenis peramban pada log, yang kami pakai untuk keamanan dan mencegah penyalahgunaan formulir.' },
      { title: 'Cara kami menggunakan data', text: 'Data formulir kami gunakan untuk menghubungi Anda, menyiapkan penawaran, dan menindaklanjuti permintaan atau pesanan Anda. Data teknis kami gunakan untuk menjaga keamanan situs dan membatasi spam.' },
      { title: 'Berbagi data', text: 'Kami tidak menjual data pribadi Anda. Data hanya dapat diakses tim internal kami yang berwenang dan penyedia layanan teknis yang membantu menjalankan situs (misalnya hosting dan layanan email), atau jika diwajibkan oleh hukum.' },
      { title: 'Penyimpanan dan keamanan', text: 'Data disimpan di server yang kami kelola dengan akses terbatas. Kami menyimpannya selama diperlukan untuk menindaklanjuti permintaan Anda dan untuk keperluan usaha yang sah, lalu menghapus atau menganonimkannya bila sudah tidak diperlukan.' },
      { title: 'Cookie', text: 'Situs ini saat ini tidak menggunakan cookie pelacakan atau iklan. Jika kelak kami menambahkan alat analitik, kebijakan ini akan diperbarui dan Anda akan diberi tahu.' },
      { title: 'Hak Anda', text: 'Sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi, Anda berhak meminta akses, perbaikan, atau penghapusan data pribadi Anda, serta menarik persetujuan yang telah diberikan. Hubungi kami lewat kontak di bawah untuk mengajukan permintaan.' },
      { title: 'Tautan ke pihak ketiga', text: 'Situs ini memuat tautan ke layanan lain seperti WhatsApp dan Google Maps. Layanan tersebut memiliki kebijakan privasi sendiri yang tidak kami kendalikan.' },
      { title: 'Perubahan kebijakan', text: 'Kami dapat memperbarui kebijakan ini dari waktu ke waktu. Tanggal pembaruan terakhir tercantum di bagian atas halaman ini.' },
    ],
  },
  benefits: {
    eyebrow: 'Mengapa ARTIC',
    title: 'Kemudahan untuk pembeli bisnis',
    items: [
      { icon: 'package', title: 'Kemasan sesuai kebutuhan', text: 'Dari botol 330 ml untuk acara hingga galon 19 liter untuk kantor.' },
      { icon: 'zap', title: 'Penawaran langsung', text: 'Kirim kebutuhan Anda dan tim kami menghubungi kembali dengan penawaran.' },
      { icon: 'truck', title: 'Pengiriman berkala', text: 'Jadwal pengiriman dapat didiskusikan sesuai kebutuhan Anda.' },
      { icon: 'headset', title: 'Satu kontak langsung', text: 'Komunikasi langsung dengan tim kami lewat WhatsApp atau telepon.' },
    ],
  },
  segments: {
    eyebrow: 'Kami melayani',
    title: 'Untuk berbagai kebutuhan usaha',
    items: ['Distributor & agen', 'Hotel, restoran & kafe', 'Perkantoran', 'Event & katering', 'Sekolah & instansi'],
  },
  process: {
    eyebrow: 'Cara pemesanan',
    title: 'Tiga langkah sederhana',
    steps: [
      { title: 'Kirim kebutuhan', text: 'Isi formulir atau chat WhatsApp: produk, perkiraan volume, dan lokasi pengiriman.' },
      { title: 'Terima penawaran', text: 'Tim kami menghubungi kembali dengan harga dan ketentuan sesuai volume.' },
      { title: 'Konfirmasi & pengiriman', text: 'Setelah disepakati, pesanan dijadwalkan untuk dikirim.' },
    ],
  },
  quote: {
    eyebrow: 'Minta penawaran',
    title: 'Ceritakan kebutuhan Anda',
    description: 'Isi formulir singkat ini. Tim kami akan menghubungi Anda kembali.',
    addressTitle: 'Alamat kantor',
    phoneTitle: 'Telepon',
    emailTitle: 'Email',
    mapsLabel: 'Lihat di Google Maps',
    form: {
      company: 'Nama perusahaan',
      name: 'Nama Anda',
      contact: 'Nomor WhatsApp / telepon',
      product: 'Produk yang diminati',
      productPlaceholder: 'Pilih produk',
      productOther: 'Lebih dari satu / lainnya',
      volume: 'Perkiraan kebutuhan',
      volumePlaceholder: 'Contoh: 50 karton per bulan',
      message: 'Catatan tambahan',
      messagePlaceholder: 'Lokasi pengiriman atau hal lain yang perlu kami ketahui',
      submit: 'Kirim Permintaan',
      sending: 'Mengirim...',
      successTitle: 'Permintaan terkirim',
      successText: 'Terima kasih, kami akan segera menghubungi Anda.',
      error: 'Gagal mengirim. Silakan coba lagi atau hubungi kami lewat WhatsApp.',
    },
  },
  footer: {
    description: 'Air minum dalam kemasan ARTIC oleh PT. Transwater Roberi Indonesia.',
    menuTitle: 'Menu',
    certTitle: 'Legalitas',
    certifications: ['Merek ARTIC terdaftar DJKI: IDM000818024', 'BPOM botol: MD 122882000900549', 'BPOM galon: menyusul (perpanjangan diproses)', 'Halal: menyusul', 'SNI: menyusul', 'ISO: menyusul'],
    rights: 'Hak cipta dilindungi.',
    credit: 'Website oleh',
    privacy: 'Kebijakan Privasi',
  },
}

const en: SiteContent = {
  locale: 'en',
  company,
  banner: 'Design mockup with sample data. Content is not yet verified by ARTIC.',
  showCredit: true,
  nav: [
    { label: 'Products', href: '/en/produk' },
    { label: 'About', href: '/en/tentang' },
    { label: 'Quality', href: '/en/kualitas' },
    { label: 'How to Order', href: '/en/cara-pesan' },
    { label: 'Contact', href: '/en/kontak' },
  ],
  cta: {
    quote: 'Request a Quote',
    chat: 'Chat on WhatsApp',
    whatsappMessage: 'Hello ARTIC, I would like to ask about a quotation for our business.',
  },
  lang: { other: 'id', label: 'ID' },
  hero: {
    style: 'banner',
    eyebrow: 'Bottled drinking water for business',
    title: 'ARTIC mineral water for your business needs',
    description:
      'Available in 330 ml and 600 ml bottles and a 19-liter gallon for distributors, hotels, restaurants, offices, and events. Send us your requirements and our team will get back to you with a quotation.',
    facts: [
      { value: '3', label: 'packaging options' },
      { value: '330 ml - 19 L', label: 'size range' },
      { value: 'Bogor', label: 'West Java' },
    ],
  },
  videoSection: {
    enabled: true,
    eyebrow: 'A glimpse of ARTIC',
    title: 'Fresh from the source',
    text: 'ARTIC bottled drinking water is produced in Cileungsi, Bogor, with step-by-step treatment and quality control at every stage.',
  },
  trust: {
    title: 'Legality & certification',
    items: [
      { label: 'DJKI', status: 'Registered trademark · IDM000818024' },
      { label: 'BPOM', status: 'MD 122882000900549 (bottle)' },
      { label: 'BPOM', status: 'Gallon: pending (renewal in progress)' },
      { label: 'Halal', status: 'Number pending' },
      { label: 'SNI', status: 'Number pending' },
      { label: 'ISO', status: 'Number pending' },
    ],
  },
  products: {
    eyebrow: 'Product catalog',
    title: 'Choose the packaging you need',
    description: 'Three packaging options with concise specifications. Pricing is provided through a quotation based on order volume.',
    quoteCta: 'Request a Quote',
    items: [
      {
        id: '330ml',
        name: 'ARTIC 330 ml',
        tagline: 'Practical for meetings, events, and guests.',
        image: images.p330,
        imageAlt: 'ARTIC 330 ml bottle',
        specs: [
          { label: 'Volume', value: '330 ml' },
          { label: 'Packaging', value: 'Bottle' },
          { label: 'Units per carton', value: '24 bottles' },
        ],
      },
      {
        id: '600ml',
        name: 'ARTIC 600 ml',
        tagline: 'Everyday choice for offices and customers.',
        image: images.p600,
        imageAlt: 'ARTIC 600 ml bottle',
        specs: [
          { label: 'Volume', value: '600 ml' },
          { label: 'Packaging', value: 'Bottle' },
          { label: 'Units per carton', value: '24 bottles' },
        ],
      },
      {
        id: 'gallon',
        name: 'ARTIC Gallon 19 L',
        tagline: 'Main supply for offices and businesses.',
        image: images.gallon,
        imageAlt: 'ARTIC 19 liter gallon',
        specs: [
          { label: 'Volume', value: '19 liters' },
          { label: 'Packaging', value: 'Gallon' },
          { label: 'Minimum order', value: 'Coming soon' },
        ],
      },
    ],
  },
  productPage: {
    listTitle: 'Product Catalog',
    listDescription: 'Choose the package size that fits your needs. We share pricing and availability through a quotation.',
    detailsCta: 'View details',
    back: 'All products',
    specsTitle: 'Specifications',
    quoteCta: 'Request a Quote',
    chatCta: 'Ask on WhatsApp',
    whatsappMessage: 'Hello ARTIC, I would like to ask about the {product} product.',
    othersTitle: 'Other products',
  },
  about: {
    eyebrow: 'About us',
    title: 'Bottled water that is "Good and Right", made in Bogor',
    description:
      'PT. Transwater Roberi Indonesia was founded in 2017 and produces ARTIC bottled drinking water in Cileungsi, Bogor: 330 ml and 600 ml bottles and 19-liter gallons for businesses and the public.',
    storyTitle: 'About the company',
    story: [
      'We are a bottled drinking water producer based in Cileungsi, Bogor Regency. Besides ARTIC mineral water, we offer alkaline water (high pH) and electrolyzed alkaline water.',
      'For business customers, drinking water has to be safe and consistent from one delivery to the next. That is why every stage, from water treatment to packing, runs under strict quality control.',
      'Behind it is a team of trained employees focused on product quality and continuous innovation, in a green, safe, and comfortable working environment.',
    ],
    expertiseTitle: 'What we process',
    expertise: ['Reverse Osmosis (RO)', 'Mineral water', 'Alkaline water (high pH)', 'Electrolyzed alkaline water'],
    visionTitle: 'Vision',
    vision:
      'To become a bottled drinking water producer that is "Good and Right" for a healthy Indonesia, and to reach the international market.',
    missionTitle: 'Mission',
    mission:
      'To provide "Good and Right" drinking water with modern technology for the health of Indonesians. To build an outstanding brand image and service, and to form mutually beneficial partnerships.',
    valuesTitle: 'What we stand for',
    values: [
      { title: 'Integrity', text: 'Working honestly and being someone you can trust.' },
      { title: 'Partnership', text: 'Building long-term cooperation with customers and partners.' },
      { title: 'Professionalism', text: 'An empowered, professional team in every role.' },
      { title: 'Growth', text: 'Growing together toward a healthier Indonesia.' },
    ],
    legalTitle: 'Legality & certifications',
    ctaTitle: 'Need drinking water supply for your business?',
    ctaText: 'Tell us what you need and our team will send a quotation.',
  },
  contactPage: {
    title: 'Contact us',
    description: 'Send the form, chat on WhatsApp, or visit our office. Our team will get back to you.',
  },
  quality: {
    eyebrow: 'Quality',
    title: 'Quality protected at every stage',
    description:
      'From testing the water source to packing and the warehouse, every stage of ARTIC production goes through strict quality control.',
    pillarsTitle: 'How we protect quality',
    pillars: [
      { title: 'The source is tested first', text: 'The process starts with strict testing of the water source, before water enters production.' },
      { title: 'Step-by-step treatment', text: 'Water is treated with modern technology, including reverse osmosis, to remove any possibility of contamination.' },
      { title: 'Tested again after treatment', text: 'Additional testing after treatment confirms the water is free from contamination.' },
      { title: 'Hygienic through packing', text: 'Cleanliness and sterilization are maintained throughout packing.' },
      { title: 'Traceable by batch', text: 'Every batch is coded so its production origin can be traced.' },
      { title: 'Audited routinely', text: 'Routine audits make sure procedures are followed and any issue is handled quickly.' },
    ],
    legalTitle: 'Legality & certifications',
    legalNote:
      'BPOM numbers are shown above. Other certificates will be displayed once their numbers are verified. For tender or vendor needs, please request copies through the quote form.',
    ctaTitle: 'Need documents or a product sample?',
    ctaText: 'Tell us what you need and our team is ready to help.',
  },

  qualityGallery: {
    title: 'From water treatment to the warehouse',
    intro: 'A look around our production facility in Cileungsi, Bogor.',
    items: [
      { file: 'filter', alt: 'Water filtration tanks in the production area', caption: 'Initial water filtration' },
      { file: 'alkali', alt: 'Alkaline water treatment tanks', caption: 'Alkaline water treatment' },
      { file: 'ro', alt: 'Reverse osmosis unit', caption: 'Reverse osmosis (RO) unit' },
      { file: 'filling-inside', alt: 'Inside the bottle filling machine', caption: 'Bottle filling machine' },
      { file: 'capped-label', alt: 'ARTIC-labeled bottles on the production line', caption: 'ARTIC-labeled bottles on the line' },
      { file: 'packing', alt: 'A worker placing bottles into a carton', caption: 'Packing into cartons' },
      { file: 'warehouse', alt: 'Finished goods warehouse with stacked ARTIC cartons', caption: 'Finished goods warehouse' },
    ],
  },

  orderPage: {
    eyebrow: 'How to order',
    title: 'Order drinking water for your business',
    description: 'The process is short: send your needs, receive a quotation, agree on a schedule, and deliveries begin.',
    faqTitle: 'Frequently asked questions',
    faqs: [
      { q: 'What is the minimum order?', a: 'We will share the minimum order in the quotation since it may differ per product. Contact us for details.' },
      { q: 'Can you deliver on a weekly or monthly schedule?', a: 'Yes. A recurring delivery schedule can be agreed when we send the quotation.' },
      { q: 'Which areas do you serve?', a: 'We serve the Greater Jakarta area. Tell us your delivery location in the form so we can confirm.' },
      { q: 'How does payment work?', a: 'Payment method and terms are agreed together in the quotation.' },
      { q: 'Can I request a sample or legal documents?', a: 'Please ask through the quote form or WhatsApp and our team will follow up.' },
    ],
    ctaTitle: 'Ready to order?',
    ctaText: 'Send your needs and we will get back to you.',
  },
  privacyPage: {
    title: 'Privacy Policy',
    updated: 'Last updated: 30 September 2026',
    intro:
      'PT. Transwater Roberi Indonesia ("we") respects your privacy. This policy explains what data we collect through this website, why, and how we protect it.',
    sections: [
      { title: 'Data we collect', text: 'When you submit the quote request form, we receive the data you enter: company name, your name, WhatsApp or phone number, product of interest, estimated needs, and additional notes. Our server also records basic technical data such as IP address and browser type in logs, which we use for security and to prevent form abuse.' },
      { title: 'How we use data', text: 'We use form data to contact you, prepare a quotation, and follow up on your request or order. We use technical data to keep the website secure and to limit spam.' },
      { title: 'Sharing data', text: 'We do not sell your personal data. Data is only accessible to our authorized internal team and to technical service providers who help run the website (such as hosting and email services), or when required by law.' },
      { title: 'Storage and security', text: 'Data is stored on servers we manage with restricted access. We keep it as long as needed to follow up on your request and for legitimate business purposes, then delete or anonymize it when no longer needed.' },
      { title: 'Cookies', text: 'This website currently does not use tracking or advertising cookies. If we add analytics tools later, this policy will be updated and you will be informed.' },
      { title: 'Your rights', text: 'Under Indonesian Law No. 27 of 2022 on Personal Data Protection, you have the right to request access to, correction of, or deletion of your personal data, and to withdraw consent you have given. Contact us using the details below to make a request.' },
      { title: 'Third-party links', text: 'This website contains links to other services such as WhatsApp and Google Maps. Those services have their own privacy policies which we do not control.' },
      { title: 'Changes to this policy', text: 'We may update this policy from time to time. The date of the latest update is shown at the top of this page.' },
    ],
  },
  benefits: {
    eyebrow: 'Why ARTIC',
    title: 'Made easy for business buyers',
    items: [
      { icon: 'package', title: 'Packaging to fit your needs', text: 'From 330 ml bottles for events to 19-liter gallons for offices.' },
      { icon: 'zap', title: 'Direct quotation', text: 'Send your requirements and our team will reply with a quotation.' },
      { icon: 'truck', title: 'Regular delivery', text: 'Delivery schedules can be discussed to suit your needs.' },
      { icon: 'headset', title: 'One direct contact', text: 'Talk directly with our team via WhatsApp or phone.' },
    ],
  },
  segments: {
    eyebrow: 'Who we serve',
    title: 'For a wide range of businesses',
    items: ['Distributors & agents', 'Hotels, restaurants & cafes', 'Offices', 'Events & catering', 'Schools & institutions'],
  },
  process: {
    eyebrow: 'How to order',
    title: 'Three simple steps',
    steps: [
      { title: 'Send your needs', text: 'Fill in the form or chat on WhatsApp: product, estimated volume, and delivery location.' },
      { title: 'Receive a quotation', text: 'Our team replies with pricing and terms based on your volume.' },
      { title: 'Confirm & delivery', text: 'Once agreed, your order is scheduled for delivery.' },
    ],
  },
  quote: {
    eyebrow: 'Request a quote',
    title: 'Tell us what you need',
    description: 'Fill in this short form. Our team will get back to you.',
    addressTitle: 'Office address',
    phoneTitle: 'Phone',
    emailTitle: 'Email',
    mapsLabel: 'View on Google Maps',
    form: {
      company: 'Company name',
      name: 'Your name',
      contact: 'WhatsApp / phone number',
      product: 'Product of interest',
      productPlaceholder: 'Select a product',
      productOther: 'More than one / other',
      volume: 'Estimated volume',
      volumePlaceholder: 'Example: 50 cartons per month',
      message: 'Additional notes',
      messagePlaceholder: 'Delivery location or anything else we should know',
      submit: 'Send Request',
      sending: 'Sending...',
      successTitle: 'Request sent',
      successText: 'Thank you, we will contact you shortly.',
      error: 'Failed to send. Please try again or contact us on WhatsApp.',
    },
  },
  footer: {
    description: 'ARTIC bottled drinking water by PT. Transwater Roberi Indonesia.',
    menuTitle: 'Menu',
    certTitle: 'Legality',
    certifications: ['ARTIC trademark registered (DGIP): IDM000818024', 'BPOM bottle: MD 122882000900549', 'BPOM gallon: pending (renewal in progress)', 'Halal: pending', 'SNI: pending', 'ISO: pending'],
    rights: 'All rights reserved.',
    credit: 'Website by',
    privacy: 'Privacy Policy',
  },
}

export const defaultContent: Record<Locale, SiteContent> = { id, en }

export const toLocale = (locale: string): Locale => (locale === 'en' ? 'en' : 'id')

// Teks bawaan: dipakai sebagai cadangan jika CMS kosong/tidak terjangkau,
// dan sebagai bahan seed data awal ke Payload (scripts/seed.ts).
export function getDefaultContent(locale: string): SiteContent {
  return defaultContent[toLocale(locale)]
}

export function whatsappLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
