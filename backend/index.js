import "dotenv/config.js";
import express from 'express'
import morgan from 'morgan'
import bodyParser from "body-parser";
import { createClient } from '@supabase/supabase-js';
const { PORT, SUPABASE_API_KEY, SUPABASE_PROJECT_ID } = process.env
import ip from 'ip'

import multer from 'multer'
import cors from 'cors'

import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';


const __filename = fileURLToPath(import.meta.url);
import { Server } from 'socket.io';
import { createServer } from "http";
// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

console.log('directory-name 👉️', __dirname);

// 👇️ "/home/borislav/Desktop/javascript/dist/index.html"
console.log(path.join(__dirname, '/dist', 'index.html'))


const app = express();
// using morgan for logs
app.use(morgan('combined'));
const httpServer = createServer(app);

const io = new Server(httpServer, { cors: {
    origin: "*",
    methods: ["GET", "POST"]
  } });


const corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}

app.use(cors(corsOptions))



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


const supabase = createClient(SUPABASE_PROJECT_ID,SUPABASE_API_KEY)

app.get('/', (req, res) => {
    console.log('running / route');
    return res.status(200).send("workiung fine /")
})


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '/tmp/my-uploads')
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//         cb(null, file.fieldname + '-' + uniqueSuffix)
//     }
// })

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + "/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

console.log(process.cwd())

app.post('/contracts/uploads', upload.single('file'), async (req, res) => {

    try {
        var obj = JSON.parse(readFileSync(__dirname + '/uploads/clients_data.json', 'utf8'));
        console.log(obj)

        const { data, error } = await supabase.from('contracts').insert(obj)

        if (error) {
            console.log('err', error);
        }

        return res.status(200).send({ status: "done" })

    } catch (error) {
        console.log('err', error)
    }

})

app.get('/contracts', async (req, res) => {

    const query = req.query;
    console.log("query", query)

    let filters = [];
    let dbQuery = supabase.from('contracts').select()

    if (query.search) {
        console.log('running name', query.search)
        filters.push('client_name')
        dbQuery = dbQuery.eq('client_name', query.search)
    }

    if (query.page) {
        filters.push('page')
        console.log('running page', query.page);
        let to = query.page * 20;

        let from = query.page * 20 + query.page * 20
        console.log('to from', to, from)
        dbQuery.range(query.page * 20, query.page * 20 + 20 -1)
    }

    if (query.searchId) {
        filters.push('clientid')
        console.log('running id', query.searchId)
        dbQuery = dbQuery.eq('id', query.searchId)
    }

    if (query.status) {
        filters.push('status')
        console.log('running draft', query.status);
        if (query.status == "Draft") {
            dbQuery = dbQuery.eq("status", query.status)
        } else if (query.status == "Finalized") {
            dbQuery = dbQuery.eq("status", query.status)
        }
    }


    const { error, data } = await dbQuery.order('id', { ascending: true });


    console.log(filters)
    if (error) {
        console.log('error', error)
    }
    return res.send(data);

});


app.get("/contracts/:id", async (req, res) => {
    const id = req.params.id;
    let { error, data } = await supabase.from('contracts').select().eq("id", id).limit(1)
        .single()

    if (error) {
        console.log(error);
    }
    return res.status(200).send(data)

})

app.post("/contracts/update/:id", async (req, res) => {
    console.log('running update')
    const newContent = req.body;
    const contractId = req.params.id;

    console.log("req", req.params, "body", req.body)

    const { data, error } = await supabase
        .from('contracts')
        .update(req.body)
        .eq('id', contractId)
        .select();

    if(!error){
        console.log('sending update event')
        io.local.emit("update",{
            update:true
        })
    }

    console.log('data', data);
    console.log('error', error);
    return res.status(200).send(data)

})

app.delete("/contracts/delete/:id", async (req, res) => {
    const contactId = req.params.id;

    console.log("contractId", contactId)
    console.log(req.params)

    const { data, error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', contactId)
        .select()

    console.log("error ", error)

    return res.status(200).send(data)


})

// web socket connection



function print(path, layer) {
    if (layer.route) {
        layer.route.stack.forEach(print.bind(null, path.concat(split(layer.route.path))))
    } else if (layer.name === 'router' && layer.handle.stack) {
        layer.handle.stack.forEach(print.bind(null, path.concat(split(layer.regexp))))
    } else if (layer.method) {
        console.log('%s /%s',
            layer.method.toUpperCase(),
            path.concat(split(layer.regexp)).filter(Boolean).join('/'))
    }
}
function split(thing) {
    if (typeof thing === 'string') {
        return thing.split('/')
    } else if (thing.fast_slash) {
        return ''
    } else {
        var match = thing.toString()
            .replace('\\/?', '')
            .replace('(?=\\/|$)', '$')
            .match(/^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//)
        return match
            ? match[1].replace(/\\(.)/g, '$1').split('/')
            : '<complex:' + thing.toString() + '>'
    }
}



io.on("connection",(socket)=>{
    console.log('user connected')
    io.emit("hi","hi")
})






app._router.stack.forEach(print.bind(null, []))

// console.log('ip',ip.address())


httpServer.listen(PORT, () => {
    console.log('running on 4000')
})