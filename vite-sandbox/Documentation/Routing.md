# Handling Navigation with Routes

Every app is not confined to just one page. It can have multiple pages. ```React Router``` will be used extensively to ensure consistent behavior in routing to these other pages. 

### Declaring Routes

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

When we setup ```createBrowserRouter``` we can have actual routes declared as 2 key properties: (1) path and (2) element. When the path property matches the active URL, the component will be rendered.

Just note that this function were using is not rendering anything, it just manages how and when components are rendered. Its only responsible for checking the URL and retuning the right components. 


#### Decoupling Route Declarations

Heres how we can manage multiple routes declared in a single module. To help, each top level feature of the application defines its own routes.

What we can do is, at each top-level feature of the application can have its own route. This way, its clear to see which routes belong top what feature. 

Please refer to: https://github.com/chakane0/routing-practice/tree/main/routing-practice/src/Components/decouple

## How decoupling works here

### What is decoupling?
Its just a means for separating different parts of the application so that each part handles a specific responsibility without being bound to anything else. 

Decoupling ensures that your route definitions are kept separate from the components that render the UI or business logic. By doing so, we can define/manage them in separate files which makes routing easily scalable and maintainable. 

So for example, instead of setting routes directly in App.js, we dedicate a file to handle routing. All app.js needs is this: ```<RouterProvider router={router} />```

We can also make it so that each feature can store its own routes. The reason we do this is because features can be self contained if we want to update the routing for it, we can do so without touching the global router configuration.

## Handling Route Parameters
So far we have been using static routes. Lets get into how we can pass a dynamic URL segment into our components, making segments optional, and how to get query string parameters.

### Resource IDs in routes
This makes it easy for your code to get an ID and then make an API call which fetches the relevant resource data. This requires a route that includes the ID, then is passed to the component so that it can fetch the user.

Take this declaration of a route for example:

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
Notice ```:```, which denotes the beginning of a URL variable. The id variable will be passed to the UserContainer component.
