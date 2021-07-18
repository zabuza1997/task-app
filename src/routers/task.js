const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
//Create task
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
})
//Read tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})
//Read task
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send();
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})
//Update task
router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['completed', 'description'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))
    const _id = req.params.id;
    if (!isValidOperation) {
        return res.status(400).send({
            error: 'Invalid updates'
        })
    }
    try {
        const task = await Task.findById(_id);
        updates.forEach(update => {
            task[update] = req.body[update]
        })
        await task.save();
        if (!task) {
            return res.status(404).send();
        }
        res.send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})
//Delete task
router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(_id);
        if (!task) {
            return res.status(404).send({
                error: 'Task not found'
            });
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error);
    }
})
module.exports = router;