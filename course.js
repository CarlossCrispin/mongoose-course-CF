const mongoose = require('mongoose');
//npm i validator
// const isEmail = require('validator').isEmail;
//npm i slugify
const slugify = require('slugify');
//1. definir schema

/* require('./video');
const Video= mongoose.model('Video');
 */
let courseSchema = new mongoose.Schema({
    //_id: ObjectId
    title: {
        type: String,
        required: true,
        //validate: isEmail
        /* validate:{
            validator: function (value) {
                return true //valido
                return false // no VAlid
            }
        },
        message:(props)=>`el valor :${props.value} no fue valido` */
    },
    description: {
        type: String,
        minlength: [50, 'No se cumple la longitud minima de 50 caracteres'],
        maxlength: 300,
        select: false
        // enum:['Bueno','Malo']
    },
    numberOfTopics: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
        required: true
    },
    publishedAt: Date,
    slug: {
        type: String,
        require: true
    },
  /*   videos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Video'
        }
    ] */
});

/* virtual */

courseSchema.virtual('videos')
    .get(function () {
        return mongoose.model('Video').find({ course: this._id });
    });



courseSchema.virtual('info')
    .get(function () {
        //this => documento
        return `${this.description}. Temas: ${this.numberOfTopics}. Fecha de lanzamiento: ${this.publishedAt}`
    });

/* MIDDLEWARE */
/* 
validate
save
remove
updateOne
deleteOne
init => sync
*/
//antes de 
/* courseSchema.pre('validate', function (next) {
    this.slug = slugify(this.title, '_')
    next();
}) */
courseSchema.pre('save', function (next) {
    if (this.slug) return next();
    generateSlugAndContinue.call(this, 0, next);
})

courseSchema.statics.validateSlugCount = function (slug) {
    return Course.count({ slug: slug }).then(count => {
        if (count > 0) return false;
        return true;
    })
}

function generateSlugAndContinue(count, next) {
    this.slug = slugify(this.title);
    if (count != 0)
        this.slug = this.slug + '-' + count;
    Course.validateSlugCount(this.slug).then(isValid => {
        if (!isValid)
            return generateSlugAndContinue.call(this, count + 1, next);

        next();

    })
}
//despues de 
// courseSchema.post()

//2. definir el modelo
let Course = mongoose.model('Course', courseSchema)

