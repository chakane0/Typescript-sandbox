# Properties, State, Hooks

## State and Properties
State is the dynamic part of a react component. We're able to declare an initial state which can/will change over time. 

Properties are pieces of data passed into our react components. 

Properties differ from state because they dont change after the initial rendering of the component. 

## Hooks
Hooks are an API which allows our functional components to "hook" into react functionality. What this means is that instead of managing classes, we can simply use functions to create out components will the full functionality of React. 

One important Hook is, <b>useState()</b>. This enables out functions to be stateful. We can set initial values like this


<details>
<summary>Setting up  a stateful component</summary>

```.jsx
import React, { Fragment, useState } from 'react';

export default function App() {
    const [name, setName] = useState('Chakane');
    const [age, setAge] = useState('29');

    return (
        <>
            <section>
                <input value={name} onChange={e => setName(e.target.value)}/>
                <p>My name is: {name}</p>
            </section>
            <section>
                <input value={age} onChange={e => setAge(e.target.value)}>
                <p>and my age is: {age}</p>
            </section>
        </>
    )
}

```

</details>

In this example we setup a function with 2 pieces of state. We can have as many state values as we want. 

We have 
```.jsx
const [name, setName] = useState('Stan');
```
This this case:
<ul>
    <li>name --> state variable to use for rendering</li>
    <li>setName --> function to update the variable. we can pass something with setName(value)</li>
</ul>
<br></br>

### Performing initialization and cleanup actions
Our components may need to do other things when the component is created. A common scenario is fetching data from an API or cancelling pending API requests when the component is removed. This is where the <b>useEffect()</b> hook comes in. 

###### What does cleaning up mean?
A cleanup is tasks needed to be performed to prevent unwanted behavior and memory leaks when a component is mounted/unmounted. This is essentially the process of 'undoing' anything your effect has setup for that component. the 2 main scenarios of when we want to clean up something is when:
<ol>
    <li>When the effects sets something up that needs to be torn down later such as: event listeners, timers, manipulating DOM changes</li>
    <li>When the effects depends on values that change: If the dependency array changes, react will re-run the effect and clean up the previous one.</li>
</ol>

###### Fetching component data
The useEffect() hook can run "side effects" in your component. Basically, if the component needs to do anything other than return JSX, such as fetching API data, we can do this using useEffect().

<details>
<summary>Example of fetching mock API data using useEffect()</summary>

```.js
import React, { useEffect, useState } from 'react';

function fetchUser() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id: 1, name: 'Kyle' });
        }, 1000);
    });
};

export default function App() {
    const [id, setId] = useState('...loading');
    const [name, setName] = useState('...loading');

    useEffect(() => {
        fetchUser().then(user => {
            setId(user.id);
            setName(user.name);
        });
    });
};

return {
    <>
        <p>ID: {id}</p>
        <p>Name: {name}</p>
    </>
}


```

</details>

Here the useEffect() hook expects a function as an argument. The function is called after the component is done rendering. 

The fetchUser() function returns a <b> promise </b> which resolves into an object with 2 properties. There is a setTimeout() function which delays the promise resolution for 1 second, making this an "async" just like an actual fetch would be. 

Take a mental note of how state is being used here. 

```.jsx
const [id, setId] = useState('...loading');
const [name, setName] = useState('...loading');

useEffect(() => {
    fetchUser().then(user => {
        setId(user.id);
        setName(user.name);
    });
});
```

In effect, useEffect() is used to setup a function that calls fetchUser() and sets the state of our component when the promise resolves. 

But what is the user happens to do something while the fetchUser request is pending..such as going to another page. 

###### Cancelling requests and resetting state
This is a common occurrence where a user will go on to a page which could trigger an API can and then immediately trigger another API request, which means cancelling the previous API calls as to not overload the system. 

useEffect() has a use here to clean up these previous pending API requests. 

<details>
<summary>Using useEffect() to cancel an API request</summary>

```.jsx
import React, { useEffect, useState } from 'react';
import { Promise } from 'bluebird';

Promise.config({ cancellation: true });

function fetchUser() {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id: 1, name: 'Chef' });
        }, 1000);
    });
}

export default function User() {
    const [id, setId] = useState('...loading');
    const [name, setName] = useState('...loading');

    useEffect(() => {
        const promise = fetchUser().then(user => {
            setId(user.id);
            setName(user.name);
        });

        return () => {
            promise.cancel();
        };
    });

    return ( 
        <>
            <p>ID: {id}</p>
            <p>Name: {name}</p>
        </>
    );
}
```

