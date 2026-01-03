# Code Splitting Using Lazy Components and Suspense
Code splitting is defined as breaking your JS bundle into smaller chunks so that the browser only loads whats needed. This improves performance. This is necessary for large applications because of the vast amount of code transferred from server to browser.

Here we will demonstrate how to implement this in React apps by using the ```lazy()``` and the ```Suspense``` components.

### The lazy API
2 things involved with using the ```lazy()``` api is (1) theres bundling components into their own seperate files so that they can be downloaded by the browser separately from other parts of the application. (2) Once you have created the bundles, you can build the react components that are 'lazy', meaning they dont download anything until they are needed. 

#### Dynamic imports and bundles
###### branch name = code-splitting-lazy-components
Here we will be using Vite tooling for creating bundles, meaning we wont do much with maintaining bundle configurations. Bundles will be created automatically based on how we import modules. Using the plain import statement will have the app be downloaded all at once in one bundle. You can use the ```import()``` function to import modules on demand. By using this function were telling Vite to create a seperate bundle for the code were importing dynamically. 

Heres a simple component we might want to bundle separately from the rest of the application. 

```tsx
export default function MyComponent() {
    return <p>My Component</p>;
}
```

Now lets see how we would import this module dynamically using the import() function which results in a separate bundle.

```tsx
function app() {
    const [MyComponent, setMyComponent] = React.useState<() => React.ReactNode>(
        () => () => null
    );
    React.useEffect(() => {
        import('./MyCompoenent').then((module) => {
            setMyComponent(() => module.default);
        });
    }, []);
    return <MyComponent />;
}
```

When running this, you'll see the <p> text getting rendered. If you open dev tools and look at the network requests, you'll see a seperate call for MyComponent. This is because ```import('./MyComponent')``` is getting called. The import() function returns a promise that resolves with the module object. Because we use the default export on MyComponent, we will call it using ```module.default``` when calling ```setMyComponent()```.

The reason for setting a component as the MyComponent state is that when the App component renders for the first time, we dont have its code loaded yet. Once it loads, MyComponent will reference the proper value which results in the correct text being rendered. 

Now we can get a better look into how the lazy() API simplifies all of this for us. 

#### Making Components lazy
###### branch name = code-splitting-lazy-components-1 
So as we did before, instead of handling the promise returned by ```import()``` by returning the default export and setting state, you can use the ```lazy()``` API. This will take a function that returns an ```import()``` promise, the return value is a lazy component that you can render.

Heres what the App component will look like now with this implemented:

<details>
<summary>updated app component</summary>

```tsx
import * as React from 'react';
const MyComponent = React.lazy(() => import('./MyComponent'));
function App() {
    return <MyComponent />;
}
```

</details>
<br></br>

Now the MyComponent value is created by calling ```lazy()```, which passes the dynamic module import as an argument. Now you have a separate bundle for the component and a lazy component which loads the bundle when its first rendered. This is essentially how code splitting works. In this example, you wont see anything render, but you will see the network call for the component. The ```import()``` function handles bundle creation for you and the ```lazy()``` api makes your components 'lazy' and handles all the work of importing components for you. 

Now we can get into ```Suspense``` components to help display placeholders while components are loading. 

#### Using the Suspense Component
###### branch name cl=ode-splitting-lazy-components-2

Lazy components need to be rendered inside a Suspense component. An important note is that the lazy component does not have to be a child of a suspense component. This means you could have one Suspense component handle every lazy component in your app. 

For example, heres a component which we could bundle separately and use lazily.

<details>
<summary>example component - MyFeature</summary>

```tsx
export default function MyFeature() {
    return <p>My Feature</p>;
}
```

</details>

Now we can make the MyFeature component lazy and render it inside of a MyPage component.

<details>
<summary>MyPage component</summary>

```tsx
const MyFeature = React.lazy(() => import('./MyFeature'));
function MyPage() {
    return (
        <>
            <h1>My Page</h1>
            <MyFeature />
        </>
    );
}
```

</details>


Here we are using the ```lazy()``` API to make the MyFeature component lazy. This means that when the MyPage Component is rendered, the code bundle which contains MyFeature will be downloaded because MyFeature was also rendered.

An optimal approach to using the suspense component is to render just one Suspense component inside of our app component.

<details>
<summary>App component</summary>

