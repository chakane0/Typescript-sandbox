import { Fragment, useState } from 'react';

export default function BasicState() {
    const [name, setName] = useState('add a name');
    const [country, setCountry] = useState('choose a country');
    const [numberOfGuitars, setNumberofGuitars] = useState(23);

    return (
        <>
            <div className='basic-state-main'>
                <div className='state-switch-main'>
                    <select>
                        <option>Default</option>
                        <option>This is option 1</option>
                        <option>This is option 2</option>
                    </select>
                </div>

                <section>
                    <input value={name} onChange={e => setName(e.target.value) }/>
                    <p>First Name: {name}</p>
                </section>
                <section>
                    <input value={country} onChange={e => setCountry(e.target.value)} />
                    <p>Country: {country}</p>
                </section>
                <section>
                    <input value={numberOfGuitars} onChange={e => setNumberofGuitars(e.target.value)} />
                    <p>Number of guitars: {numberOfGuitars}</p>
                </section>
                
            </div>
            
        </>
    )

}