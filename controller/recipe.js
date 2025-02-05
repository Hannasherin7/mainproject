const recipemodel=require("./models/recipe")
const addrec = async (req,res)=>{
    let input=req.body
    let recipe=new recipemodel(input)
    recipe.save()
    console.log(recipe)
    res.json({"status":"success"})
}

const searchrec= async (req,res)=>{
    let input=req.body
    recipemodel.find(input).then((data)=>{
        res.json(data)
    }
    ).catch((error)=>{
        res.json(error)
    })
}

const deleterec= async (req,res)=>{
    let input=req.body
    recipemodel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
        }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        }
    )
}


const viewrec = async (req,res)=>{
    recipemodel.find().then((data)=>{
        res.json(data)
    }).catch((error)=>{
        res.json(error)
    })
}

module.exports = {
    addrec,
    searchrec,deleterec,
    viewrec
}