</details>


In the code above lets look at this part:
```.jsx
useEffect(() => {
    const promise = fetchUser().then(user => {
        setId(user.id);
        setName(user.name);
    })

    return () => {
        promise.cancel();
    };
});
```

This effect creates a promise by calling the fetchUser() API. It also returns a function when that component is being removed by calling ```promise.cancel()```. This prevents the component from trying to update state after its been removed. 

Now lets look at the App component which utilizes the above code. 

<details>
<summary>App component</summary>

```.jsx
import React, { useState } from 'react';
import User from './User';

const showHideUser = ({ show }) => (show ? <User /> : null);

export default function App() {
    const [show, setShow] = useState(false);

    return (
        <>
            <button onClick={() => setShow(!show)}>
                {show ? 'Hide User' : 'Show User'}
            </button>
            <ShowHideUser show={show}>
        </>
    )
}
```
</details>

In the app component we have a state value which determines wether or not the User component is rendered. If show is true, <User/> us rendered. If its false the User is removed therefore triggering the useEffect() hook.

How the pieces of code work is that when you click on Show User button it will fetch the data, which takes 1 second. If you click Hide User before the promise resolves, then the useEffect() hook will cancel that request. If you did not have this use effect code and try this, then an error will occur. 

Effects are usually run by React after every render. However this may not be what we really want. We could also call the API after the first render. 

###### Optimizing side-effect actions
By default, React assumes that every effect which is ran should be cleaned up. This is usually not the case. You could have a specific property or state that requires cleanup when they change. You can pass an array of values to watch as the second argument to useEffect(). So, if you have a resolved state that requires cleanup when it changes, we could have something like this:

```.jsx
const [resolved, setResolved] = useState(false);
useEffect(() => {
    // ... effect code

    return () => {
        // cleanup of code that depends on 'resolved'
    }
}, resolved);
```

Here, the cleanup function only runs when the resolved state is changed. We can have another case where the cleanup code does not run if that resolved state is changed. right now our code is structured to  cleanup code after every render. What we really want to do is <b>fetch it once the component is first mounted.</b> 

<details>
<summary>Optimized cancel API request code</summary>

```.jsx
import React, { useEffect, useState } from 'react';
import { Promise } from 'bluebird';

Promise.config({ cancellation: true });

function fetchUser() {
    console.count('fetching user...');
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({id: 1, name: 'Eric'});
        }, 1000);
    });
}

export default function User() {
    const [id, setId] = useState('...loading');
    const [name, setName] = useState('...loading');
    useEffect(() => {
        const promise = fetchUser().then(user => {
            setId(user.id);
            setName(user.name);
        });

        return () => {
            promise.cancel();
        };
    }, []);

    return (
        <>
            <p>ID: {id}</p>
            <p>Name: {name}</p>
        </>
    )
}
```

</details>


Notice in this optimized code, inside useEffect() we passed an empty array. This tells React theres no values to watch and that we only want to run the cleanup code when the component is removed. In effect, we only run this code once, after the component is mounted. Without this empty array we can notice that this call is made several times. 

### Sharing data using context hooks
Effects are the bridge between your react components and the outside world. The most common use case for effects is to <b>fetch data that the components needs when its first created, and then clean up after the component when its removed. </b>

Another way of sharing data, is through the use of 'context'. Many react applications will have components that share data. For example think of a logged in user. If one exists, then that can alter how other components are rendered (anon vs known). this cases like this the use of context will make this logged in user data available to other components. 

<details>
<summary>Example of sharing fetched data</summary>

```.jsx
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

function fetchUser() {
    return new Promise (resolve => {
        setTimeout(() => {
            resolve({ id: 1, name: 'Randy'});
        }, 1000);
    });
}

export function UserProvider({ children }) {
    const [user, setUser] = useState({ name: '...'});

    useEffect(() => {
        fetchUser().then(user => {
            setUser(user);
        });
    }, []);
}
```

</details>

Firstly, we have the UserContext object which is created by calling ```createContext()``` API from React. We also have a UserProvider component which calls fetchUser() and set the state of the user; this component renders the ```<UserContext.Provider>``` component which passes in any children it receives. In the code, the value we will pass to this is state. 

Heres how the App component would use this above code. 

<details>
</summary>App component utilizing userContext() API to share data</summary>

