# Event Handling

An event handler is a way to have soe declarative logic to process any kind of event that happens on a site. This could be a click, hover over, onChange, etc. In this documentation, components are classes. 

Heres a very basic example of how we can use a event handler:

```.jsx
import React, { Component } from 'react';

export default class MyButton extends Component {
    onClick() {
        console.log('clicked');
    }

    render() {
        return <button onClick={this.onClick}>{this.props.children}</button>;
    }
}
```

Notice how ```this.onClick``` is being passed in the onClick property of the button.

##### Multiple event handlers

We can have more than one handler assigned to an element. 

<details>
<summary>Multiple event handlers example</summary>

```.jsx
import React, { Component } from 'react';

export default class MyInput extends Component {
    onChange() {
        console.log('changed');
    }

    onBlur() {
        console.log('blurred');
    }

    render() {
        return <input onChange={this.onChange} onBlur={this.onBlur} />
    }
}
```
</details>

##### Importing generic handlers
Its likely your application will share the same event handling logic for different components. We can create a generic event handling function to cleanly share this logic.

<details>
<summary>Generic handlers example</summary>


```.jsx
import React, { Component } from 'react';
import reverse from './reverse'

export default class MyList extends Component {
    state = {
        items: ['Angular', 'Ember', 'React']
    };

    onReverseClick = reverse.bind(this);

    render() {
        const {
            state: {items},
            onReverseClick
        } = this;

        return (
            <section>
                <button onClick={onReverseClick}>Reverse</button>
                <ul>
                    {items.map((v, i) => (
                        <li key={i}>{v}</li>
                    ))}
                </ul>
            </section>
        )
    }
}
```
</details>


#### Using event handler context and parameters
We can have our components bind their event handler contexts and pass data into event handlers. Theres scenarios where the handler needs access to component properties, along with argument values. Well show a code example where we render a custom list component that has a click event handler for each item in the list. 

<details>

<summary>Example of getting component data for a handler</summary>

```.jsx
import React from 'react';
import { render } from 'react-dom'
import MyList from './MyList'

const items = [
    { id: 0, name: 'First'},
    { id: 1, name: 'Second'},
    { id: 2, name: 'Third'},
]

render(<MyList items={items} /> document.getElementById('root'));

```

MyList.jsx
```.jsx
import React, { Component } from 'react';
export default class MyList extends Component {
    constructor() {
        super();
        this.onClick = this.onClick.bind(this);
    }

    onClick(id) {
        const {name} = this.props.items.find(i => i.id === id);
        console.log('clicked', `"${name}"`);
    }

    render() {
        return (
            <ul>
                {this.props.items.map(({id, name}) => (
                    <li key={id} onClick={this.onClick.bind(null, id)}>{name}</li>
                ))}
            </ul>
        )
    }
}
```
</details>


### LUL
* inline event handlers - function is defined as part of the markup
* binding event handlers to elements
* synthetic event objects - passing events to a native (vanilla js) event listener. 
* event pooling - React can constantly create new synthetic event instances; it handles this by allocating a synthetic instance pool. When an event is triggered, it takes an instance from the pool and populates its properties. After the event handler is done, the synthetic event instance is pushed back into the pool. 


