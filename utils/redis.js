const redis = require('redis');
class RedisClient{
     constructor (){
         this.client = redis.createClient({
            url: 'redis://localhost:6379' // default Redis URL
          });
          this.client.on('error',(err) =>{console.log(err)})
          this.client.connect().catch((err) => {
            console.error('Redis connection error:', err);
          });
    } ;

    async isAlive(params) {
        try{
        const result = await this.client.ping();
        if (result === 'PONG')
            return true
        else return false
        }
        catch(err){
            return false
        }
    }

    async get(key){
        result = await this.client.get(key)
        return result
    }

    async set(key,value,duration){
    try{
     await this.client.setEx(key,duration,value)
    }
    catch (err){
        console.error(err)
    }
}
    async del(key){
        try{
            this.client.del(key)
        }
        catch(err){
            console.error(err)
        }
    }

}
