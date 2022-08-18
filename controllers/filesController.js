const { validationResult } = require("express-validator"),
  File = require("../models/file.js"),
  errorController = require("./errorController"),
  httpStatus = require("http-status-codes"),
  fs = require("fs");

module.exports = {

  index: (req, res) => {
  
    File.findAll()
    
      .then(files => {
      
        let list_size = req.query.list_size ? req.query.list_size : 10;
        
        let lists = Math.ceil(files.length / list_size);
        
        let array_of_lists = [];
        
        for (let i = 0; i < lists; i++) {
        
          let list = [];
        
          for (let j = i * list_size; j < (i + 1) * list_size && j < files.length; j++) {
          
            list.push(files[j]);
          
          }
          
          array_of_lists.push(list);
        
        }
        
        res.json({ error: false, pages: array_of_lists });
      
      })
      
      .catch(error => {
      
        console.error(`Some error occured while listing the file: ${error.message}`);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: true, message: error.message });
      
      })
  
  },

  create: (req, res) => {
  
    if (!req.files.file) {
    
      res.status(httpStatus.BAD_REQUEST)
        .json({ error: true, message: "You forgot to upload a file :(" });
    
    } else {
    
      File.create({
      
        name: req.files.file.name,
        size: req.files.file.size,
        MIME: req.files.file.mimetype,
        extension: req.files.file.name.split(".").slice(1, req.files.file.name.split(".").length).join(".")

      
      })
      
        .then(file => {
        
          req.files.file.mv(`./public/files/${file.id + "." + file.extension}`, async error => {
          
            if (error) {
            
              await File.destroy({where: { id: file.id }});
              res.json({error: true, message: error.message})
              
            
            } else {
            
              res.json({error: false, message: "File was uploaded successfully!"})
            
            }
          
          })
        
        })
        
        .catch(error => {
        
          console.error(`Error while uploading the file: ${error}`);
          res.json({error: true, message: error.message});
        
        })
    
    }
    
  },
  
  read: async (req, res) => {
  
    let file = await File.findOne({where: { id: req.params.id }});
  
    if (!file) {
    
      errorController.pageNotFoundError(req, res);
    
    } else {
    
      res.json(file);
    
    }
  
  },
  
  update: async (req, res) => {
  
    let file = await File.findOne({ where: {id: req.params.id} });
    
    if (!file) {
    
      errorController.pageNotFoundError(req, res);
    
    } else if (!req.files.file) {
    
      res.status(httpStatus.BAD_REQUEST)
        .json({ error: true, message: "You forgot to upload a file :(" });
    
    } else {
    
      let params = {
      
        name: req.files.file.name,
        size: req.files.file.size,
        MIME: req.files.file.mimetype,
        extension: req.files.file.name.split(".").slice(1, req.files.file.name.split(".").length).join(".")
      
      };
      
      File.update(params, { where: {id: req.params.id} })
      
        .then(() => {
        
          fs.unlink(`./public/files/${file.id}.${file.extension}`, async error => {
          
            if (error) {
            
              console.error(`Error occured while uploading the file: ${error.message}`);
              
              await File.update(file, { where: { id: file.id } });
              
              res.status(httpStatus.INTERNAL_SERVER_ERROR)
                .json({ error: true, message: error.message });
            
            } else {
            
              req.files.file.mv(`./public/files/${file.id}.${params.extension}`, async error => {
              
                if (error) {
                
                  await File.destroy({where: { id: params.id }});
                  res.json({error: true, message: error.message})
                  
                
                } else {
                
                  res.json({error: false, message: "File was updated successfully!"})
                
                }
              
              })
            
            }
          
          });
        
        })
        
        .catch(error => {
        
          console.error(`error while uploading a file: ${error.message}`);
          res.json({ error: true, message: `Sorry, can not update the file: ${error.message}` });
        
        })
    
    }
  
  },
  
  download: async (req, res) => {
  
    let file = await File.findOne({where: { id: req.params.id }});
    
    if (file) {
    
      res.download(
      
        `./public/files/${file.id}.${file.extension}`,
        
        `${file.id}.${file.extension}`,
        
        error => {
        
          if (error) {
          
            res.status(httpStatus.INTERNAL_SERVER_ERROR)
              .json({ error: true, message: `Sorry, our site is broken: ${error.message}` });
          
          } 
        
        }
      
      );
    
    
    } else {
    
      errorController.pageNotFoundError(req, res);
    
    }
  
  },
  
  delete: async (req, res) => {
  
    try {
    
      let file = await File.findOne({where: { id: req.params.id }});
      
      if (!file) {
      
        errorController.pageNotFoundError(req, res);  
      
      } else {
      
        fs.unlink(`./public/files/${file.id}.${file.extension}`, async error => {
        
          if (error) {
          
            throw error;
          
          } else {
          
            await File.destroy({where: { id: req.params.id }});
            res.json({ error: false, message: "File was deleted succesfully!" });
          
          }
        
        });
      
      }
    
    } catch (error) {
    
      res.json({ error: true, message: error.message })
    
    }
  
  }
  
}
























