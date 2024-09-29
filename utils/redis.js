const redis = require('redis');
class RedisClient{
     constructor (){
         this.client = redis.createClient({ // default Redis URL
          });
          this.getAsync = promisify(this.client.get).bind(this.client);
          this.client.on('error',(err) =>{console.log(err)})
          this.client.connect().catch((err) => {
            console.error('Redis connection error:', err);
          });
    } ;

    async isAlive(params) {
        return this.client.connected;
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

const redisClient = new RedisClient();

export default redisClient;
