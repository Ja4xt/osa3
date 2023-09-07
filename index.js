require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const bodyParser = require('body-parser')
const morgan = require('morgan')

morgan.token ('body', req => JSON.stringify(req.body))

const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: 'name is not unique' })
  }
  next(error)
}

app-use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))  
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => response.json(persons.map(person => person.toJSON())))
})
app.get('/api/persons/:id', (request, response) => {
  person.findById(request.params.id)
  .then(person => response.json(person.toJSON()))
  .catch(error => response.status(404).send({ error: 'person not found' }))
})
app.get('/info', (request, response) => {
  Person.find({}).then(persons => response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`))
})
app.post('/api/persons', (request, response, next) => {
  if(!request.body.name || !request.body.number) {
    return response.status(400).json({ error: 'does not exist' })
  }
  const person = new Person({name: request.body.name, number: request.body.number})
  person.save().then(() => {response.status(201).end()
})
.catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const person = {name: request.body.name, number: request.body.number}
  Person.findByIdAndUpdate(request.params.id, person, {new: true})
  .then(updatedPerson => response.json(updatedPerson.toJSON()))
  .catch (error => next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => response.status(204).end())
  .catch(error => next(error))
})
app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})