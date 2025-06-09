// frontend/js/common/sharedUI.js

// Inserta el cartel de mensaje y el footer
export async function loadSharedUI() {
    try {
        // Cargar e insertar el cartel de mensaje después del <h2>
        const messageBoxHtml = await fetch('../components/messageBox.html').then(res => res.text());
        const heading = document.querySelector('h2');
        if (heading) {
            heading.insertAdjacentHTML('afterend', messageBoxHtml);
        } else {
            document.body.insertAdjacentHTML('afterbegin', messageBoxHtml);
        }

        // Agregar comportamiento al botón de cerrar del messageBox
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

        // Cargar e insertar los botones del formulario después de los campos
        const formFieldsRow = document.getElementById('formFieldsRow');
        if (formFieldsRow) {
            const formButtonsHtml = await fetch('../components/formButtons.html').then(res => res.text());
            formFieldsRow.insertAdjacentHTML('afterend', formButtonsHtml);
        }

        // Cargar e insertar el footer al final del body
        const footerHtml = await fetch('../components/footer.html').then(res => res.text());
        document.body.insertAdjacentHTML('beforeend', footerHtml);

    } catch (err) {
        console.error('Error cargando componentes compartidos:', err);
        showMessage('Error cargando la interfaz. Por favor, recargue la página.', 'error');
    }
}

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
        box.classList.add('lp-green');
    } else if (type === 'error') {
        box.classList.add('lp-red');
    } else {
        box.classList.add('lp-blue'); // info por defecto
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