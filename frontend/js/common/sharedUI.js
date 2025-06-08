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

// Resetea el mensaje del cartel al reiniciar el formulario
export function setupFormMessageReset(formId = 'studentForm') {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('reset', () => {
      showMessage('', 'info');
    });
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
  box.className = 'w3-panel w3-display-container';
  message.textContent = text;
  if (messageTimeoutId) {
    clearTimeout(messageTimeoutId);
    messageTimeoutId = null;
  }

  // Si no hay texto, ocultar el cartel y salir
  if (!text) {
    box.style.display = 'none';
    return;
  }

  // Estilos según tipo
  if (type === 'success') {
    box.classList.add('w3-green');
  } else if (type === 'error') {
    box.classList.add('w3-red');
  } else {
    box.classList.add('w3-blue'); // info por defecto
  }

  box.style.display = text ? 'block' : 'none';

  // Solo ocultar automáticamente para success y error
  if (type === 'success' || type === 'error') {
    messageTimeoutId = setTimeout(() => {
      box.style.display = 'none';
      messageTimeoutId = null;
    }, 5000);
  }
}
