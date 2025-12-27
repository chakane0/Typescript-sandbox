# Handling Navigation with Routes

Every app is not confined to just one page. It can have multiple pages. ```React Router``` will be used extensively to ensure consistent behavior in routing to these other pages. 

### Declaring Routes

###### branch name = routing 
Using React Router you can define the different parts of your application. With every react project we would need to make sure we have this installed: ```npm install react-router-dom```.

Here is an example of a simple route which render a component. 

<details>
<summary>Basic code example of react routing</summary>

```MyRoute.jsx```
```.jsx
import { createBrowserRouter } from "react-router-dom";

function MyComponent() {
    return <p>Hello, Route!</p>;
}


export const router = createBrowserRouter([
    {
        path: "/",
        element: <MyComponent />
    },
]);
```

```App.js```
```.jsx
import { RouterProvider } from 'react-router-dom';
import './App.css';
import { router } from "./Components/MyRoute"
// import { RouterProvider } from "react-router-dom"

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
```

</details>
<br></br>

When we setup ```createBrowserRouter``` we can have actual routes declared as 2 key properties: (1) path and (2) element. When the path property matches the active URL, the component will be rendered.

Just note that this function were using is not rendering anything, it just manages how and when components are rendered. Its only responsible for checking the URL and retuning the right components. 


#### Decoupling Route Declarations

Heres how we can manage multiple routes declared in a single module. To help, each top level feature of the application defines its own routes.

What we can do is, at each top-level feature of the application can have its own route. This way, its clear to see which routes belong top what feature. 

Please refer to: https://github.com/chakane0/routing-practice/tree/main/routing-practice/src/Components/decouple

## How decoupling works here

### What is decoupling?
Its just a means for separating different parts of the application so that each part handles a specific responsibility without being bound to anything else. 

Decoupling ensures that your route definitions are kept seperate from the components that render the UI or business logic. By doing so, we can define/manage them in separate files which makes routing easily scalable and maintainable. 

So for example, instead of setting routes directly in App.js, we dedicate a file to handle routing. All app.js needs is this: ```<RouterProvider router={router} />```

We can also make it so that each feature can store its own routes. The reason we do this is because features can be self contained if we want to update the routing for it, we can do so without touching the global router configuration.

### Resource IDs in routes
###### branch name = routing 2
This makes it easy for your code to get an ID and then make an API call which fetches the relevant resource data. This requires a route that includes the ID, then is passed to the component so that it can fetch the user.

Take this declaration of our new route for example:

<details>
<summary>Basic code example of react routing with resource ID</summary>

```tsx
const router = createBrowserRouter([
  {
    path: '/',
    element: <UsersContainer />,
    errorElement: <p>Route not found</p>,
  },
  {
    path: '/users/:id',
    element: <UserContainer />,
    errorElement: <p>User not found</p>,
    loader: async ({ params }) => {
      const user = await fetchUser(Number(params.id));
      return { user };
    },
  },
]);
```
</details>
<br></br>

Notice ```:```, which denotes the beginning of a URL variable. The id variable will be passed to the UserContainer component. We have a ```loader``` function which is asynchronously fetching data for the specified user ID. An ```errorElement``` prop is also there as a fallback for any failures with the ID.

This is how ```UserContainer()``` is implemented
<details>
<summary>Implementation of UserContainer()</summary>

```tsx
function UserContainer() {
  const params = useParams();
  const { user } = useLoaderData() as { user: User };
  return (
    <div>
      User ID: {params.id}
      <UserData user={user /}>
    </div>
  )
}
```

</details>
<br></br>
Here we are leveraging the useParams() hook which is used to get any dynamic parts of the URL. We want the id param in this case. We get ```user``` from the loader function using the ```useLoaderData``` hook. If the URL is missing from the segment, then the code wont run at all and the ```errorElement`` will be used. 

<details>
<summary>API functions for this example</summary>

```tsx
export type User = {
  first: string;
  last: string;
  age: number;
}

const users: User[] = [
  { first: 'John', last: 'Snow', age: 40 },
  { first: 'Peter', last: 'Parker', age: 30 },
];

export function fetchUsers(): Promise<User[]> {
  return new Promise((resolve) => {
    resolve(users);
  });
};

export function fetchUser(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    const user = users[id];
    if(user == undefined) {
      reject('User ${id} not found');
    } else {
      resolve(user);
    };
  });
};
```

</details>
<br></br>
The function ```fetchUsers()``` will be used by the UsersContainer component to populate the list of user links. The fetchUser() function fetches for a single user. 


<details>
<summary>Example of the User component</summary>

```tsx
type UserDataProps = {
  user: User;
};

function UserData({ user }: UserDataProps) {
  return (
    <section>
      <p>{user.first}</p>
      <p>{user.last}</p>
      <p>{user.age}</p>
    </section>
  );
};
```

</details>
<br></br>