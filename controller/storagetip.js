const tipmodel =require("./models/tip");


const addtip = async (req,res)=>{
    let input=req.body
    let tip=new tipmodel(input)
    tip.save()
    console.log(tip)
    res.json({"status":"success"})
}

const searchtip = async (req,res)=>{
    let input=req.body
    tipmodel.find(input).then((data)=>{
        res.json(data)
    }
    ).catch((error)=>{
        res.json(error)
    })
}

const deletetip = async (req,res)=>{
    let input=req.body
    tipmodel.findByIdAndDelete(input._id).then(
        (response)=>{
            res.json({"status":"success"})
        }
    ).catch(
        (error)=>{
            res.json({"status":"error"})
        }
    )
}


const viewtips = async (req,res)=>{
    tipmodel.find().then((data)=>{
        res.json(data)
    }).catch((error)=>{
        res.json(error)
    })
}

module.exports = {
    addtip,
    deletetip,
    searchtip,
    viewtips
}