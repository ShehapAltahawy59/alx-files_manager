import { MongoClient } from 'mongodb';

class DBClient{
    constructor(){
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
            if (!err) {
              // console.log('Connected successfully to server');
              this.db = client.db("files_manager");
              
            } else {
              console.log(err.message);
              this.db = false;
            }
          });
        }

        isAlive(){
            return !!this.db;
        }

    };

    

