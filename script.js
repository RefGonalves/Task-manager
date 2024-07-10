document.addEventListener('DOMContentLoaded', () => {

    const disciplines = ['Sociologia', 'Educação Física', 'Projeto Digital', 'Gestão', 'Português', 'Ilustração', 'Informática', 'Projeto Visual', 'Projeto Editorial', 'Relações Humanas']; // Lista de disciplinas

    // Função para exportar tarefas
    function exportTasks() {
        const tasksJSON = JSON.stringify(tasks, null, 2);
        const blob = new Blob([tasksJSON], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tasks.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Função para importar tarefas
    function importTasks(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const importedTasks = JSON.parse(e.target.result);
                importedTasks.forEach(importedTask => {
                    const existingTaskIndex = tasks.findIndex(task => task.id === importedTask.id);
                    
                    if (existingTaskIndex !== -1) {
                        // Verifica se o estado da tarefa mudou
                        if (tasks[existingTaskIndex].completed !== importedTask.completed) {
                            tasks[existingTaskIndex] = importedTask; // Atualiza a tarefa com o novo estado
                        }
                    } else {
                        tasks.push(importedTask); // Adiciona a nova tarefa
                    }
                });
                saveTasks(tasks);
                renderTasks();
            };
            reader.readAsText(file);
        }
    }

    // Event listener para o botão de exportar
    const exportTasksButton = document.getElementById('exportTasksButton');
    exportTasksButton.addEventListener('click', exportTasks);

    // Event listener para o botão de importação (simula o clique no input file)
    const importTasksButton = document.getElementById('importTasksButton');
    importTasksButton.addEventListener('click', () => {
        document.getElementById('importTasksInput').click();
    });

    // Event listener para o input file de importação
    const importTasksInput = document.getElementById('importTasksInput');
    importTasksInput.addEventListener('change', importTasks);


    // Função para carregar as tarefas do localStorage
    function loadTasks() {
        const tasksJSON = localStorage.getItem('tasks');
        return tasksJSON ? JSON.parse(tasksJSON) : [];
    }

    // Função para salvar as tarefas no localStorage
    function saveTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    // Carrega as tarefas do localStorage
    const tasks = loadTasks();

    // Função para formatar o nome da disciplina em uma classe CSS válida
    function sanitizeClassName(className) {
        // Remove diacríticos e caracteres especiais, substitui espaços por hífens
        const withoutAccents = className
            .normalize('NFD') // Normaliza para decompor os caracteres diacríticos
            .replace(/[\u0300-\u036f]/g, '') // Remove os diacríticos
            .replace(/ç/g, 'c') // Substitui "ç" por "c"
            .replace(/ã|á/g, 'a'); // Substitui "ã" e "á" por "a"

        // Substitui espaços por hífens e converte para minúsculas
        return withoutAccents
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''); // Remove caracteres não alfanuméricos além de hífens
    }

    // Função para deletar uma tarefa
    function deleteTask(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1); // Remove a tarefa do array
            saveTasks(tasks); // Salva as alterações no localStorage
            renderTasks(); // Re-renderiza as listas de tarefas
        }
    }

    // Função para converter data
    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    // Função para renderizar as tarefas na lista de tarefas e na lista de tarefas concluídas
    function renderTasks() {
        const completedTaskList = document.getElementById('completed-task-list'); // Elemento da lista de tarefas concluídas
        const ongoingTaskList = document.getElementById('ongoing-task-list'); // Elemento da lista de tarefas em andamento
        
        // Limpa as listas antes de renderizar as tarefas
        completedTaskList.innerHTML = '';
        ongoingTaskList.innerHTML = '';

        // Filtra as tarefas com base nos checkboxes selecionados
        const activeFilters = Array.from(document.querySelectorAll('.filters input[type="checkbox"]:checked'))
                                .map(input => input.id);

        tasks.forEach(task => {
            const taskItem = document.createElement('li'); // Cria um elemento <li> para cada tarefa
            taskItem.className = `task-item task-${sanitizeClassName(task.discipline)}`; // Adiciona a classe 'task-item' e uma classe baseada na disciplina da tarefa
            if (task.completed) {
                taskItem.classList.add('completed'); // Adiciona a classe 'completed' se a tarefa estiver concluída
            }

            // Cria os elementos das informações da tarefa
            const taskHeader = document.createElement('div');
            taskHeader.className = 'task-header';
            const taskDisciplina = document.createElement('div');
            taskDisciplina.className = 'task-disciplina';
            taskDisciplina.textContent = task.discipline;
            taskHeader.appendChild(taskDisciplina);

            // BOTÃO DE APAGAR TASK
            const deleteButton = document.createElement('button'); // Cria o botão de apagar
            const deleteIcon = document.createElement('i');
            deleteIcon.className = 'nf nf-fa-trash';
            deleteButton.appendChild(deleteIcon);
            deleteButton.className = 'delete-task';
            deleteButton.addEventListener('click', function () {
                if (confirm('Tem certeza de que deseja apagar esta tarefa?')) {
                    deleteTask(task.id);
                }
            });
            taskHeader.appendChild(deleteButton); // Adiciona o botão de apagar aos botões da tarefa

            const taskName = document.createElement('div');
            taskName.className = 'task-name';
            taskName.textContent = task.name;

            const expandButton = document.createElement('button');
            const expandIcon = document.createElement('i');
            expandIcon.className = 'nf nf-md-arrow_expand_all';
            expandButton.appendChild(expandIcon);
            expandButton.addEventListener('click', () => openModal(task));

            const taskDate = document.createElement('div');
            taskDate.className = 'task-date';
            taskDate.textContent = formatDate(task.date);

            const taskStatus = document.createElement('div');
            taskStatus.className = 'task-status';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task-checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', function () {
                task.completed = this.checked;
                saveTasks(tasks);
                renderTasks();
            });

            taskStatus.appendChild(checkbox);

            const taskButtons = document.createElement('div');
            taskButtons.className = 'task-buttons';
            taskButtons.appendChild(taskStatus);
            taskButtons.appendChild(expandButton);

            taskItem.appendChild(taskHeader);
            taskItem.appendChild(taskName);
            taskItem.appendChild(taskDate);
            taskItem.appendChild(taskButtons);

            // Verifica se a disciplina da tarefa está nos filtros ativos
            const taskDisciplineClass = sanitizeClassName(task.discipline);
            if (activeFilters.length === 0 || activeFilters.includes(taskDisciplineClass)) {
                if (task.completed) {
                    completedTaskList.appendChild(taskItem);
                } else {
                    ongoingTaskList.appendChild(taskItem);
                }
            }
        });
    }

    // Adiciona event listener para mudanças nos checkboxes de filtro
    const filterInputs = document.querySelectorAll('.filters input[type="checkbox"]');
    filterInputs.forEach(input => {
        input.addEventListener('change', renderTasks);
    });

    // Função para abrir o modal com os detalhes da tarefa
    function openModal(task) {
        const modal = document.getElementById('taskModal');
        modal.className = 'modal task-' + sanitizeClassName(task.discipline);
        const taskDetails = document.getElementById('taskDetails');
        const taskFooter = document.getElementById('taskFooter');

        // Limpa o conteúdo do modal
        taskDetails.innerHTML = '';
        taskFooter.innerHTML = '';
        taskDetails.className = 'task-' + sanitizeClassName(task.discipline);

        // Cria elementos para os detalhes da tarefa
        const taskName = document.createElement('div');
        taskName.className = 'task-name';
        taskName.textContent = task.name;

        const modalInfo = document.getElementById('modalInfo');
        modalInfo.className = 'task-' + sanitizeClassName(task.discipline);
        const taskDiscipline = document.getElementById('taskDisciplinaId');
        taskDiscipline.textContent = task.discipline;
        // BOTÃO DE APAGAR TASK
        const deleteButton = document.createElement('button'); // Cria o botão de apagar
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'nf nf-fa-trash';
        deleteButton.appendChild(deleteIcon);
        deleteButton.className = 'delete-task';
        deleteButton.addEventListener('click', function () {
            if (confirm('Tem certeza de que deseja apagar esta tarefa?')) {
                deleteTask(task.id);
            }
            closeModal();
        });

        const deleteButtonDiv = document.getElementById('taskDeleteButton');
        deleteButtonDiv.innerHTML = '';
        deleteButtonDiv.appendChild(deleteButton);

        const taskDescription = document.createElement('div');
        taskDescription.className = 'task-description';
        taskDescription.textContent = task.description;

        const taskDate = document.createElement('div');
        taskDate.className = 'task-date';
        taskDate.textContent = formatDate(task.date);

        const taskStatus = document.createElement('div');
        taskStatus.className = 'task-status';

        const checkbox = document.createElement('input'); // Cria um elemento <input> do tipo checkbox
        checkbox.type = 'checkbox'; // Define o tipo do input como checkbox
        checkbox.className = 'task-checkbox'; // Adiciona a classe 'task-checkbox' ao checkbox
        checkbox.checked = task.completed; // Define o estado checked do checkbox com base no status da tarefa
        checkbox.addEventListener('change', function () { // Adiciona um evento de mudança ao checkbox
            task.completed = this.checked; // Atualiza o status de conclusão da tarefa
            saveTasks(tasks);
            renderTasks(); // Re-renderiza as listas de tarefas
        });

        taskStatus.appendChild(checkbox);

        // Adiciona os elementos dos detalhes da tarefa ao modal
        taskDetails.appendChild(taskName);
        taskDetails.appendChild(taskDescription);

        taskFooter.className = 'task-' + sanitizeClassName(task.discipline);

        taskFooter.appendChild(taskStatus);
        taskFooter.appendChild(taskDate);


        // Abre o modal
        modal.style.display = 'block';

        // Fecha o modal ao clicar no botão de fechar
        const closeButton = modal.querySelector('.close-task');
        closeButton.addEventListener('click', () => closeModal());

        // Fecha o modal ao clicar fora dele
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // Função para fechar o modal
    function closeModal() {
        const modal = document.getElementById('taskModal');
        modal.style.display = 'none';
    }

    // Função para limpar todos os filtros
    function clearFilters() {
        // Obtém todos os checkboxes de filtro
        const filterCheckboxes = document.querySelectorAll('.filters input[type="checkbox"]');
        
        // Desmarca todos os checkboxes
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Re-renderiza as tarefas para mostrar todas novamente
        renderTasks();
    }

    // Adiciona event listener para o botão de limpar filtros
    const clearFiltersButton = document.getElementById('clearFiltersButton');
    clearFiltersButton.addEventListener('click', clearFilters);

    const openCreateTaskModalButton = document.getElementById('openCreateTaskModal');
    openCreateTaskModalButton.addEventListener('click', () => {
        const createTaskModal = document.getElementById('createTaskModal');
        createTaskModal.style.display = 'block';

        // Preencher o dropdown de disciplinas
        const taskDisciplineDropdown = document.getElementById('taskDiscipline');
        taskDisciplineDropdown.innerHTML = disciplines.map(discipline => 
            `<option value="${discipline}">${discipline}</option>`).join('');
    });

    const closeCreateTaskButton = document.querySelector('.close-create-task');
    closeCreateTaskButton.addEventListener('click', () => {
        const createTaskModal = document.getElementById('createTaskModal');
        createTaskModal.style.display = 'none';
    });

    const createTaskForm = document.getElementById('createTaskForm');
    createTaskForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const taskName = document.getElementById('taskName').value;
        const taskDiscipline = document.getElementById('taskDiscipline').value;
        const taskDescription = document.getElementById('taskDescription').value;
        const taskDate = document.getElementById('taskDate').value;

        const newTask = {
            id: crypto.randomUUID(),
            name: taskName,
            discipline: taskDiscipline,
            description: taskDescription,
            date: taskDate,
            completed: false
        };

        tasks.push(newTask);
        saveTasks(tasks);
        renderTasks();

        const createTaskModal = document.getElementById('createTaskModal');
        createTaskModal.style.display = 'none';
        createTaskForm.reset();
    });

    // Renderiza as tarefas ao carregar a página
    renderTasks();
});