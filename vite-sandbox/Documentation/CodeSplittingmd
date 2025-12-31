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
