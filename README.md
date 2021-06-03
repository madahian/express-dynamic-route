# Express Dynamic Routes ✨

This structure includes of three important parts:

## 1. Routes 🔗

For implementing routes you must create a `.js` file **with the name of the entity** (_table name in database_) in to the `./routes/` directory.
(e.g. `cats.js`)

Inside of this file you can define your routes with a particular structure for that entity specifically.
Let say we want to define `GET /cats/` route for getting all the cats that submitted before into our database in **cats table**. In order to do that in `cats.js` file we write these lines of code below:  
  
  
> Directory: _/routes/cats.js_

```
module.exports = [
  {
    name: "/",
    method: "get",
    auth: true,
  },
]
```
### Options: 
* `name`: The route address.  
* `method`: Shows the RESTful API methods such as `get`, `post`, `put` and `delete`.  
* `auth`: Determines that the user needs to be logged in or not in order to requesting to this route.  

This will automatically create the route and the basic GET function for us. The response would be like this:
```
{
  status: "success",
  results: 2,
  data: [
    {
      id: 1,
      breed: "Abyssinian"
    },
    {
      id: 2,
      breed: "Asian cat"
    }
  ],
}
```

***

## 2. Controllers 🎮

All the defined routes will be handled with the basic CRUD operations in a factory controller called `crudOperations`, therefore if you have a simple route you don't need to create a separate controller to handle the requests for that. By the way it is totally up to you!

For example we want to create a custom controller for login route `POST /users/login` with a custom POST function:  
* First of all you need to create a `.js` file in `./controller/helpers` directory with the entity name (_In this case it would be **users.js**_). 
Remember that the `helpers` folder is for all the customized controllers of the routes and entities.
* In that JavaScript file we write and export all the customized functions. Look at the example below:  
> Directory: /controller/helpers/users.js  
```
module.exports = {
  loginPOST: async (req, res, next) => {
    const user = await baseService.first({ tableName: "users", where: { username: req.body.username } } );
    if (req.body.pass === user.password) {
      res.json({
        status: "success",
        message: "Hi user!"
      })
    } else {
      return next(
        new error("Wrong username or password.", 401)
      );
    }
  }
}
```
* `loginPOST` (in this case): Determines that this function is for handling the `POST /users/login` route.  
  
This name came from `callHelperIfExist` function in `baseController.js`.
For example if you have a `GET /users/:id` route, then you must name your custom function to `_idGET`, Or in another example if you have a `GET /users/admins` route, you must name the custom function to `adminsGET` in order to handle your route with a customized function.
For practicing to how you must name your function in the entity's controller, you can write a `console.log(fncName)` in `callHelperIfExist` function located in baseController.js before the `if` statement. The `fncName` reveals the exact name of the custom function for a certain route.(**_Try it!_**)
  

We will learn about `baseService` in the next part.

***

## 3. Services ⚙

This is the where we define the functions to communicate with the database. We use **Knex.js** query builder in order to connect to the database and write our queries. After we wrote our service functions such as find, update, delete and etc., we use them in our controllers to make our code more cleaner and readable.  
  

**`baseService.js`**: In this file, I wrote the regular functions that you can use them in the entire project files, such as `first`, `find`, `findWithJoin`, `insert`, `update` and `delete`.
  
* **`first`**: This function could be use for getting **a** record by the conditions like ID (e.g. in `GET /entity/:id` is useful). It takes an object as the argument which includes two properties (`tableName`: name of the table, and `where`: conditions) and returns a result object. If the record doesn't found, a 404 not found error will send to the client.  
  

* **`find`**: This function is useful for getting a list of the records with some conditions or filtering properties. Like the `first` function, It takes an object as the argument which includes four properties (`tableName`: `is required` and name of the table, `where`: conditions, `filter`: an array of filtering properties, `filterByDate`: the column name that you want to do a filter by date time on it, `selection`: an array of selected column names (an array of strings)) and returns a result object. The result object of this function contains two property (`data`: founded records and `results`: the count of them).  
  

* **`findWithJoin`**: Does the same as the `find` function does, except it's for joining two tables and then get the results. It takes the object argument like `find` function but with three more required properties in that object (`secTableName`: second table name, `firstProp`: property of the first table that will compare to another property of the second table which is `secProp`).
  

* **`update`**: As you might think, this function is used to update a record. It takes an object as the argument with three properties (`tableName`: name of the table, `fields`: fields that you want to update, `id`: the ID of the record you want to update). First it checks if the record is exists, If not, an error will send to the client.  
  

* **`insert`**: You can use this function to insert the data in a certain table. It takes an object as the argument which includes two properties (`tableName`: name of the table, and `fields`: the properties with values e.g. `req.body`).  
  

* **`delete`**: This is like the `first` function but it deletes the record which has the conditions that we gave it to it. It takes an object as the argument which includes two properties (`tableName`: name of the table, and `fields`: conditions).  
  
These are the functions that we can use them all over the project structure. But if you feel that you want your own customized functions (`first`, `find`, `findWithJoin`, `insert`, `update` and `delete`) you can modify them in `baseService.js`.  
  
To implement custom services for just a particular entity, create a .js file with the name of the entity (the table name) in `./service/helpers` directory, then write and export your own `first`, `find`, `findWithJoin`, `insert`, `update` and `delete` functions.  
  
(...)
