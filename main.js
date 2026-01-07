// ==================== INITIALIZATION ====================
$(document).ready(function() {
    // Hide loading screen
    setTimeout(() => {
        $('#loading-screen').fadeOut(500);
    }, 1500);

    // Initialize all features
    initTypewriter();
    initHeroSlider();
    initDarkMode();
    initLanguageSwitch();
    initSmoothScroll();
    initMobileMenu();
    initContactForm();
    initStatsCounter();
    initScrollToTop();
    initSectionAnimations();
    initSuccessModal();
});

// ==================== TYPEWRITER EFFECT ====================
const bios = {
    en: [
        "S.P.A.R.K Coders Remote Workers empowers global teams.",
        "We integrate AI and machine learning for smarter collaboration.",
        "Creating intuitive and engaging digital experiences.",
        "Building scalable digital products through innovation.",
        "Connecting remote talent worldwide seamlessly."
    ],
    kin: [
        "S.P.A.R.K Coders ni urubuga rwo gukorana kure rushoboza amatsinda ku isi yose.",
        "Tubyaza AI n'amashini yigisha kugirango gukorana neza kurusheho kuba byiza.",
        "Dukora imiterere y'ikoranabuhanga iroroshye kandi ishishikaje.",
        "Kubaka ibicuruzwa by'ikoranabuhanga bishobora gukura binyuze mu guhanga udushya.",
        "Duhuza abafite ubuhanga bo hirya no hino ku isi mu buryo bworoshye."
    ]
};

let lang = localStorage.getItem('language') || 'en';
let bioIndex = 0;
let charIndex = 0;
const speed = 50;
let isDeleting = false;
let typeTimeout;

function initTypewriter() {
    const typewriter = $('#typewriter');
    if (!typewriter.length) return;

    function type() {
        const currentBio = bios[lang][bioIndex];
        
        if (!isDeleting && charIndex < currentBio.length) {
            // Typing
            typewriter.text(typewriter.text() + currentBio.charAt(charIndex));
            charIndex++;
            typeTimeout = setTimeout(type, speed);
        } else if (!isDeleting && charIndex === currentBio.length) {
            // Pause at end
            isDeleting = true;
            typeTimeout = setTimeout(type, 2000);
        } else if (isDeleting && charIndex > 0) {
            // Deleting
            typewriter.text(currentBio.substring(0, charIndex - 1));
            charIndex--;
            typeTimeout = setTimeout(type, speed / 2);
        } else {
            // Move to next bio
            isDeleting = false;
            bioIndex = (bioIndex + 1) % bios[lang].length;
            typeTimeout = setTimeout(type, 500);
        }
    }

    type();
}

// ==================== HERO SLIDER ====================
function initHeroSlider() {
    const slides = $('.hero-slide');
    let currentSlide = 0;
    
    setInterval(() => {
        slides.removeClass('active').eq(currentSlide).removeClass('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides.eq(currentSlide).addClass('active');
    }, 5000);
}

// ==================== DARK MODE ====================
function initDarkMode() {
    const themeToggle = $('#theme-toggle');
    const body = $('body');
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.addClass('dark');
    }
    
    // Toggle theme
    themeToggle.on('click', function() {
        body.toggleClass('dark');
        localStorage.setItem('theme', body.hasClass('dark') ? 'dark' : 'light');
    });
    
    // Update all dark mode elements
    updateDarkModeElements();
}

function updateDarkModeElements() {
    const isDark = $('body').hasClass('dark');
    $('nav, section, .bg-white').each(function() {
        if (isDark) {
            $(this).addClass('dark:bg-gray-800 dark:text-gray-200');
        }
    });
}

// ==================== LANGUAGE SWITCH ====================
function initLanguageSwitch() {
    const langSwitch = $('#lang-switch, #lang-switch-mobile');
    
    // Set saved language
    langSwitch.val(lang);
    
    langSwitch.on('change', function() {
        const newLang = $(this).val();
        lang = newLang;
        localStorage.setItem('language', newLang);
        
        // Update all text elements
        updateAllText(newLang);
        
        // Restart typewriter
        restartTypewriter();
        
        // Show notification
        showNotification(newLang === 'en' ? 'Language switched to English' : 'Ururimi rwahinduwe rwagiye mu Kinyarwanda');
    });
}

function updateAllText(language) {
    // Update all elements with data-lang attributes
    $('[data-lang-en], [data-lang-kin]').each(function() {
        const text = $(this).data(`lang-${language}`);
        if (text) {
            $(this).text(text);
        }
    });
    
    // Update placeholders
    $(`[placeholder]`).each(function() {
        const placeholderEn = $(this).data('placeholder-en');
        const placeholderKin = $(this).data('placeholder-kin');
        if (placeholderEn && placeholderKin) {
            $(this).attr('placeholder', language === 'en' ? placeholderEn : placeholderKin);
        }
    });
}

function restartTypewriter() {
    clearTimeout(typeTimeout);
    $('#typewriter').text('');
    bioIndex = 0;
    charIndex = 0;
    isDeleting = false;
    initTypewriter();
}

// ==================== SMOOTH SCROLL ====================
function initSmoothScroll() {
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this).attr('href');
        if (target === '#') return;
        
        $('html, body').animate({
            scrollTop: $(target).offset().top - 80
        }, 800);
        
        // Close mobile menu if open
        $('#mobile-menu').hide();
    });
}

