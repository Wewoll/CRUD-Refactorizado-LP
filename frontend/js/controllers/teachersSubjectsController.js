/**
*    File        : frontend/js/controllers/teachersSubjectsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Junio 2025
*    Status      : Prototype
*    Iteration   : 1.0
*/

import { teachersAPI } from '../api/teachersAPI.js';
import { subjectsAPI } from '../api/subjectsAPI.js';
import { teachersSubjectsAPI } from '../api/teachersSubjectsAPI.js';
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
        // Cargar profesores
        const teachers = await teachersAPI.fetchAll();
        const teacherSelect = document.getElementById('teacherIdSelect');
        teachers.forEach(t => {
            const option = document.createElement('option');
            option.value = t.id;
            option.textContent = t.fullname;
            teacherSelect.appendChild(option);
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
        console.error('Error cargando profesores o materias:', err.message);
        sharedUI.showMessage('Error cargando profesores o materias.', 'error');
    }
}

function setupFormHandler() {
    const form = document.getElementById('relationForm');
    form.addEventListener('submit', async e => {
        e.preventDefault();

        const relation = getFormData();

        // Validación frontend
        if (!relation.teacher_id) {
            sharedUI.showMessage('Debe seleccionar un profesor.', 'error');
            sharedUI.markInputError('teacherIdSelect');
            return;
        }
        if (!relation.subject_id) {
            sharedUI.showMessage('Debe seleccionar una materia.', 'error');
            sharedUI.markInputError('subjectIdSelect');
            return;
        }

        try {
            if (relation.id) {
                await teachersSubjectsAPI.update(relation);
                sharedUI.showMessage('Asignación actualizada correctamente.', 'success');
            } else {
                await teachersSubjectsAPI.create(relation);
                sharedUI.showMessage('Asignación creada correctamente.', 'success');
            }
            sharedUI.setIgnoreNextReset();
            clearForm();
            loadRelations();
        } catch (err) {
            console.error('Error guardando relación:', err.message);
            sharedUI.showMessage(err.message, 'error');
            if (err.message.includes('profesor')) {
                sharedUI.markInputError('teacherIdSelect');
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
        teacher_id: document.getElementById('teacherIdSelect').value,
        subject_id: document.getElementById('subjectIdSelect').value
    };
}

function clearForm() {
    document.getElementById('relationForm').reset();
    document.getElementById('relationId').value = '';
}

async function loadRelations() {
    try {
        const relations = await teachersSubjectsAPI.fetchAll();
        renderRelationsTable(relations);
    } catch (err) {
        console.error('Error cargando asignaciones:', err.message);
        sharedUI.showMessage('Error cargando asignaciones.', 'error');
    }
}

function renderRelationsTable(relations) {
    const tbody = document.getElementById('relationTableBody');
    tbody.replaceChildren();

    relations.forEach(rel => {
        const tr = document.createElement('tr');
        tr.appendChild(createCell(rel.teacher_fullname));
        tr.appendChild(createCell(rel.subject_name));
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
    document.getElementById('teacherIdSelect').value = relation.teacher_id;
    document.getElementById('subjectIdSelect').value = relation.subject_id;
    sharedUI.clearInputError();
    sharedUI.showMessage('Editando asignación', 'info');
}

async function confirmDelete(id) {
    if (!confirm('¿Estás seguro que deseas borrar esta asignación?')) return;

    try {
        await teachersSubjectsAPI.remove(id);
        sharedUI.setIgnoreNextReset();
        clearForm();
        sharedUI.showMessage('Asignación borrada correctamente.', 'success');
        loadRelations();
    } catch (err) {
        console.error('Error al borrar asignación:', err.message);
        sharedUI.showMessage(err.message, 'error');
    }
}