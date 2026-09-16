document.addEventListener('DOMContentLoaded', () => {
    // === Navbar Scroll Effect ===
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-white/80', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-blue-100/50');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('bg-white/80', 'backdrop-blur-md', 'shadow-lg', 'border-b', 'border-blue-100/50');
            navbar.classList.add('bg-transparent');
        }

        // Active Link Spy
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('text-blue-600', 'font-semibold');
            link.classList.add('text-gray-600');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('text-blue-600', 'font-semibold');
                link.classList.remove('text-gray-600');
            }
        });
    });

    // === Mobile Menu Toggle ===
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        // Toggle animation classes or icon states
        const openIcon = menuBtn.querySelector('.open-icon');
        const closeIcon = menuBtn.querySelector('.close-icon');
        openIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // Close mobile menu when a link is clicked
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const openIcon = menuBtn.querySelector('.open-icon');
            const closeIcon = menuBtn.querySelector('.close-icon');
            openIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        });
    });

    // === Product Modal functionality ===
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDesc = document.getElementById('modal-desc');
    const modalSpec = document.getElementById('modal-spec');
    const closeModalBtn = document.getElementById('close-modal');
    const modalCta = document.getElementById('modal-cta');

    // Product detailed information
    const productData = {
        '330ml': {
            title: 'ARTIC Mini 330ml',
            image: 'assets/images/product_330ml.png',
            desc: 'Kemasan kompak yang dirancang khusus untuk mobilitas tinggi Anda. Cocok untuk rapat bisnis, berkendara, atau disajikan saat menyambut tamu. Kemurnian air ARTIC tetap terjaga utuh dalam botol praktis ramah lingkungan.',
            spec: [
                'Volume: 330 ml',
                'Karton: Isi 24 botol',
                'Kemasan: PET Food Grade & BPA Free',
                'Keunggulan: Mudah dibawa, higienis, dan pas di kantong.'
            ]
        },
        '600ml': {
            title: 'ARTIC Daily 600ml',
            image: 'assets/images/product_600ml.png',
            desc: 'Pilihan harian paling ideal untuk menemani aktivitas padat Anda. Baik saat bekerja di kantor, berolahraga, maupun belajar di kampus. Porsi 600ml memastikan hidrasi tubuh Anda tetap optimal sepanjang hari.',
            spec: [
                'Volume: 600 ml',
                'Karton: Isi 24 botol',
                'Kemasan: PET Food Grade & BPA Free',
                'Keunggulan: Menjaga kebutuhan hidrasi harian, desain botol ergonomis.'
            ]
        },
        'gallon': {
            title: 'ARTIC Gallon 19L',
            image: 'assets/images/product_gallon.png',
            desc: 'Penyedia hidrasi utama untuk keluarga tercinta di rumah atau rekan kerja di kantor. Galon ARTic melalui 12 tahap sterilisasi ketat untuk menjamin kesegaran alami sumber mata air tetap utuh sampai ke cangkir Anda.',
            spec: [
                'Volume: 19 Liter',
                'Kemasan: Polycarbonate (PC) Premium, ekstra kuat',
                'Sistem Tutup: Double Seal anti-bocor & anti-kontaminasi',
                'Keunggulan: Lebih hemat, ramah lingkungan (reuseable), cocok untuk dispenser.'
            ]
        }
    };

    const detailButtons = document.querySelectorAll('.btn-detail');
    detailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const prodId = btn.getAttribute('data-product');
            const data = productData[prodId];

            if (data) {
                modalTitle.textContent = data.title;
                modalImage.src = data.image;
                modalDesc.textContent = data.desc;
                
                // Populating specifications list
                modalSpec.innerHTML = '';
                data.spec.forEach(item => {
                    const li = document.createElement('li');
                    li.className = 'flex items-center text-sm text-gray-600 mb-2';
                    li.innerHTML = `
                        <svg class="w-4 h-4 text-blue-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span>${item}</span>
                    `;
                    modalSpec.appendChild(li);
                });

                // Configure CTA link to contact section with product pre-filled
                modalCta.href = `#contact`;
                modalCta.addEventListener('click', () => {
                    closeModal();
                    const messageField = document.getElementById('message');
                    if (messageField) {
                        messageField.value = `Halo ARTIC, saya tertarik untuk memesan produk ${data.title}. Mohon informasi lebih lanjut mengenai harga dan pemesanan.`;
                    }
                });

                // Show modal with animation
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.querySelector('.modal-content').classList.remove('scale-95', 'opacity-0');
                    modal.querySelector('.modal-content').classList.add('scale-100', 'opacity-100');
                }, 10);
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            }
        });
    });

    const closeModal = () => {
        const content = modal.querySelector('.modal-content');
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = ''; // Restore scroll
        }, 300);
    };

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // === Contact Form Submission Handling ===
    const contactForm = document.getElementById('contact-form');
    const toast = document.getElementById('toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Basic Form Validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Mohon lengkapi semua kolom formulir.');
                return;
            }

            // Mock submit transition
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnHtml = submitBtn.innerHTML;
            
            // Disable and show loading spinner
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <svg class="animate-spin h-5 w-5 text-white inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengirim...
            `;

            setTimeout(() => {
                // Success State
                contactForm.reset();
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnHtml;

                // Show Beautiful Toast Notification
                toast.classList.remove('translate-y-20', 'opacity-0');
                toast.classList.add('translate-y-0', 'opacity-100');

                // Auto-close Toast after 4 seconds
                setTimeout(() => {
                    toast.classList.remove('translate-y-0', 'opacity-100');
                    toast.classList.add('translate-y-20', 'opacity-0');
                }, 4000);

            }, 1500);
        });
    }

    // Close toast button
    const closeToastBtn = document.getElementById('close-toast');
    if (closeToastBtn) {
        closeToastBtn.addEventListener('click', () => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-20', 'opacity-0');
        });
    }

    // === Reveal on Scroll Effect (Simple Micro-Interaction) ===
    const revealElements = document.querySelectorAll('.reveal');
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 100;

            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger once on load
});
