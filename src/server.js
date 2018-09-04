import app from './app'
import { db } from './db'

//démarrage du serveur 
//-----------------------------------------------------------------

(async function() {
    try{
        await db.connect('mongodb://localhost:27017/wiztivi', { useNewUrlParser: true})
        app.listen(5000, () => console.log('started'))
    }catch(error){
        console.error(error)
        process.exit(1)

    }
})()