// ==================== MOBILE MENU ====================
function initMobileMenu() {
    $('#mobile-menu-btn').on('click', function() {
        $('#mobile-menu').slideToggle(300);
        $(this).find('i').toggleClass('fa-bars fa-times');
    });
    
    // Close menu when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('#mobile-menu, #mobile-menu-btn').length) {
            $('#mobile-menu').slideUp(300);
            $('#mobile-menu-btn i').removeClass('fa-times').addClass('fa-bars');
        }
    });
}

// ==================== CONTACT FORM ====================
function initContactForm() {
    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: $(this).find('input[type="text"]').eq(0).val(),
            email: $(this).find('input[type="email"]').val(),
            subject: $(this).find('input[type="text"]').eq(1).val(),
            message: $(this).find('textarea').val(),
            timestamp: new Date().toISOString()
        };
        
        // Validate form
        if (!validateForm(formData)) return;
        
        // Show loading state
        const submitBtn = $(this).find('button[type="submit"]');
        const originalText = submitBtn.html();
        submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Sending...').prop('disabled', true);
        
        // Simulate API call
        setTimeout(() => {
            // Save to localStorage (for demo)
            const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
            messages.push(formData);
            localStorage.setItem('contact_messages', JSON.stringify(messages));
            
            // Show success modal
            showSuccessModal();
            
            // Reset form
            $(this).trigger('reset');
            
            // Reset button
            submitBtn.html(originalText).prop('disabled', false);
        }, 1500);
    });
}

function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!data.name.trim()) {
        showNotification('Please enter your name', 'error');
        return false;
    }
    
    if (!emailRegex.test(data.email)) {
        showNotification('Please enter a valid email address', 'error');
        return false;
    }
    
    if (!data.subject.trim()) {
        showNotification('Please enter a subject', 'error');
        return false;
    }
    
    if (!data.message.trim()) {
        showNotification('Please enter your message', 'error');
        return false;
    }
    
    return true;
}

// ==================== SUCCESS MODAL ====================
function initSuccessModal() {
    $('#closeModal').on('click', function() {
        $('#successModal').fadeOut(300);
    });
    
    // Close modal when clicking outside
    $('#successModal').on('click', function(e) {
        if ($(e.target).attr('id') === 'successModal') {
            $(this).fadeOut(300);
        }
    });
}

function showSuccessModal() {
    const modal = $('#successModal');
    modal.fadeIn(300);
    
    // Animate modal content
    setTimeout(() => {
        modal.find('.bg-white, .bg-gray-800').removeClass('scale-95 opacity-0').addClass('scale-100 opacity-100');
    }, 10);
}

// ==================== STATS COUNTER ====================
function initStatsCounter() {
    const counters = $('.stat-item > div:first-child');
    const targetValues = {
        '#projects-count': 150,
        '#clients-count': 89,
        '#team-count': 24,
        '#countries-count': 12
    };
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Animate counter
    function animateCounter(id, target) {
        const element = $(id);
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.text(Math.floor(current));
        }, 20);
    }
    
    // Check on scroll
    $(window).on('scroll', function() {
        counters.each(function() {
            if (isInViewport(this)) {
                const id = '#' + $(this).attr('id');
                if (!$(this).hasClass('animated') && targetValues[id]) {
                    $(this).addClass('animated');
                    animateCounter(id, targetValues[id]);
                }
            }
        });
    }).scroll();
}

// ==================== SCROLL TO TOP ====================
function initScrollToTop() {
    $('#scroll-top').on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 800);
    });
    
    // Show/hide button based on scroll position
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 300) {
            $('#scroll-top').fadeIn(300);
        } else {
            $('#scroll-top').fadeOut(300);
        }
    });
}

// ==================== SECTION ANIMATIONS ====================
function initSectionAnimations() {
    // Add animation classes on scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                $(entry.target).addClass('animate__animated animate__fadeInUp');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    $('section').each(function() {
        observer.observe(this);
    });
}

// ==================== NOTIFICATION SYSTEM ====================
function showNotification(message, type = 'success') {
    const notification = $('#notification');
    const notificationText = $('#notification-text');
    
    // Set message and type
    notificationText.text(message);
    notification.removeClass('bg-green-500 bg-red-500').addClass(type === 'error' ? 'bg-red-500' : 'bg-green-500');
    
    // Show notification
    notification.removeClass('hidden').removeClass('translate-x-full');
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        notification.addClass('translate-x-full');
        setTimeout(() => notification.addClass('hidden'), 300);
    }, 5000);
}

// ==================== ADDITIONAL FEATURES ====================
// Service cards hover effect
$('.service-card').hover(
    function() {
        $(this).addClass('transform scale-105 shadow-2xl');
    },
    function() {
        $(this).removeClass('transform scale-105 shadow-2xl');
    }
);

// Team cards social icons
$('.team-card').hover(
    function() {
        $(this).find('.team-social').addClass('opacity-100');
    },
    function() {
        $(this).find('.team-social').removeClass('opacity-100');
    }
);

// Form input focus effects
$('input, textarea, select').focus(function() {
    $(this).parent().addClass('ring-2 ring-indigo-200');
}).blur(function() {
    $(this).parent().removeClass('ring-2 ring-indigo-200');
});

// Initialize tooltips
$('[title]').tooltip();

// Add current year to footer
$('footer').append(`<div class="text-center text-xs mt-4">© ${new Date().getFullYear()} S.P.A.R.K Developers</div>`);