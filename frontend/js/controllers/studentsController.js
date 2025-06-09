/**
*    File        : frontend/js/controllers/studentsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

import { studentsAPI } from '../api/studentsAPI.js';
import * as sharedUI from '../common/sharedUI.js';

document.addEventListener('DOMContentLoaded', async () => {
    await sharedUI.loadSharedUI();
    loadStudents();
    setupFormHandler();
    setupCancelHandler();
    sharedUI.setupFormMessageReset('studentForm');
    setupEmailValidation();
});

function setupFormHandler() {
    const form = document.getElementById('studentForm');
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const student = getFormData();

        // Validación frontend
        if (!student.fullname) {
            sharedUI.showMessage('El nombre es obligatorio.', 'error');
            sharedUI.markInputError('fullname');
            return;
        }
        if (!student.email) {
            sharedUI.showMessage('El email es obligatorio.', 'error');
            sharedUI.markInputError('email');
            return;
        }
        if (isNaN(student.age) || student.age < 1 || student.age > 120) {
            sharedUI.showMessage('La edad debe ser un número válido.', 'error');
            sharedUI.markInputError('age');
            return;
        }

        try {
            if (student.id) {
                await studentsAPI.update(student);
                sharedUI.showMessage('Estudiante actualizado correctamente.', 'success');
            } else {
                await studentsAPI.create(student);
                sharedUI.showMessage('Estudiante agregado correctamente.', 'success');
            }
            sharedUI.setIgnoreNextReset();
            clearForm();
            loadStudents();
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
            document.getElementById('studentId').value = '';
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
        id: document.getElementById('studentId').value.trim(),
        fullname: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value.trim(), 10)
    };
}

function clearForm() {
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
}

async function loadStudents() {
    try {
        const students = await studentsAPI.fetchAll();
        renderStudentTable(students);
    } catch (err) {
        console.error('Error cargando estudiantes:', err.message);
        sharedUI.showMessage('Error cargando estudiantes.', 'error');
    }
}

function renderStudentTable(students) {
    const tbody = document.getElementById('studentTableBody');
    tbody.replaceChildren();

    students.forEach(student => {
        const tr = document.createElement('tr');
        tr.appendChild(createCell(student.fullname));
        tr.appendChild(createCell(student.email));
        tr.appendChild(createCell(student.age.toString()));
        tr.appendChild(createActionsCell(student));
        tbody.appendChild(tr);
    });
}

function createCell(text) {
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

function createActionsCell(student) {
    const td = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'lp-button lp-cyan lp-small';
    editBtn.addEventListener('click', () => fillForm(student));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'lp-button lp-coral lp-small lp-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(student.id));

    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}

function fillForm(student) {
    document.getElementById('studentId').value = student.id;
    document.getElementById('fullname').value = student.fullname;
    document.getElementById('email').value = student.email;
    document.getElementById('age').value = student.age;
    sharedUI.clearInputError();
    sharedUI.showMessage(`Editando a ${student.fullname}`, 'info');
}

async function confirmDelete(id) {
    if (!confirm('¿Estás seguro que deseas borrar este estudiante?')) return;

    try {
        await studentsAPI.remove(id);
        sharedUI.setIgnoreNextReset();
        clearForm();
        sharedUI.showMessage('Estudiante borrado correctamente.', 'success');
        loadStudents();
    } catch (err) {
        console.error(err);
        sharedUI.showMessage(err.message, 'error');
    }
}