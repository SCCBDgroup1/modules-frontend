import './style.css'

//querySelector selects an HTMLsomething
//could be: FormElement, HTMLElement, HTMLInputElement, HTMLButtonElement, HTMLSelectElement, HTMLTextAreaElement
const modules = document.querySelector<HTMLFormElement>('#modules')
//console.log(modules)

//this task only for local storage

interface Task {
    message: string
    example: string
}

let tasks: Task[] = []

modules?.addEventListener('submit', (e) => {
    e.preventDefault()
    //const selectedModules = Array.from(modules.elements)
    console.log("click")

    const message = modules['message'] as unknown as HTMLInputElement
    const example = modules['example'] as unknown as HTMLInputElement

    //show in console log the inputs
    //console.log(message.value)
    //console.log(example.value)

    //only for local storage
    tasks.push({
        message: message.value,
        example: example.value,
    })

    localStorage.setItem('tasks', JSON.stringify(tasks))

});