```tsx
function App() {
    return (
        <React.Suspense fallback={'loading...'}>
            <MyPage />
        </React.Suspense>
    )
}
```
</details>

Now when this runs, while the MyFeature code bundle is being downloaded, ```<MyPage>``` is replaced with the fallback text passed to Suspense. When we run this, throttle the network to 3G speed to see the rendering. 

#### Working with spinner fallbacks
###### branch name = code-splitting-lazy-components-3

The predominant fallback are spinner loaders, or skeleton screens but lets do spinners :).

Lets modify the App component to include a spinner from the 'react-spinners' package as the Suspense fallback.

<details>
<summary>App component to include spinner loader</summary>

```tsx
import * as React from 'react';
import { FadeLoader } from 'react-spinners';
import MyPage from './MyPage';

function App() {
    return (
        <React.Suspense fallback={<FadeLoader color='light-blue'>}>
            <MyPage />
        </React.Suspense>
    );
}
```

</details>

Now a spinner object will appear on the screen as the lazy component is being downloaded and brought in for rendering. This gives the illusion tha the website is super fast and reliable. 

Now we will tell you why its not ideal to make every component a lazy component. 


#### Avoiding Lazy components
###### branch name = code-splitting-lazy-components-4

The downside of defaulting to making all your components lazy is that there will be so many HTTP requests to fetch them at one go. Youre better of bundling these components together to make one request for what is actually needed on the page at that time. 

Think of pages as bundles. Lets build an example to show how to organize lazy components. For example we can have an app that has a couple pages and a few features on each page. We dont want to make these features lazy if theyre all going to be needed when the page loads. 

Heres the app component for example to show the user a selector to pick which page to load:

<details>
<summary>Show component example</summary>

```tsx
const First = React.lazy(() => import('./First'));
const Second = React.lazy(() => import('./Second'));
function ShowComponent({ name }: { name: string }) {
    switch (name) {
        case 'first':
            return <First />;
        case 'second':
            return <Second />;
        default: 
        return null;
    }
}
```

</details>

The First and Second components will make up our app, we want to make those lazy components that load bundles on demand. Thew Show component renders the page.

<details>
<summary>App component</summary>

```tsx
function App() {
    const [component, setComponent] = React.useState('');
    return (
        <>
            <label>
                Load Component: {' '}
                <select value={component} onChange={(e) => setComponent(e.target.value)}>
                    <option value=''>None</option>
                    <option value='first'>First</option>
                    <option value='second'>Second</option>
                </select>
            </label>
            <React.Suspense fallback={<p>...loading</p>}>
                <ShowComponent name={component} />
            </React.Suspense>
        </>
    )
}
```

</details>

Now lets take a look at the First page component:


<details>
<summary>First Page</summary>

```tsx
import One from './One';
import Two from './Two';
import Three from './Three';

export default function First() {
    return (
        <>
            <One />
            <Two />
            <Three />
        </>
    );
}
```

</details>

Here the ```First``` component pulls in 3 components and renders them. These 3 components are part of the same bundle. We could make them all lazy but theres no point. We can have just one HTTP request for these 3 pages. 


#### Exploring Lazy pages and Routes
###### branch name = code-splitting-lazy-components-5

We just covered why we would avoid lazy components, the same thing can apply when your'e using react-router.

Heres our app function:

<details>
<summary>app component routing setup</summary>

```tsx
const First = React.lazy(() => import('./First'));
const Second = React.lazy(() => import('./Second'));

function Layout() {
    return (
        <section>
            <nav>
                <span>
                    <Link to='first'>First</Link>
                </span>
                <span> | </span>
                <span>
                    <Link to='second'>Second</Link>
                </span>
            </nav>
            <section>
                <React.Suspense fallback={<FadeLoader color='green'>}>
                    <Outlet />
                </React.Suspense>
            </section>
        </section>
    )
}

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Layout />}>
                    <Route path='/first' element={<First />} />
                    <Route path='/second' element={<Second />} />
                </Route>
            </Routes>
        </Router>
    );
}
```

</details>

See how we have 2 lazy page components which will be bundled seperately from the rest of our app. The fallback content in this example uses the same FadeLoader spinner component we did earlier. 

The Suspense component is placed beneath the navigation links meaning that the fallback content will be rendered in the spot where the page content will eventually show when it loads. The children of the suspense component are the Route components which will render our lazy page components. When the /first route is activated, the First component is rendered for the first time which triggers the bundle download. 
