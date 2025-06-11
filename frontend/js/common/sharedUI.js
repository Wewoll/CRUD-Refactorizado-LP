// frontend/js/common/sharedUI.js

/**
 * Devuelve el path base para los componentes según la ubicación del HTML.
 * Si el archivo está en /html/, devuelve '../components/', si está en raíz, devuelve 'components/'
 */
function getComponentsBasePath() {
    // Si la URL contiene /html/, estamos en una subcarpeta
    if (window.location.pathname.includes('/html/')) {
        return '../components/';
    }
    return 'components/';
}

/**
 * Inserta el toggle de modo oscuro al principio del body.
 */
export async function insertThemeToggle() {
    const base = getComponentsBasePath();
    const html = await fetch(base + 'themeToggle.html').then(res => res.text());
    document.body.insertAdjacentHTML('afterbegin', html);

    // Activar el toggle
    const themeBtn = document.getElementById('toggleThemeBtn');
    if (themeBtn) {
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
            themeBtn.textContent = 'Modo claro';
        }
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            const dark = document.body.classList.contains('dark-mode');
            themeBtn.textContent = dark ? 'Modo claro' : 'Modo oscuro';
            localStorage.setItem('darkMode', dark);
        });
    }
}

/**
 * Inserta el cartel de mensaje después del <h2> o al principio del body.
 */
export async function insertMessageBox() {
    const base = getComponentsBasePath();
    const html = await fetch(base + 'messageBox.html').then(res => res.text());
    const heading = document.querySelector('h2');
    if (heading) {
        heading.insertAdjacentHTML('afterend', html);
    } else {
        document.body.insertAdjacentHTML('afterbegin', html);
    }

    // Botón de cerrar
    const closeBtnInterval = setInterval(() => {
        const closeBtn = document.getElementById('closeMessage');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                const box = document.getElementById('messageBox');
                if (box) box.style.display = 'none';
                clearInputError();
            });
            clearInterval(closeBtnInterval);
        }
    }, 100);
}

/**
 * Inserta los botones del formulario después de los campos, si existe el form.
 */
export async function insertFormButtons() {
    const base = getComponentsBasePath();
    const formFieldsRow = document.getElementById('formFieldsRow');
    if (formFieldsRow) {
        const html = await fetch(base + 'formButtons.html').then(res => res.text());
        formFieldsRow.insertAdjacentHTML('afterend', html);
    }
}

/**
 * Inserta el footer al final del body.
 */
export async function insertFooter() {
    // No insertar footer si estamos en index.html o en la raíz del frontend
    const path = window.location.pathname;
    if (
        path.endsWith('/index.html') ||
        path.endsWith('/frontend/') ||
        path === '/CRUD-Refactorizado-LP/frontend/' // por si acaso
    ) return;
    const base = getComponentsBasePath();
    const html = await fetch(base + 'footer.html').then(res => res.text());
    document.body.insertAdjacentHTML('beforeend', html);
}
/**
 * Carga todos los componentes compartidos.
 * Llamar a esta función en el controlador principal de cada página.
 */
export async function loadSharedUI() {
    try {
        await insertThemeToggle();
        await insertMessageBox();
        await insertFormButtons();
        await insertFooter();
    } catch (err) {
        console.error('Error cargando componentes compartidos:', err);
        showMessage('Error cargando la interfaz. Por favor, recargue la página.', 'error');
    }
}

// Solucion temporal al uso del boton reset
export let ignoreNextReset = false;
export function setIgnoreNextReset(val = true) {
    ignoreNextReset = val;
}

// Resetea el mensaje del cartel al reiniciar el formulario
export function setupFormMessageReset(formId = 'studentForm') {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('reset', () => {
            if (ignoreNextReset) {
                ignoreNextReset = false;
                return; // No limpiar mensaje si es reset automático tras submit
            }
            showMessage('', 'info'); // Limpiar mensaje si es reset manual (Limpiar)
        });
    }
}

let inputErrorTimeoutId = null;
let lastInputError = null;
// Marca el input con error visualmente
export function markInputError(inputId, duration = 5000) {
    // Limpiar error anterior si existe
    if (lastInputError) {
        lastInputError.classList.remove('lp-input-error');
        lastInputError = null;
    }
    if (inputErrorTimeoutId) {
        clearTimeout(inputErrorTimeoutId);
        inputErrorTimeoutId = null;
    }

    const input = document.getElementById(inputId);
    if (!input) return;
    input.classList.add('lp-input-error');
    lastInputError = input;

    // Timeout para limpiar si no se cierra antes
    inputErrorTimeoutId = setTimeout(() => {
        clearInputError();
    }, duration);
}

export function clearInputError() {
    if (lastInputError) {
        lastInputError.classList.remove('lp-input-error');
        lastInputError = null;
    }
    if (inputErrorTimeoutId) {
        clearTimeout(inputErrorTimeoutId);
        inputErrorTimeoutId = null;
    }
}

// Variable para controlar el timeout del mensaje global
let messageTimeoutId = null;
// Muestra un mensaje en el cartel (error, éxito, info)
export function showMessage(text, type = 'info') {
    const box = document.getElementById('messageBox');
    const message = document.getElementById('messageText');

    if (!box || !message) {
        console.warn('No se encontró messageBox en el DOM');
        return;
    }

    // Limpiar clases previas y timeout anterior
    box.className = 'lp-panel lp-display-container';
    message.textContent = text;
    if (messageTimeoutId) {
        clearTimeout(messageTimeoutId);
        messageTimeoutId = null;
    }

    // Si no hay texto, ocultar el cartel y salir
    if (!text) {
        box.classList.remove('show');
        setTimeout(() => { box.style.display = 'none'; }, 300);
        clearInputError();
        return;
    }

    // Estilos según tipo
    if (type === 'success') {
        box.classList.add('success');
    } else if (type === 'error') {
        box.classList.add('error');
    } else if (type === 'warning') {
        box.classList.add('warning');
    } else {
        box.classList.add('info'); // info por defecto
    }

    box.style.display = 'block';
    setTimeout(() => box.classList.add('show'), 10);

    // Solo ocultar automáticamente para success y error
    if (type === 'success' || type === 'error') {
        messageTimeoutId = setTimeout(() => {
            box.classList.remove('show');
            setTimeout(() => { box.style.display = 'none'; }, 300);
            messageTimeoutId = null;
            clearInputError();
        }, 5000);
    }
}