```.jsx
import React, { useState } from 'react';
import { UserProvider } from './UserContext';
import { Page1, Page2, Page3 } from './Pages'

function ChoosePage({ page }) {
    const Page = [Page1, Page2, Page3];
    return <Page />;
}

function App() {
    const [page, setPage] = useState(0);

    return (
        <UserProvider>
            <button onClick={() => setPage(0)} disabled={page === 0}>Page1</button>
            <button onClick={() => setPage(1) disabled={page === 1}}>Page 2</button>
            <button onClick={() => setPage(3) disabled={page === 3}}>Page 3</button>
            <ChoosePage page={page}/>
        </UserProvider>
    )
}
```

There is also code for the Pages component
```.jsx
import React, { useContext } from 'react';
import { UserContext } from './UserContext';

function Username() {
    const user = useContext(UserContext);
    return (
        <p>
            Logged in as <strong>{user.name}</strong>
        </p>
    )
}

export function Page1() {
    return (
        <>
            <h1>Page 1</h1>
            </Username />
        </>
    )
}

export function Page2() {
    return (
        <>
            <h1>Page 2</h1>
            </Username />
        </>
    )
}

export function Page3() {
    return (
        <>
            <h1>Page 3</h1>
            </Username />
        </>
    )
}
```

</details>

With this code we will see 3 buttons which render a mapped page component. The page state is used to control the page thats displayed.ChoosePage helps render the correct page based on the page state that was passed to it. 

Within the Username() component, were using useContext() to hold the state that is set by the UserProvider components when the API call returns. The context value is updated by the useContext() hook whenever the user value changes.

Also notice how in the Pages component, each page has nop idea about state, it soley relies on context as a global variable. 


### Updating stateful context data
Global data shared in your app is not limited to read-only API response data. There will be times a component will need to update global state values. To do this we need a way to update stateful context data. Because data is stored in context via useState(), we can pass a function to set the new state value. 

We'll write code with a context which provides details about the status of the component. Here what it would look like:

```.jsx
import React, { createContext, useState } from 'react';

export const StatusContext = createContext();

export function StatusProvider({ children }) {
    const value = useState('set a status');
    return(
        <StatusContext.Provider value={value}>{children}</StatusContext.Provider>>
    );
}
```

Here we can tell that the StatusProvider component has a status state with a default string value. useState() returns an array of state value, and a state setter function. This array is then passed to the value property.

Now with this change lets refactor the Pages component

<details>
<summary>Refactored Pages component with StatusContext.Provider </summary>

```.jsx
import React, { useContext } from 'react';
import { StatusContext } from './StatusContext';

function SetStatus() {
    const [status, setStatus] = useContext(StatusContext);
    return <input value={status} onChange={e => setStatus(e.target.value)} />
}

export function Status() {
    const [status] = useContext(StatusContext);
    return <p>{status}</p>
}

export function Page1() {
    return (
        <>
            <h1>Page 1</h1>
            <SetStatus />
        </>
    );
}

export function Page2() {
    return (
        <>
            <h1>Page 2</h1>
        </>
    );
}

export function Page3() {
    return (
        <>
            <h1>Page 3</h1>
            <SetStatus />
        </>
    );
}
```
</details>


The two main components that consume context data here are SetStatus() and Status(). SetStatus component renders an input so that the user can provide new values for the status context. When input is available, the setStatus() function  which comes from context data array is used to update context state. The Status component just renders status.

The <b>main use-case</b> for all this is that if youre using an API endpoint which most components need access to; you can simply implement a context provider component that fetches API data and shares it with other components. These components can also change the state value associated with context. 


### Using reducer Hooks to scale state management
useState() is cool and all, but what if your component has a ton of related pieces of state? This would result in many setter functions which we'll call individually once you figure out how a change in one state affects another state value. This is where ```reducers``` come in. 

We can have one ```dispatch()``` function to update the state of a component. AS reducer function in React takes the current state, an action, and other arguments as needed to update the state. It will return a new state for the component. The action argument tells the reducer function what new state to return. We usually do this in a switch statement.

<details>
<summary>Example of using a reducer hook</summary>

```.jsx
function reducer(state, action) {
    switch (action.type) {
        case 'changeName':
            return { ...state, name: action.value };
        case 'changeAge':
            return { ...state, age: action.value };
        default:
            throw new Error(`${action.type} is not a valid action`);
    }
}

export default function App() {
    const [{name, age}, dispatch] useReducer(reducer, {});

    return (
        <>
            <input placeholder='Name' value={name} onChange={e => dispatch({type: 'changeAge', value: e.target.value})} />
            <p>Age: {age}</p>
        </>
    )
}
```
</details>

