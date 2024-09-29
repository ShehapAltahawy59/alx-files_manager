import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import Queue from 'bull';
import dbClient from '../utils/db';
import { ObjectID } from 'mongodb';
const userQueue = new Queue('userQueue');

class UsersController {
  /**
   * Creates a user using email and password
   *
   * To create a user, you must specify an email and a password
   * If the email is missing, return an error Missing email with
   * a status code 400
   * If the password is missing, return an error Missing password with
   * a status code 400
   * If the email already exists in DB, return an error Already exist with
   * a status code 400
   * The password must be stored after being hashed in SHA1
   * The endpoint is returning the new user with only the email and the id
   * (auto generated by MongoDB) with a status code 201
   * The new user must be saved in the collection users:
   * email: same as the value received
   * password: SHA1 value of the value received
   */
  static async postNew(request, response) {
    const { email, password } = request.body;

    if (!email) return response.status(400).send({ error: 'Missing email' });

    if (!password)
      return response.status(400).send({ error: 'Missing password' });

    const emailExists = await dbClient.db.collection('users').findOne({ email });

    if (emailExists)
      return response.status(400).send({ error: 'Already exist' });

    const sha1Password = sha1(password);

    let result;
    try {
      result = await dbClient.db.collection('users').insertOne({
        email,
        password: sha1Password,
      });
    } catch (err) {
      await userQueue.add({});
      return response.status(500).send({ error: 'Error creating user' });
    }

    const user = {
      id: result.insertedId,
      email,
    };

    await userQueue.add({
      userId: result.insertedId.toString(),
    });

    return response.status(201).send(user);
  }

  /**
   *
   * Should retrieve the user base on the token used
   *
   * Retrieve the user based on the token:
   * If not found, return an error Unauthorized with a
   * status code 401
   * Otherwise, return the user object (email and id only)
   */
  static async getMe(request, response) {
    const token = request.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (userId) {
        const users = dbClient.db.collection('users');
        const idObject = new ObjectID(userId);
        users.findOne({ _id: idObject }, (err, user) => {
          if (user) {

                    const processedUser = { id: user._id, ...user };
                    delete processedUser._id;
                    delete processedUser.password;

                    return response.status(200).send(processedUser);
  } else {
    response.status(401).json({ error: 'Unauthorized' });
  }
});
} else {
console.log('Hupatikani!');
response.status(401).json({ error: 'Unauthorized' });
}}}


export default UsersController;
