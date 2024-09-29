import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController{
    static async postNew(req,res){
        const { email, password } = request.body;
        if (!email) return response.status(400).send({ error: 'Missing email' });

    if (!password)
      return response.status(400).send({ error: 'Missing password' });

    const emailExists = await dbClient.usersCollection.findOne({ email });

    if (emailExists)
      return response.status(400).send({ error: 'Already exist' });

    const sha1Password = sha1(password);
    let result;
    try {
      result = await dbClient.usersCollection.insertOne({
        email,
        password: sha1Password,
      });
    } catch (err) {
    //   await userQueue.add({});
      return response.status(500).send({ error: 'Error creating user' });
    }
    const user = {
        id: result.insertedId,
        email,
      };
    return response.status(201).send(user);

    }

}
export default UsersController;
