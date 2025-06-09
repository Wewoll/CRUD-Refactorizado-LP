# CRUD Refactorizado — Lucas Paniagua

Este proyecto es una refactorización de un CRUD educativo, ahora soportando gestión de estudiantes, profesores, materias y sus asignaciones.

## Instrucciones

1. **Base de datos:**  
   Usar el script `backend/config/script_inicial.sql` para crear la base de datos y usuario.  
   > ⚠️ **Nota:** Este script es diferente al usado en el refactory 3.0.  
   > Si usás la base de datos vieja, no funcionarán las nuevas relaciones ni la gestión de profesores.

2. **Borrar la base de datos:**  
   Si necesitás volver todo a cero, usá `backend/config/delete_db.sql` (solo para desarrollo).

3. **Frontend:**  
   Abrir `frontend/index.html` en el navegador.

4. **Backend:**  
   El backend está en PHP y se accede vía `backend/server.php`.

## Características

- Gestión de estudiantes, profesores y materias.
- Asignación de estudiantes y profesores a materias.
- Validaciones cruzadas: una persona no puede ser estudiante y profesor en la misma materia.
- Código organizado en controladores, modelos y rutas.
- Scripts SQL para crear y borrar la base de datos fácilmente.

## Notas

- El archivo de log de errores (`backend/logs/error.log`) **no se sube al repositorio**.
- Este proyecto está pensado para usarse con la estructura de base de datos provista.

---