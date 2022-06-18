import './style.css'
import {v4} from 'uuid'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import { serverPubKeyPromise } from './serverkeys'
import * as bc from 'bigint-conversion'

//const API_URL = 'http://localhost:4000/api/';
//const API_URL_KEYS1 = 'http://localhost:4000/api/rsa/pubKey';

const proveKEYS = async () => {
    const serverPubKey = await serverPubKeyPromise
    console.log(serverPubKey.n)
}

proveKEYS();

//querySelector selects an HTMLsomething
//could be: FormElement, HTMLElement, HTMLInputElement, HTMLButtonElement, HTMLSelectElement, HTMLTextAreaElement
const modules = document.querySelector<HTMLFormElement>('#modules')

//list for antoher div, if we not use comment the following line
const tasksList = document.querySelector<HTMLDivElement>('#tasksList')
//console.log(modules)

//this task only for local storage, comment if we not use this (line 9 to 14)
interface Task {
    id: string
    message: string
    example: string
}

let tasks: Task[] = []

modules?.addEventListener('submit', (e) => {
    e.preventDefault()
    //console.log("click")

    const message = modules['message'] as unknown as HTMLInputElement
    const example = modules['example'] as unknown as HTMLInputElement

    //show in console log the inputs
    //console.log(message.value)
    //console.log(example.value)

    //only for local storage, comment this if we not use (line 29 to 34)
    tasks.push({
        message: message.value,
        example: example.value,
        id: v4()
    })

    localStorage.setItem('tasks', JSON.stringify(tasks))


    //show Toastify
    Toastify({
        text: 'Message send',
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
    }).showToast();

    //now we render on the screen
    renderTasks(tasks)

    //reset all form when click send button
    //and we will focus on the same inputText message
    modules.reset()
    message.focus()

});

//event loads and do something when we refresh the page
document.addEventListener('DOMContentLoaded', () => {

  //if we not use local storage, comment this (line 41)
  tasks = JSON.parse(localStorage.getItem('tasks') || '[]')
  //console.log(tasks)

  //call to the render, it's not necessary
  renderTasks(tasks)
})

//now we render on the screen
function renderTasks(tasks: Task[]) {

  //we not duplicate all list
  tasksList!.innerHTML = ''

    tasks.forEach(async task => {
        //taskElement with many params inside
        const taskElement = document.createElement('div')
        taskElement.className='bg-zinc-800 mb-1 p-4 rounded-lg hover:bg-zinc-700 hover:cursor-pointer'

        const header = document.createElement('header')
        header.className='flex justify-between'

        const message = document.createElement('span')
        //message.innerText = task.message

        //encrypt message for example
        message.innerText = (await serverPubKeyPromise).encrypt(bc.textToBigint(task.message)).toString()

        //finally we add a button for delete the component
        //if we not use comment these three lines
        const deleteButton = document.createElement('button')
        deleteButton.className = 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-md'
        deleteButton.innerText = 'Delete'

        //button addEventListener
        deleteButton.addEventListener('click', () => {
            //console.log(task.id)
            //show the index and finally delete
            const index=tasks.findIndex(t => t.id === task.id)
            //console.log(index)
            //delete the choosen index and only this
            tasks.splice(index, 1)
            localStorage.setItem('tasks', JSON.stringify(tasks))
            renderTasks(tasks)
        })

        header.append(message)
        header.append(deleteButton)

        //we create antoher param, example param as another span
        //comment these two lines if we not use
        const example = document.createElement('span')
        example.innerText = task.example

        //finally we encrypt subtitle, example also
        example.innerText = (await serverPubKeyPromise).encrypt(bc.textToBigint(task.example)).toString()

        taskElement.append(header)

        //and we add the example param
        taskElement.append(example)

        //add the id
        const id = document.createElement('p')
        id.innerText = task.id
        id.className = 'text-xs text-gray-400'
        taskElement.append(id)

        tasksList?.append(taskElement)
    })
}

