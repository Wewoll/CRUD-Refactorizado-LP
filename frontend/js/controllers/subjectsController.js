/**
*    File        : frontend/js/controllers/subjectsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 3.0 ( prototype )
*/

import { subjectsAPI } from '../api/subjectsAPI.js';
import * as sharedUI from '../common/sharedUI.js';

document.addEventListener('DOMContentLoaded', async () => {
    await sharedUI.loadSharedUI();
    loadSubjects();
    setupFormHandler();
    setupCancelHandler();
    sharedUI.setupFormMessageReset('subjectForm');
});

function setupFormHandler()
{
    const form = document.getElementById('subjectForm');
    form.addEventListener('submit', async e => 
    {
        e.preventDefault();
        const subject = getFormData();

        // Validación frontend
        if (!subject.name) {
            sharedUI.showMessage('El nombre de la materia es obligatorio.', 'error');
            sharedUI.markInputError('name');
            return;
        }

        try 
        {
            if (subject.id) 
            {
                await subjectsAPI.update(subject);
                sharedUI.showMessage('Materia actualizada correctamente.', 'success');
            }
            else
            {
                await subjectsAPI.create(subject);
                sharedUI.showMessage('Materia creada correctamente.', 'success');
            }
            clearForm();
            loadSubjects();
        }
        catch (err)
        {
            console.error(err);
            sharedUI.showMessage(err.message, 'error');
            // Detectar el input a marcar según el mensaje de error
            if (err.message.includes('nombre') || err.message.includes('Nombre')) {
                sharedUI.markInputError('name');
            }
        }
    });
}

function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            clearForm();
        });
    }
}

function getFormData()
{
    return {
        id: document.getElementById('subjectId').value.trim(),
        name: document.getElementById('name').value.trim()
    };
}

function clearForm()
{
    document.getElementById('subjectForm').reset();
    document.getElementById('subjectId').value = '';
}

async function loadSubjects()
{
    try
    {
        const subjects = await subjectsAPI.fetchAll();
        renderSubjectTable(subjects);
    }
    catch (err)
    {
        console.error('Error cargando materias:', err.message);
        sharedUI.showMessage('Error cargando materias.', 'error');
    }
}

function renderSubjectTable(subjects)
{
    const tbody = document.getElementById('subjectTableBody');
    tbody.replaceChildren();

    subjects.forEach(subject =>
    {
        const tr = document.createElement('tr');
        tr.appendChild(createCell(subject.name));
        tr.appendChild(createActionsCell(subject));
        tbody.appendChild(tr);
    });
}

function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

function createActionsCell(subject)
{
    const td = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'lp-button lp-cyan lp-small';
    editBtn.addEventListener('click', () => fillForm(subject));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'lp-button lp-coral lp-small lp-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(subject.id));

    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}

function fillForm(subject)
{
    document.getElementById('subjectId').value = subject.id;
    document.getElementById('name').value = subject.name;
    sharedUI.clearInputError();
    sharedUI.showMessage(`Editando materia: ${subject.name}`, 'info');
}

async function confirmDelete(id) {
    if (!confirm('¿Seguro que deseas borrar esta materia?')) return;
    try {
        await subjectsAPI.remove(id);
        clearForm();
        sharedUI.showMessage('Materia borrada correctamente.', 'success');
        loadSubjects();
    } catch (err) {
        console.error(err);
        sharedUI.showMessage(err.message, 'error');
    }
}