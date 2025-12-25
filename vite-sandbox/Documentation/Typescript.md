# Type Checking and Validation with Typescript

We are introducing typescript, which is a great tool for static type checking in javascript. This helps us write better and less buggy code. 

Lets take props for example, these are inputs for our react components. It would become important to validate these inputs before being consumed. 

Lets consider this code example:

```.jsx
const myList = ({ list }) => (
    <ul>
        {list.map((user) => (
            <li key={user.name}>
                {user.name} ({user.email})
            </li>
        ))}
    </ul>
);
```

This would be a valid component. All it does is expect some data which we map out into a list. However, its totally possible we could run into errors here. Mainly, what if the data doesnt exist?

In this case we can consider props validation. React offers tools for props validation but were going to focus on typescript as a tool for validation. Heres a typescript example:

```.ts
type User = {
    name: string;
    email: string;
};
type myListProps = {
    list: User[];
}
const MyList = ({list}: MyListProps) => (
    <ul>
        {list.map((user) => (
            <li key={user.name}>
                {user.name} ({user.email})
            </li>
        ))}
    </ul>
);
```

In this example we are defining a User type and a myListProps type. This infers what type the prop is when initialized. 

### Introduction to Typescript
Typescript is a statically types superset of javascript which is developed and maintained by microsoft. You can write typescript in your jsx files. 

Heres a typescript example:

```.ts
function greet(name: string) {
    return "hello, " + name;
}
console.log(greet("mike"));
console.log(greet(11));
```

The second log statement will throw an error for wrong type. This will be useful for us when creating our react apps.

Learn more about typescript <a src="Documentation/TypescriptPrimer.md">here</a>

### Setting up typescript in your project
You can create a new project with typescript included by executing this: ```npm create vite@latest my-react-app -- --template react-ts```.

If you want to setup react in an already existing project, execute this:

1. Install Dependencies
```npm install --save typescript @types/react @types/react-dom```

2. Add a tsconfig.json
```npx tsc --init```

 

 