Here, the App components renders 2 fields and 2 labels. When the text value changes, it updates the corresponding label value which is done with this line ```const [{name, age}, dispatch] = useReducer(reducer, {});```.

What that does is takes in 2 arguments: (1) The reducer function to update state, and (2) the initial state of the component. useReducer() returns an array with the state as the first element and the dispatcher function as the second. when using reducers, we only have one object as the state of the component; instead of several smaller unrelated state values. 

Lets focus on the reducer(state, action) function. The state argument is the current state of the component. The action argument the argument passed to dispatch. The action.type value determines what to do. The reducer we made only has 2 actions: changeName and changeAge. Based of the action.type value we use the object spread operator to return a new state object made from the existing state and the updated state object values. 

* always place error handling in the reducer function as setting wrong state is common and should be addressed here. 

### Handling state dependencies
As said before, when components have once piece of state that depends on another, we need a good way to manage these changes. Theres many scenarios where updating one piece of state means updating another piece of state based on its new value. 

Well look at another code example of a user selecting an item and the quanity of that item, which will then show the cost. That means whenever the quantity or items change, the total must also change. We can use a reducer to manage this.

<details>
<summary>Code Example for using reducers pt2</summary>

Reducer Code:
```.jsx
import React, { useReducer, useEffect } from 'react';

const initialState = {
    options: [
        { id: 1, name: 'First', value: 10 },
        { id: 2, name: 'Second', value: 50 },
        { id: 3, name: 'Third', value: 175 },
    ],
    quantity: 1,
    selected: 1
};

function reduceButtonStates(state) {
    return {
        ...state,
        decrementDisabled: state.quantity === 0,
        incrementDisabled: state.quantity === 10
    };
}

function reduceTotal(state) {
    const options = state.options.find(option => option.id === state.selected);
    return { ...state, total: state.quantity * option.value }
}

function reducer(state, action) {
    let newState;
    switch (action.type) {
        case 'init':
            newState = reduceTotal(state);
            return reduceButtonStates(newState);
        case 'decrementQuantity':
            newState = { ...state, quantity: state.quantity - 1 };
            newState = reduceTotal(newState);
            return reduceButtonStates(newState);
        case 'incrementQuantity':
            newState = { ...state, quantity: state.quantity + 1 };
            newState = reduceTotal(newState);
            return reduceButtonStates(newState);
        case 'selectItem':
            newState = { ...state, selected: Number(action.id) };
            return reduceTotal(newState);
        default:
            throw new Error(`${action.type} is not a valid action`);

    }
}
```

App component

```.jsx
export default function App() {
    const [{
        options,
        selected, 
        quantity,
        total,
        decrementDisabled,
        incrementDisabled,
    },
    dispatch
    ] = useReducer(reducer, initialState);

    useEffect(() => {
        dispatch({ type: 'init' });
    }, []);

    return (
        <>
            <section>
                <button disabled={decrementDisabled} onClick={ () => dispatch({ type: 'decrementQuantity' })}> - </button>

                <button disabled={incrementDisabled} onClick={ () => dispatch({ type: 'incrementQuantity' })}> + </button>

                <input readOnly value={quantity} />
            </section>
            <section>
                <select value={selected} onChange={e => dispatch({ type: 'selectItem', id: e.target.value })}>
                    {options.map(o => (
                        <option  key={o.id} value={o.id}>
                            {o.name}
                        </option>
                    ))}
                </select>
            </section>
            <section>
                <strong>{total}</strong>
            </section>
        </>
    )
}
```

</details>


### Memoization with Hooks
Function components are called on every render. In some cases, if you have functions running expensive computations, this can cause issues in the app. To fight against this, React provides hooks: ```useMemo```, ```useCallBack```, and ```useRef```. These hooks let us memoize values, functions, and references respectively. 

Memoization in itself, is an optimization technique used to improve the performance of algorithms. It is a form of caching, when used, it stores calculated results and reuses the answer for the same sub-problem.

#### useMemo Hook
This if a function we can use to memoize the result of a computation. Heres example code:

```.jsx
import { useMemo } from 'react';
cost Component = () => {
    const expensiveResult = useMemo(() => {
        //expensive computation
        return computeExpensiveValue(dependency);
    }, [dependency]);
    return <div>{expensiveResult}</div>
}
```

Here ```expensiveResult``` is memoized using ```useMemo()```. ```computeExpensiveValue(dependency)``` is only called based on the dependency value; if it remains the same we will reuse the value previously computed. 




