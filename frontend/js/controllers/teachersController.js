/**
*    File        : frontend/js/controllers/teachersController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Junio 2025
*    Status      : Prototype
*    Iteration   : 1.0
*/

import { teachersAPI } from '../api/teachersAPI.js';
import * as sharedUI from '../common/sharedUI.js';

document.addEventListener('DOMContentLoaded', async () => {
    await sharedUI.loadSharedUI();
    loadTeachers();
    setupFormHandler();
    setupCancelHandler();
    sharedUI.setupFormMessageReset('teacherForm');
    setupEmailValidation();
});

function setupFormHandler() {
    const form = document.getElementById('teacherForm');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const teacher = getFormData();

        // Validación frontend
        if (!teacher.fullname) {
            sharedUI.showMessage('El nombre es obligatorio.', 'error');
            sharedUI.markInputError('fullname');
            return;
        }
        if (!teacher.email) {
            sharedUI.showMessage('El email es obligatorio.', 'error');
            sharedUI.markInputError('email');
            return;
        }
        if (isNaN(teacher.age) || teacher.age < 18 || teacher.age > 120) {
            sharedUI.showMessage('La edad debe ser un número válido.', 'error');
            sharedUI.markInputError('age');
            return;
        }

        try {
            if (teacher.id) {
                await teachersAPI.update(teacher);
                sharedUI.showMessage('Profesor actualizado correctamente.', 'success');
            } else {
                await teachersAPI.create(teacher);
                sharedUI.showMessage('Profesor agregado correctamente.', 'success');
            }
            sharedUI.setIgnoreNextReset();
            clearForm();
            loadTeachers();
        } catch (err) {
            console.error(err);
            sharedUI.showMessage(err.message, 'error');
            if (err.message.includes('email')) {
                sharedUI.markInputError('email');
            } else if (err.message.toLowerCase().includes('edad')) {
                sharedUI.markInputError('age');
            } else if (err.message.toLowerCase().includes('nombre')) {
                sharedUI.markInputError('fullname');
            }
        }
    });
}

function setupCancelHandler() {
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            document.getElementById('teacherId').value = '';
        });
    }
}

function setupEmailValidation() {
    const emailInput = document.getElementById('email');
    if (!emailInput) return;

    emailInput.addEventListener('input', () => {
        if (emailInput.validity.patternMismatch) {
            emailInput.setCustomValidity('Ingrese un email válido. Ej: nombre@dominio.com.ar');
        } else {
            emailInput.setCustomValidity('');
        }
    });
}

function getFormData() {
    return {
        id: document.getElementById('teacherId').value.trim(),
        fullname: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value.trim(), 10)
    };
}

function clearForm() {
    document.getElementById('teacherForm').reset();
    document.getElementById('teacherId').value = '';
}

async function loadTeachers() {
    try {
        const teachers = await teachersAPI.fetchAll();
        renderTeacherTable(teachers);
    } catch (err) {
        console.error('Error cargando profesores:', err.message);
        sharedUI.showMessage('Error cargando profesores.', 'error');
    }
}

function renderTeacherTable(teachers) {
    const tbody = document.getElementById('teacherTableBody');
    tbody.replaceChildren();

    teachers.forEach(teacher => {
        const tr = document.createElement('tr');
        tr.appendChild(createCell(teacher.fullname));
        tr.appendChild(createCell(teacher.email));
        tr.appendChild(createCell(teacher.age.toString()));
        tr.appendChild(createActionsCell(teacher));
        tbody.appendChild(tr);
    });
}

function createCell(text) {
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

function createActionsCell(teacher) {
    const td = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'lp-button lp-cyan lp-small';
    editBtn.addEventListener('click', () => fillForm(teacher));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'lp-button lp-coral lp-small lp-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(teacher.id));

    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}

function fillForm(teacher) {
    document.getElementById('teacherId').value = teacher.id;
    document.getElementById('fullname').value = teacher.fullname;
    document.getElementById('email').value = teacher.email;
    document.getElementById('age').value = teacher.age;
    sharedUI.clearInputError();
    sharedUI.showMessage(`Editando a ${teacher.fullname}`, 'info');
}

async function confirmDelete(id) {
    if (!confirm('¿Estás seguro que deseas borrar este profesor?')) return;

    try {
        await teachersAPI.remove(id);
        sharedUI.setIgnoreNextReset();
        clearForm();
        sharedUI.showMessage('Profesor borrado correctamente.', 'success');
        loadTeachers();
    } catch (err) {
        console.error(err);
        sharedUI.showMessage(err.message, 'error');
    }
}