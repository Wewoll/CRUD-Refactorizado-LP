/**
*    File        : frontend/js/controllers/studentsSubjectsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

import { studentsAPI } from '../api/studentsAPI.js';
import { subjectsAPI } from '../api/subjectsAPI.js';
import { studentsSubjectsAPI } from '../api/studentsSubjectsAPI.js';
import * as sharedUI from '../common/sharedUI.js';

document.addEventListener('DOMContentLoaded', async () => {
    await sharedUI.loadSharedUI();
    initSelects();
    setupFormHandler();
    setupCancelHandler();
    loadRelations();
    sharedUI.setupFormMessageReset('relationForm');
});

async function initSelects() {
    try {
        // Cargar estudiantes
        const students = await studentsAPI.fetchAll();
        const studentSelect = document.getElementById('studentIdSelect');
        students.forEach(s => {
            const option = document.createElement('option');
            option.value = s.id;
            option.textContent = s.fullname;
            studentSelect.appendChild(option);
        });

        // Cargar materias
        const subjects = await subjectsAPI.fetchAll();
        const subjectSelect = document.getElementById('subjectIdSelect');
        subjects.forEach(sub => {
            const option = document.createElement('option');
            option.value = sub.id;
            option.textContent = sub.name;
            subjectSelect.appendChild(option);
        });
    } catch (err) {
        console.error('Error cargando estudiantes o materias:', err.message);
        sharedUI.showMessage('Error cargando estudiantes o materias.', 'error');
    }
}

function setupFormHandler() {
    const form = document.getElementById('relationForm');
    form.addEventListener('submit', async e => {
        e.preventDefault();

        const relation = getFormData();

        // Validación frontend
        if (!relation.student_id) {
            sharedUI.showMessage('Debe seleccionar un estudiante.', 'error');
            sharedUI.markInputError('studentIdSelect');
            return;
        }
        if (!relation.subject_id) {
            sharedUI.showMessage('Debe seleccionar una materia.', 'error');
            sharedUI.markInputError('subjectIdSelect');
            return;
        }

        try {
            if (relation.id) {
                await studentsSubjectsAPI.update(relation);
                sharedUI.showMessage('Inscripción actualizada correctamente.', 'success');
            } else {
                await studentsSubjectsAPI.create(relation);
                sharedUI.showMessage('Inscripción creada correctamente.', 'success');
            }
            sharedUI.setIgnoreNextReset();
            clearForm();
            loadRelations();
        } catch (err) {
            console.error('Error guardando relación:', err.message);
            sharedUI.showMessage(err.message, 'error');
            if (err.message.includes('estudiante')) {
                sharedUI.markInputError('studentIdSelect');
            } else if (err.message.includes('materia')) {
                sharedUI.markInputError('subjectIdSelect');
            }
        }
    });
}

function setupCancelHandler() {
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            clearForm();
        });
    }
}

function getFormData() {
    return {
        id: document.getElementById('relationId').value.trim(),
        student_id: document.getElementById('studentIdSelect').value,
        subject_id: document.getElementById('subjectIdSelect').value,
        approved: document.getElementById('approved').checked ? 1 : 0
    };
}

function clearForm() {
    document.getElementById('relationForm').reset();
    document.getElementById('relationId').value = '';
}

async function loadRelations() {
    try {
        const relations = await studentsSubjectsAPI.fetchAll();
        relations.forEach(rel => {
            rel.approved = Number(rel.approved);
        });
        renderRelationsTable(relations);
    } catch (err) {
        console.error('Error cargando inscripciones:', err.message);
        sharedUI.showMessage('Error cargando inscripciones.', 'error');
    }
}

function renderRelationsTable(relations) {
    const tbody = document.getElementById('relationTableBody');
    tbody.replaceChildren();

    relations.forEach(rel => {
        const tr = document.createElement('tr');
        tr.appendChild(createCell(rel.student_fullname));
        tr.appendChild(createCell(rel.subject_name));
        tr.appendChild(createCell(rel.approved ? 'Sí' : 'No'));
        tr.appendChild(createActionsCell(rel));
        tbody.appendChild(tr);
    });
}

function createCell(text) {
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

function createActionsCell(relation) {
    const td = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'lp-button lp-cyan lp-small';
    editBtn.addEventListener('click', () => fillForm(relation));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'lp-button lp-coral lp-small lp-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(relation.id));

    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}

function fillForm(relation) {
    document.getElementById('relationId').value = relation.id;
    document.getElementById('studentIdSelect').value = relation.student_id;
    document.getElementById('subjectIdSelect').value = relation.subject_id;
    document.getElementById('approved').checked = !!relation.approved;
    sharedUI.clearInputError();
    sharedUI.showMessage('Editando inscripción', 'info');
}

async function confirmDelete(id) {
    if (!confirm('¿Estás seguro que deseas borrar esta inscripción?')) return;

    try {
        await studentsSubjectsAPI.remove(id);
        sharedUI.setIgnoreNextReset();
        clearForm();
        sharedUI.showMessage('Inscripción borrada correctamente.', 'success');
        loadRelations();
    } catch (err) {
        console.error('Error al borrar inscripción:', err.message);
        sharedUI.showMessage(err.message, 'error');
    }
}