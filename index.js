const express = require('express')
const app = express()

app.use(express.json())

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

const morgan = require('morgan')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :req-body'))

morgan.token('req-body', function (req, res) { 
    return JSON.stringify(req.body)
})


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request, response)=>{
    response.json(persons)
})



app.get('/info', (request,response)=>{
    const count = persons.length
    response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date(Date.now()).toLocaleString('EN-GB')}</p>`)
})

app.get('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    const person = persons.find(p=>p.id===id)
    if(person){
    response.json(person)
    }
    else{
    response.status(404).json({
        'error': 'invalid ID'
    })
    }
})

app.delete('/api/persons/:id',(request, response)=>{
    const id = request.params.id
    persons = persons.filter(person=>person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    const newId = Math.floor(Math.random() * 1000)
    if(persons.find(person=>person.id === newId)){
        return generateId()
    }
    else{
        return newId
    }
}

app.post('/api/persons',(request, response)=>{
    const body = request.body
    //console.log(body)
    if(!body.name){
        return response.status(400).json({
            "error" : "name is mandatory"
        })
    }

    if(!body.number){
        return response.status(400).json({
            "error" : "number is mandatory"
        })
    }

    if(persons.find(person=>body.name===person.name)){
        return response.status(400).json({
            "error" : "name cannot be repeated"
        })
    }

    const randomId = generateId()
    const person = {
        name: body.name,
        number: body.number,
        id: randomId
    }
    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT || 3002
app.listen(PORT)
console.log(`Server running on port ${PORT}`)