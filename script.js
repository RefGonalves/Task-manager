document.addEventListener('DOMContentLoaded', () => {
    // Array de tarefas iniciais
    const tasks = [
        {
            id: 1,
            name: 'Lorem ipsum',
            discipline: 'Sociologia',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur magnam earum soluta aliquid aperiam obcaecati, sint hic dolores omnis sed!',
            date: '01/01/2020', // Exemplo de data no formato DD/MM/YYYY
            completed: false
        },
        {
            id: 2,
            name: 'Tarefa 2',
            discipline: 'Educação Física',
            description: 'Descrição da Tarefa 2',
            date: '10/07/2024', // Exemplo de data no formato DD/MM/YYYY
            completed: false
        },
        {
            id: 3,
            name: 'Tarefa 3',
            discipline: 'Projeto Digital',
            description: 'Descrição da Tarefa 3',
            date: '11/07/2024', // Exemplo de data no formato DD/MM/YYYY
            completed: false
        },
        {
            id: 4,
            name: 'Lorem ipsum',
            discipline: 'Gestão',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur magnam earum soluta aliquid aperiam obcaecati, sint hic dolores omnis sed!',
            date: '01/01/2020', // Exemplo de data no formato DD/MM/YYYY
            completed: false
        },
        {
            id: 5,
            name: 'Lorem ipsum',
            discipline: 'Projeto Visual',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tenetur magnam earum soluta aliquid aperiam obcaecati, sint hic dolores omnis sed!',
            date: '01/01/2020', // Exemplo de data no formato DD/MM/YYYY
            completed: false
        },
        {
            id: 6,
            name: 'Lorem ipsum',
            discipline: 'Projeto Editorial',
            description: '            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestias repellendus, unde necessitatibus expedita illum laudantium tempora, odio dicta aliquid placeat modi ipsam mollitia, quia tenetur possimus officia praesentium magni quod amet deserunt et. Molestiae autem harum recusandae nulla sit culpa sed, dicta quis possimus sequi commodi minima non inventore. Error.',
            date: '01/01/2020', // Exemplo de data no formato DD/MM/YYYY
            completed: false
        },
    ];

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
            const taskDisciplina = document.createElement('div');
            taskDisciplina.className = 'task-disciplina';
            taskDisciplina.textContent = task.discipline;

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
            taskDate.textContent = task.date;

            const taskStatus = document.createElement('div');
            taskStatus.className = 'task-status';

            const checkbox = document.createElement('input'); // Cria um elemento <input> do tipo checkbox
            checkbox.type = 'checkbox'; // Define o tipo do input como checkbox
            checkbox.className = 'task-checkbox'; // Adiciona a classe 'task-checkbox' ao checkbox
            checkbox.checked = task.completed; // Define o estado checked do checkbox com base no status da tarefa
            checkbox.addEventListener('change', function () { // Adiciona um evento de mudança ao checkbox
                task.completed = this.checked; // Atualiza o status de conclusão da tarefa
                renderTasks(); // Re-renderiza as listas de tarefas
            });

            // Adiciona o checkbox ao div de status
            taskStatus.appendChild(checkbox);

            // Cria uma caixa para os botões
            const taskButtons = document.createElement('div');
            taskButtons.className = 'task-buttons';
            taskButtons.appendChild(taskStatus);
            taskButtons.appendChild(expandButton);

            // Adiciona os elementos criados ao item de tarefa
            taskItem.appendChild(taskDisciplina);
            taskItem.appendChild(taskName);
            taskItem.appendChild(taskDate);
            taskItem.appendChild(taskButtons);

            // Verifica se a disciplina da tarefa está nos filtros ativos
            const taskDisciplineClass = sanitizeClassName(task.discipline);
            if (activeFilters.length === 0 || activeFilters.includes(taskDisciplineClass)) {
                // Adiciona o item de tarefa à lista apropriada com base no status de conclusão
                if (task.completed) {
                    completedTaskList.appendChild(taskItem); // Adiciona à lista de tarefas concluídas
                } else {
                    ongoingTaskList.appendChild(taskItem); // Adiciona à lista de tarefas em andamento
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

        // Limpa o conteúdo do modal
        taskDetails.innerHTML = '';
        taskDetails.className = 'task-' + sanitizeClassName(task.discipline);

        // Cria elementos para os detalhes da tarefa
        const taskName = document.createElement('div');
        taskName.className = 'task-name';
        taskName.textContent = task.name;

        const modalInfo = document.getElementById('modalInfo');
        modalInfo.className = 'task-' + sanitizeClassName(task.discipline);
        const taskDiscipline = document.getElementById('taskDisciplinaId');
        taskDiscipline.textContent = task.discipline;

        const taskDescription = document.createElement('div');
        taskDescription.className = 'task-description';
        taskDescription.textContent = task.description;

        const taskDate = document.createElement('div');
        taskDate.className = 'task-date';
        taskDate.textContent = task.date;

        const taskStatus = document.createElement('div');
        taskStatus.className = 'task-status';

        const checkbox = document.createElement('input'); // Cria um elemento <input> do tipo checkbox
        checkbox.type = 'checkbox'; // Define o tipo do input como checkbox
        checkbox.className = 'task-checkbox'; // Adiciona a classe 'task-checkbox' ao checkbox
        checkbox.checked = task.completed; // Define o estado checked do checkbox com base no status da tarefa
        checkbox.addEventListener('change', function () { // Adiciona um evento de mudança ao checkbox
            task.completed = this.checked; // Atualiza o status de conclusão da tarefa
            renderTasks(); // Re-renderiza as listas de tarefas
        });

        taskStatus.appendChild(checkbox);

        // Adiciona os elementos dos detalhes da tarefa ao modal
        taskDetails.appendChild(taskName);
        taskDetails.appendChild(taskDescription);
        taskDetails.appendChild(taskDate);
        taskDetails.appendChild(taskStatus);

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

    // Renderiza as tarefas ao carregar a página
    renderTasks();
});