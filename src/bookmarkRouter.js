const express = require('express');
const bookmarkRouter = express.Router();
const logger = require('./logger');
const { v4: uuid } = require('uuid');

const { bookmarks } = require('./dataStore');


bookmarkRouter
  .route('/')
  .get((req, res) =>
    res.json(bookmarks))
  .post(express.json(), (req, res) => {
    const { title, url, rating, desc } = req.body;
    if (!title) {
      logger.error('title is required');
      return res
        .status(404)
        .send('title is required');
    }

    if (!url) {
      logger.error('url is required');
      return res
        .status(404)
        .send('url is required');
    }

    if (!rating) {
      logger.error('rating is required');
      return res
        .status(404)
        .send('rating is required');
    }

    if (!desc) {
      logger.error('desc is required');
      return res
        .status(404)
        .send('desc is required');
    }

    const id = uuid();
    const bookmark = {
      id,
      title,
      url,
      rating, 
      desc
    };

    bookmarks.push(bookmark);

    logger.info(`Bookmark created with id: ${id}`);

    res.send(201);
  });


bookmarkRouter
  .route('/:id')
  .get((req, res)=>{
    const{id}=req.params;
    const bookmark= bookmarks.find(bookmark => bookmark.id === id);
    if(!bookmark){
      logger.error(`bookmark with id ${id} not found`);
      return res
        .status(404)
        .send('Book id is not valid');
    }
    res.json(bookmark);
  }) 
  .delete((req,res) =>{
    const{id}=req.params;

    const bookmarkIndex = bookmarks.findIndex(bookmark => bookmark.id === id);
    if (bookmarkIndex === -1) {
      logger.error(`bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
      
    }
    bookmarks.splice(bookmarkIndex,1);
    return res
      .status(204)
      .send('deleted');
  });
    
  

module.exports = bookmarkRouter;