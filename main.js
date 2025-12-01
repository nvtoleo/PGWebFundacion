/**
 * main.js
 * Lógica principal para la web de la Fundación.
 * Estructura: Patrón de Módulo Revelador (Revealing Module Pattern) para escalabilidad.
 */

const App = (() => {
    'use strict';

    // ==========================================
    // MÓDULO 1: NAVEGACIÓN MÓVIL
    // ==========================================
    const Navigation = (() => {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('#main-nav');

        const init = () => {
            if (!menuToggle || !mainNav) return;

            menuToggle.addEventListener('click', () => {
                // Alternar clase para mostrar/ocultar menú
                const isOpen = mainNav.classList.toggle('is-open');
                
                // Accesibilidad: Informar a lectores de pantalla el estado
                menuToggle.setAttribute('aria-expanded', isOpen);
                menuToggle.innerHTML = isOpen ? '✕' : '☰'; // Cambia icono a X o Hamburguesa
            });
        };

        // Función pública para cerrar menú (útil al hacer clic en un enlace)
        const closeMenu = () => {
            if (mainNav.classList.contains('is-open')) {
                mainNav.classList.remove('is-open');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.innerHTML = '☰';
            }
        };

        return { init, closeMenu };
    })();
    // ==========================================
    // MÓDULO 4: MODAL DE DONACIÓN (Simulación)
    // ==========================================
    const DonationModal = (() => {
        const modal = document.getElementById('modal-donacion');
        const openButtons = document.querySelectorAll('.btn--donate'); // Todos los botones de donar
        const closeBtn = document.getElementById('close-modal');
        const amountBtns = document.querySelectorAll('.btn-amount');
        const processBtn = document.getElementById('btn-process-payment');
        const step1 = document.getElementById('modal-step-1');
        const step2 = document.getElementById('modal-step-2');
        const closeSuccessBtn = document.getElementById('btn-close-success');

        const init = () => {
            if (!modal) return;

            // 1. Abrir Modal
            openButtons.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    modal.classList.add('is-visible');
                    resetModal(); // Reiniciar estado al abrir
                });
            });

            // 2. Cerrar Modal (X o Botón cerrar)
            const closeModal = () => modal.classList.remove('is-visible');
            if(closeBtn) closeBtn.addEventListener('click', closeModal);
            if(closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

            // Cerrar si clic fuera del contenido
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            // 3. Selección de Monto (Botones)
            amountBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Quitar clase selected a todos
                    amountBtns.forEach(b => b.classList.remove('selected'));
                    // Poner clase selected al clickeado
                    btn.classList.add('selected');
                });
            });

            // 4. Simular Proceso de Pago
            if(processBtn) {
                processBtn.addEventListener('click', () => {
                    const originalText = processBtn.innerText;
                    
                    // Estado de "Cargando..."
                    processBtn.innerText = "Procesando...";
                    processBtn.style.opacity = "0.7";
                    processBtn.disabled = true;

                    // Simular espera de 2 segundos (Simulando conexión con banco)
                    setTimeout(() => {
                        // Ocultar paso 1 y mostrar paso 2 (Éxito)
                        step1.style.display = 'none';
                        step2.style.display = 'block';
                    }, 2000);
                });
            }
        };

        const resetModal = () => {
            step1.style.display = 'block';
            step2.style.display = 'none';
            if(processBtn) {
                processBtn.innerText = "CONFIRMAR DONACIÓN";
                processBtn.style.opacity = "1";
                processBtn.disabled = false;
            }
        };

        return { init };
    })();

    // ==========================================
    // MÓDULO 2: SCROLL SUAVE (Smooth Scroll)
    // ==========================================
    const SmoothScroll = (() => {
        const links = document.querySelectorAll('a[href^="#"]');

        const init = () => {
            links.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        // Navegación suave nativa
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });

                        // UX: Cerrar menú móvil si está abierto
                        Navigation.closeMenu();
                    }
                });
            });
        };

        return { init };
    })();

    // ==========================================
    // MÓDULO 3: ANIMACIÓN DE ESTADÍSTICAS (Counter)
    // ==========================================
    const StatsAnimation = (() => {
        const statsSection = document.querySelector('.stats-section');
        const counters = document.querySelectorAll('.stat-item__number');
        let hasAnimated = false; // Bandera para que solo ocurra una vez

        const animateCounters = () => {
            counters.forEach(counter => {
                const target = +counter.innerText.replace(/\D/g, ''); // Extraer solo números (quita el + o %)
                const originalText = counter.innerText; // Guardar texto original (+, %)
                const duration = 2000; // Duración en ms
                const increment = target / (duration / 16); // 16ms es aprox 1 frame (60fps)

                let current = 0;

                const updateCount = () => {
                    current += increment;

                    if (current < target) {
                        // Muestra el número mientras sube
                        counter.innerText = Math.ceil(current).toLocaleString();
                        requestAnimationFrame(updateCount);
                    } else {
                        // Al terminar, restaura el formato original (+, %)
                        counter.innerText = originalText;
                    }
                };

                updateCount();
            });
        };

        const init = () => {
            if (!statsSection) return;

            // Intersection Observer: Detecta cuando la sección es visible en pantalla
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !hasAnimated) {
                        animateCounters();
                        hasAnimated = true; // Evita que se repita
                        observer.unobserve(statsSection); // Deja de observar para ahorrar recursos
                    }
                });
            }, { threshold: 0.5 }); // Se activa cuando el 50% de la sección es visible

            observer.observe(statsSection);
        };

        return { init };
    })();

    // ==========================================
    // INICIALIZADOR GLOBAL
    // ==========================================
    const init = () => {
        Navigation.init();
        SmoothScroll.init();
        StatsAnimation.init();
        DonationModal.init();
        console.log('App Fundación Inicializada correctamente.');
    };

    return { init };
})();

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', App.init);