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
    await sharedUI.loadSharedUI();           // ← Carga el cartel y el footer
    loadStudents();
    setupFormHandler();
    setupCancelHandler();
});
  
function setupFormHandler()
{
    const form = document.getElementById('studentForm');
    form.addEventListener('submit', async e => 
    {
        e.preventDefault();
        const student = getFormData();
    
        try 
        {
            if (student.id) 
            {
                await studentsAPI.update(student);
                sharedUI.showMessage('Estudiante actualizado correctamente.', 'success');
            } 
            else 
            {
                await studentsAPI.create(student);
                sharedUI.showMessage('Estudiante agregado correctamente.', 'success');
            }
            clearForm();
            loadStudents();
        } 
        catch (err) {
            console.error(err); // Para debugging
            sharedUI.showMessage(err.message, 'error'); // Para el usuario
        }
    });
}

function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('studentId').value = '';
    });
}
  
function getFormData()
{
    return {
        id: document.getElementById('studentId').value.trim(),
        fullname: document.getElementById('fullname').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value.trim(), 10)
    };
}
  
function clearForm()
{
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
}
  
async function loadStudents()
{
    try 
    {
        const students = await studentsAPI.fetchAll();
        renderStudentTable(students);
    } 
    catch (err) 
    {
        console.error('Error cargando estudiantes:', err.message);
        sharedUI.showMessage('Error cargando estudiantes.', 'error');
    }
}
  
function renderStudentTable(students)
{
    const tbody = document.getElementById('studentTableBody');
    tbody.replaceChildren();
  
    students.forEach(student => 
    {
        const tr = document.createElement('tr');
    
        tr.appendChild(createCell(student.fullname));
        tr.appendChild(createCell(student.email));
        tr.appendChild(createCell(student.age.toString()));
        tr.appendChild(createActionsCell(student));
    
        tbody.appendChild(tr);
    });
}
  
function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}
  
function createActionsCell(student)
{
    const td = document.createElement('td');
  
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => fillForm(student));
  
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDelete(student.id));
  
    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}
  
function fillForm(student)
{
    document.getElementById('studentId').value = student.id;
    document.getElementById('fullname').value = student.fullname;
    document.getElementById('email').value = student.email;
    document.getElementById('age').value = student.age;
}
  
async function confirmDelete(id) 
{
    if (!confirm('¿Estás seguro que deseas borrar este estudiante?')) return;

    try {
        await studentsAPI.remove(id);
        sharedUI.showMessage('Estudiante borrado correctamente.', 'success');
        loadStudents();
    } catch (err) {
        console.error(err);
        sharedUI.showMessage(err.message, 'error');
    }
}
  