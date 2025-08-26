const tasks = [
    {
        id: 1,
        label: 'frontend',
        description: 'Implementar tela de listagem de tarefas',
        createdAt: new Date('2024-08-21'),
        status: false
    },
    {
        id: 2,
        label: 'backend',
        description: 'Criar endpoint para cadastro de tarefas',
        createdAt: new Date('2024-08-21'),
        status: false
    },
    {
        id: 3,
        label: 'ux',
        description: 'Implementar protótipo da listagem de tarefas',
        createdAt: new Date('2024-08-21'),
        status: false
    }
]

// responsavel por salvar e carregar corretamente os dados persistentes em localstorage
const storage = {
    save(tasks) {
        window.localStorage.setItem('tasks', JSON.stringify(tasks));
    },
    load() {
        const loadLocalTasks = window.localStorage.getItem('tasks');
        return loadLocalTasks
            ? JSON.parse(loadLocalTasks).map(task => ({ ...task, createdAt: new Date(task.createdAt) }))
            : [];
    }
}

function createNewTask(event) {
    event.preventDefault();

    const desc = document.getElementById('task_Name').value.trim();
    const type = document.getElementById('task_Label').value.trim();
    if (!desc || !type) return;

    const newTask = {
        id: Date.now(),
        description: desc,
        label: type,
        createdAt: new Date(),
        status: false
    };

    tasks.push(newTask);
    storage.save(tasks);
    createTaskListItem(newTask);

    document.getElementById('task_Name').value = '';
    document.getElementById('task_Label').value = '';


}
function createTaskListItem(task, conclude) {

    // criação dos elementos da lista de tasks
    const list = document.getElementById('tasks_List');
    const itens = document.createElement('li');
    const container = document.createElement('div')
    const descriptionContent = document.createElement('h2');
    const containerInfo = document.createElement('div');
    const typeContent = document.createElement('p');
    const dateContent = document.createElement('p');
    const conclueTaskButton = document.createElement('button');

    //criação o conteudo dos elementos definidos
    descriptionContent.textContent = task.description;
    typeContent.textContent = task.label;
    dateContent.textContent = `Criado em: ${task.createdAt.toLocaleDateString()}`

    if (task.status) {
        descriptionContent.classList.toggle('completed');
        conclueTaskButton.innerHTML = '<img src="./assets/Vector.svg" alt="Concluído">';
    } else {
        descriptionContent.classList.toggle('task_Complete_btn');
        conclueTaskButton.textContent = 'Concluir';
    }

    conclueTaskButton.ariaLabel = 'Concluir Tarefa';


    //Classificação de elementos definidos
    itens.className = 'task_List_Item';
    container.className = 'tasks_Container'
    descriptionContent.className = 'description'
    containerInfo.className = 'tasks_Info';
    typeContent.className = 'etiqueta';
    dateContent.className = 'criado'
    conclueTaskButton.className = 'task_Complete_btn';

    //Realiza a organização de hierarquia dos elementos
    itens.id = task.id;
    itens.appendChild(container);
    container.appendChild(descriptionContent)
    container.appendChild(containerInfo)
    containerInfo.appendChild(typeContent);
    containerInfo.appendChild(dateContent);
    itens.appendChild(conclueTaskButton);

    conclueTaskButton.addEventListener('click', () => {
        task.status = !task.status;

        if (task.status) {
            descriptionContent.classList.add('completed_Item'); // strikethrough
            conclueTaskButton.classList.add('completed'); // botão verde/redondo
            conclueTaskButton.innerHTML = '<img src="./assets/Vector.svg" alt="Concluído">';
        } else {
            descriptionContent.classList.remove('completed_Item');
            conclueTaskButton.classList.remove('completed');
            conclueTaskButton.textContent = 'Concluir';
        }
        storage.save(tasks);
        updateCompletedCount();
    });


    list.appendChild(itens);
}
function tasksComplited() {
    const completedTasks = tasks.filter(task => task.status === true);

    return completedTasks.length
}
function updateCompletedCount() {
    const completedCount = tasksComplited()

    const editCount = document.getElementById('tasks_Completed');
    if (editCount) {
        editCount.textContent = `${completedCount} tarefa concluída`
    }
}

window.onload = function () {

    const tasksFromStorage = storage.load();

    if (tasksFromStorage.length > 0) {
        tasks.splice(0, tasks.length, ...tasksFromStorage)
    }

    tasks.forEach(task => createTaskListItem(task));

    updateCompletedCount();
    const form = document.getElementById('register_Section');
    form.addEventListener('submit', createNewTask)
}