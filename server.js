const express = require('express');
const mongoose = require('mongoose');
require('./course');
require('./video');


mongoose.set("useNewUrlParser",true);
mongoose.set("useUnifiedTopology",true);

mongoose.connect("mongodb://localhost/mongoose-course",()=>{
    console.log("\nSuccessful connection BD --> 💾 💻 ");
    
})
const app = express();

const Course = mongoose.model('Course');
const Video= mongoose.model('Video');

app.get("/", (req,res)=>{


    // Course.countDocuments()
    // Course.estimatedDocumentCount()


    // res.send("HOLA MUNDO !! 😁 ✨");
    /* Course.find(
        {
            title: {
                $regex:"Curso",
                $options:'i'
            }
        },
        {
            _id:false,
            title:true,
            slug:true,
            description:true
        }, 
        {
            sort:{
                slug:1
            }
        }
    )
     */
    const page = 0;
    const perPage =2;
    Course.find({},null,{
        limit:perPage,
        skip:page * perPage,
        sort:'title'
       
    }).populate('videos')
    .then(collecion =>{
        res.json(collecion);
    }).catch(err=>res.json(err))
})

app.get('/cursos', (req,res)=>{
    Course.find({}).then(docs=>{
        res.json(docs)
    }).catch(err=>{
        console.log(err);
        res.json(err)
        
    })
})

app.get('/cursos/:id', (req,res)=>{
    Course.findById(req.params.id).then(doc=>{
        res.json(doc)
    }).catch(err=>{
        console.log(err);
        res.json(err)
        
    })
})

app.post("/cursos", (req,res)=>{

    Course.create(
        {
            title:'Curso de Angular',
            description: 'Vitae dolor ut quisquam et vitae atque. Eligendi nobis corrupti sit. Et doloremque quis asperiores. Et inventore unde sed dicta accusamus nihil facilis neque. Id ut reiciendis eius illum magnam.'

        }
    ).then(doc =>{
        res.json(doc)
    }).catch(err=>{
        console.log(err);
        res.json(err);
        
    })
})

app.put("/cursos/:id", (req, res)=>{
    //1. Actualizar
    /* Course.update({numberOfTopics:0},{publishedAt: new Date()},{multi: true}).then(r =>{
        res.json(r)
    }).catch(err => res.json(err)) */

    //2. findOneAndUpdate
   /*  Course.findOneAndUpdate(req.params.id,{
        publishedAt: new Date()
    },{new:true}).then(doc => res.json(doc)).catch(err=>res.json(err)); */
    
    //3. encontrar y guardarlo

    Course.findById(req.params.id).then(course => {
        course.publishedAt = new Date();
        return course.save();
    }).then(saveResponse => res.json(saveResponse)).catch(err => res.json(err))

});

app.delete("/cursos/:id", (req, res)=>{
    //1. Eliminar multiples
   /*  Course.deleteMany({numberOfTopics:0}).then(r =>{
        res.json(r)
    }).catch(err => res.json(err)) */

    //2. findByIdAndDelete
  /*   Course.findByIdAndDelete(req.params.id).then(doc => res.json(doc)).catch(err=>res.json(err)); */
    
    //3. encontrar y eliminarlo

    Course.findById(req.params.id).then(course => {
        course.publishedAt = new Date();
        return course.delete();
    }).then(deleteResponse => res.json(deleteResponse)).catch(err => res.json(err))

});

app.post("/videos",(req, res) => {
    Video.create({
        title: 'Primer video',
        course: '5ed68f363fedad09da56093a',
        tags:[
            {title:'Mongo'},
            {title:'Web'},
        ]
    }).then(video => {
        res.json(video);
    }).catch(err => res.json(err))
});

app.get("/videos",(req, res) => {
    Video.find().populate('course').then(video =>{
        res.json(video)
    }).catch(err => res.json(err))
});


app.get('/cursos/:id/videos', (req,res)=>{
    Course.findById(req.params.id).then(course=>{
        course.videos.then(videos =>{
            res.json(videos)
        })
        // res.json(doc)
    }).catch(err=>{
        console.log(err);
        res.json(err)
        
    })
})


app.put('/videos/:id', (req,res)=>{
    let video = Video.findById(req.params.id).then(video=>{
        video.tags[0]={title:'Mongo v3'}
        return video.save()
    }).then(video=>res.json(video)).catch(err=>{
        console.log(err);
        res.json(err);
        
    })
})

app.delete('/videos/:id/tags/:tag_id', (req,res)=>{
    let video = Video.findById(req.params.id).then(video=>{
        /* const tag = video.tags.id(req.params.tag_id).remove(); */
        const tag = video.tags.pull(req.params.tag_id);
        return video.save()
    }).then(video=>res.json(video)).catch(err=>{
        console.log(err);
        res.json(err);
        
    })
})

app.listen(3000,()=>console.log("\n--> Server started !!!  🚀")
)