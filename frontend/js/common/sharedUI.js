// frontend/js/common/sharedUI.js

// Inserta el cartel de mensaje y el footer
export async function loadSharedUI() {
  try {
    // Cargar e insertar el cartel de mensaje después del <h2>
    const messageBoxHTML = await fetch('../components/messageBox.html').then(res => res.text());
    const heading = document.querySelector('h2');
    if (heading) {
      heading.insertAdjacentHTML('afterend', messageBoxHTML);
    } else {
      document.body.insertAdjacentHTML('afterbegin', messageBoxHTML);
    }

    // Agregar comportamiento al botón de cerrar
    const interval = setInterval(() => {
      const closeBtn = document.getElementById('closeMessage');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          document.getElementById('messageBox').style.display = 'none';
        });
        clearInterval(interval);
      }
    }, 100);

    // Cargar e insertar el footer al final del body
    const footerHTML = await fetch('../components/footer.html').then(res => res.text());
    document.body.insertAdjacentHTML('beforeend', footerHTML);
  } catch (err) {
    console.error('Error cargando componentes compartidos:', err);
  }
}

// Muestra un mensaje en el cartel (error, éxito, info)
export function showMessage(text, type = 'info') {
  const box = document.getElementById('messageBox');
  const message = document.getElementById('messageText');

  if (!box || !message) {
    console.warn('No se encontró messageBox en el DOM');
    return;
  }

  box.className = 'w3-panel w3-display-container'; // Limpiar clases previas
  message.textContent = text;

  // Estilos según tipo
  if (type === 'success') {
    box.classList.add('w3-green');
  } else if (type === 'error') {
    box.classList.add('w3-red');
  } else {
    box.classList.add('w3-blue'); // info por defecto
  }

  box.style.display = 'block';

  // Ocultar automáticamente después de 5 segundos
  setTimeout(() => {
    box.style.display = 'none';
  }, 20000);
}
