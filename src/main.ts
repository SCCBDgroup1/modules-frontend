import './style.css'
import {v4} from 'uuid'
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"
import { serverPubKeyPromise, serverPaillierPubKeyPromise } from './serverkeys'
import * as bc from 'bigint-conversion'
import {blinding} from './blindunblind'

const proveKEYS = async () => {
    const serverPubKey = await serverPubKeyPromise
    console.log(serverPubKey.n)
}

proveKEYS();

const provePAILLIERKEYS = async () => {
    const serverPaillierPubKey = await serverPaillierPubKeyPromise
    console.log(serverPaillierPubKey.n)
}

provePAILLIERKEYS();

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
    example2: string
}

let tasks: Task[] = []

modules?.addEventListener('submit', (e) => {
    e.preventDefault()
    //console.log("click")

    const message = modules['message'] as unknown as HTMLInputElement
    const example = modules['example'] as unknown as HTMLInputElement
    const example2 = modules['example2'] as unknown as HTMLInputElement

    //show in console log the inputs
    //console.log(message.value)
    //console.log(example.value)

    //only for local storage, comment this if we not use (line 29 to 34)
    tasks.push({
        message: message.value,
        example: example.value,
        example2: example2.value,
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
        console.log("Clear message:", task.message)
        console.log("Message inner normal:", message.innerText)

        const data = {message: message.innerText}

        fetch('http://localhost:4000/api/rsa/decrypt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data=>{
            console.log('Success:', data)
        })
        .catch((error)=>{
            console.error('Error:', error)
        })

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
        // example.innerText = task.example

        //finally we encrypt second term with paillier, example also
        example.innerText = (await serverPubKeyPromise).encrypt(bc.textToBigint(task.example)).toString()
        console.log("Clear message:", task.example)
        console.log("Message inner normal:", example.innerText)

        const data2 = {message: example.innerText}

        fetch('http://localhost:4000/api/paillier/decrypt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2)
        })
        .then(response => response.json())
        .then(data2=>{
            console.log('Success:', data2)
        })
        .catch((error)=>{
            console.error('Error:', error)
        })

        const example2 = document.createElement('p')
        // example2.innerText = task.example2
        example2.innerText = blinding(bc.textToBigint(task.example2), await proveKEYS()).toString()
        console.log("message 1:", task.example2)
        console.log("message 2:", example2.innerText)

        const data3 = {message: example2.innerText}

        // fetch('http://localhost:4000/api/rsa/sign', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data3)
        // })
        // .then(response => response.json())
        // .then(data3=>{
        //     console.log('Success:', data3)
        // })
        // .catch((error)=>{
        //     console.error('Error:', error)
        // })

        taskElement.append(header)

        //and we add the example param
        taskElement.append(example)
        taskElement.append(example2)

        //add the id
        const id = document.createElement('p')
        id.innerText = task.id
        id.className = 'text-xs text-gray-400'
        taskElement.append(id)

        tasksList?.append(taskElement)
    })
}

