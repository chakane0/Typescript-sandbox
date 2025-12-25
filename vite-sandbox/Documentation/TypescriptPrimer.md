# Typescript Primer

This chapter focuses on ```property validation``` in react components with typescript. Here we can expect to:
* Setup typescript within the project
* Example of how to use typescript
* have a good understanding of property validation and type checking
* Be able to create more predictable and reliable components using TypeScript

When we talk about ```props validation``` we are talking about the properties were passing into react components. Validating this will ensure it behaves in a certain way if it receives props of those types. Props validation can:
1. Help catch errors early.
2. Improves code readability.
3. Makes components more predictable.

Heres an example of a react component which renders a list using typescript:

```.jsx
type User = {
    name: String;
    email: String;
};
type MyListProps = {
    list: User[];
};
const MyList = ({ list }: MyListProps) => (
    <ul>
        {list.map((user) => (
            <li key={user.name}>
                {user.name} ({user.email})
            </li>
        ))}
    </ul>
);
```

Here, we are defining a ```User``` and ```MyListProps``` type which we use in our react component. 

## Introduction To TypeScript
```Typescript``` is a statically typed superset of Javascript that is developed and maintained by Microsoft. Its basically Javascript with additional features, most importantly being, static typing. Javascript itself is dynamically typed. 

Heres an example of a greeting statement:

```.jsx
function greet(name: string) {
    return 'Hello, ' + name;
};
console.log(greet('chakane'))
```

#### Setting up typescript in your project
You can create a new project with typescript included by executing this: ```npm create vite@latest my-react-app -- --template react-ts```.

#### Basic Types in typescript
* boolean
* number
* string
* number[]
* ```Array<number>```
* tuples
* enums
* any
* unknown --> similar to any except it isnt assign to anything but itself.
* void --> the opposite of any; meaning the abscense of any type at all.
* null/undefined --> undefined plays a crucial role in optional types which are denoted by ```?``` after the type name; meaning the value can be the specified type or undefined.
* never --> represents a type of value that never occurs.

##### Interfaces and type aliases
Type aliases are similar to interfaces, although they can be used for other types as well not just objects. Heres a type alias for example:

```.jsx
// This is a Point type that represents a point in a two dimensional space and ID that can be a string or number.
type Point = {
    x: number;
    y: number;
};
type ID = number | string;

// This is how we can use them
const point: Point = {
    x: 10,
    y: 20,
};
const id: ID = 100;
```

##### Interfaces vs type alias
Both are way to describe objects and their structures. 
Interfaces are more extensible because they can be declared multiple times and they will be merged together. Usually used to create object shapes

Type aliases cant be re-opened to add new properties. Although they can represent other types like union types, intersection types, tuples, and other types that arent currently available in the interface. Is the usual tool for defining any type, not just objects. 


##### Type-checking props in React Components
A primary way of leveraging TypeScript is within our components when using props. Take this example:

```jsx

// this defines a GreetingProps type which specifies the value it will receive. We can then use this type to type-check the name of the prop in Greeting component.
type GreetingProps = {
    name: string;
}
const Greeting = ({ name}: GreetingProps) => {
    return <h1>Hello, {name}!</h1>
};
```

The above example works for just one prop, the same approach can be used for components with more props. If a components receives an object or an array as a prop, we can define a type which describes the shape of that object or array. For example:

```jsx

// UserCard component gets a user prop that is an object with name and email properties.
// We define a UserProps type which describes the type and use it to type check the user prop.
type UserProps = {
    user: {
        name: string;
        email: string
    };
};
const UserCard = ({ user }: UserProps) => {
    return (
        <div>
            <h1>{user,name}</h1>
            <p>{user.email}</p>
        </div>
    )
}
```


Sometimes a component has props that arent always required. In these cases we can give a default value for a prop, and mark it as optional in our type definition. For example

```jsx
// ButtonProps type is using React.ReactNode for the children prop.
// This is a special type provided by React which accepts any kind of content
// Using React.ReactNode is stating that the children prop can be any kind of content
// diabled is optional because we added the ?
type ButtonProps = {
    children: React.ReactNode;
    disabled?: boolean;
};

const Button = ({ children, disabled = false }: ButtonProps) => {
    return <button disabled={disabled}>{children}</button>
};

// now Button component can be used weith or without the disabled prop.
<Button>Click me!</Button>
<Button disabled>Don't click me!</Button>
```

#### Typing State
We can also use TypeScript to type check the state in our components. Heres an example:

```jsx

// This component  uses React.useState<number>(0) to declare a state variable "count" with an initial value of 0.
// By providing <number> as a type argument to "useState"
// Were telling that count should always be a number
const Counter = () => {
    const [count, setCount] = React.useState<number>(0);
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => {
                setCount(count + 1);
            }}>Increment</button>
        </div>
    );
};
```

#### Type event handlers
We can type check out event handlers to ensure were using the right event types and accessing the right properties on the event objects. Heres an example:

```jsx
// In InputField were defining a handleChange function which is called whenever the input fields value changes. 
// React.ChangeEvent<HTMLInputElement> specifies that this function should receive  change event from an input field. 
const InputField = () => {
    const [value, setValue] = React.useState("");
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };
    return <input value={value} onChange={handleChange}/>;
};
```

#### Typing Context
We can also type-check our context to ensure that were using correcrt types of values. Heres an example:

```jsx

// Here, we created a ThemeContext with React.createContext
// Were providing a ThemeContextType as a type argument to createContext to specify the type of the context value
//Were then creating a ThemeProvider component which gives the theme and setTheme values to the context. 
// Inside the useTheme hook, were using React.useContext to consume the themeContext. if null, we throw an error
// NOTE that in the useTheme hook, we dont specify a type, it returns the context value which typescript knows is type ThemeContextType type and not null. 
type ThemeContextType = {
    theme: string;
    setTheme: (theme: string) => void;
};
const ThemeContext = React.createContext<ThemeContextType | null>(null);
const ThemeProvider = ({children}: { children: React.ReactNode }) => {
    const [theme, setTheme] = React.useState('light');
    return (
        <ThemeContext.Provider value={{ theme, setTheme}}>{children}</ThemeContext.Provider>
    );
};
const useTheme = () => {
    const context = React.useContext(ThemeContext);
    if(context === null) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
```

#### Typing refs
Recall that refs will give you a way to access DOM nodes or React elements directly within our components. To ensure were using these refs correctly we can use TypeScript. Heres an example:

```jsx
// In this component, were creating a ref with React.useRef
// Were providing the HTMLInputElement as a type argument to useRef
//HTMLInputElement is a type provided by Typescript's built in DOM typings, and it represents an input elemnt in the DOM. 
// This type corresponds to the type of DOM element that the refs is attached to. 
// This means that inputRef.current wull be of the HTMLInputElement | null type and TS will know that it has a focus method. 
const InputWithRef = () => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const focusInput = () => {
        if(inputRef.current) {
            inputRef.current.focus();
        };
    };
    return (
        <div>
            <input ref={inputRef} type="text"/>
            <button onClick={focusInput}>Focus the input</button>
        </div>
    )
}
```
