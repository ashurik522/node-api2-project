// implement your posts router here
const express = require('express');
const Posts = require('./posts-model')

const router = express.Router()

router.get('/', (req, res) => {
    Posts.find()
        .then(posts => {
            res.status(200).json(posts)
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The posts information could not be retrieved"})
        })
})

router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if(post) {
                res.status(200).json(post)
                return;
            }
            res.status(404).json({ message: "The post with the specified ID does not exist"});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "The post information could not be retrieved"})
        })
})

router.post('/', (req, res) => {
    if(req.body.title == null || req.body.title.trim() == "" || req.body.contents == null || req.body.contents.trim() == "" ){
        res.status(400).json({ message: "Please provide title and contents for the post"})
        return;
    }
    Posts.insert(req.body)
        .then(id => Posts.findById(id.id))
                .then(post => {
                    res.status(201).json(post)
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ message: "There was an error while saving the post to the database"})
        })
})

router.put('/:id', (req, res) => {
    const changes = req.body;
    
    if(req.body.title == null || req.body.title == "" || req.body.contents == null || req.body.contents == "" ) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
        return;
    }
    Posts.update(req.params.id, changes)
        .then(x => Posts.findById(req.params.id)) 
        .then(post => {
            if(post){
                res.status(200).json(post)
            } else {
               res.status(404).json({ message: "The post with the specified ID does not exist" })
            }    
        })
            
        
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The post information could not be modified"})
        })
})

router.delete('/:id', (req, res) => {
    Posts.findById(req.params.id)
        .then(post =>  {
            if(post == null){
                res.status(404).json({ message: "The post with the specified ID does not exist" })
                return;
            }
            Posts.remove(req.params.id)
            .then(() => {
                res.json(post)
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The post could not be removed" })
        })
})

router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
        .then(comments => {
            if(comments.length > 0) {
                res.status(200).json(comments)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({ message: "The comments information could not be retrieved" })
        })
})




module.exports = router;