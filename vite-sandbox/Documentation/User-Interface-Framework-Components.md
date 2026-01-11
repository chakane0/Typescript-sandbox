# User Interface Framework Components

When developing in React, we generally rely on an existing UI library rather than building one from scratch. A popular one is `Material UI`. In this doc we will cover: (1) Layout and UI organization, (2) Using navigation components, (3) collecting user input, (4) Working with styles and themes. 

In Material UI, `Containers` serve as the foundation of the visual aspect. `Grids` Allow for more granular control which enable precise placement and alignment of components across different screen sizes. 

#### Using Containers
###### branch name user-interface-framework-components

Aligning components horizontally on a page presents a challenge due to due to spacing, alignment, and responsiveness. Theres a balancing you need to do with being visually appealing and functional. The `Container` Component from `Material UI` can be used like this for example:

<details>
<summary>example for material ui</summary>

```tsx
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
export default function MyApp() {
    const textStyle = {
        backgroundColor: '#cfe8fc',
        margin: 1,
        textAlign: 'center',
    };
    return (
        <>
            <Container maxWidth='sm'>
                <Typography sx={textStyle}>sm</Typography>
            </Container>
            <Container maxWidth='md'>
                <Typography sx={textStyle}>md</Typography>
            </Container>
            <Container maxWidth='lg'>
                <Typography sx={textStyle}>lg</Typography>
            </Container>
        </>
    )
}
```

</details>

In this example we are looking at 3 container components, which with a `Typography` component which is used to render text in Material UI apps. Each container component takes a maxWidth property. Try expanding and shrinking your screen and you'll see the elements grow in size.

The Container component gives control over how the page elements grow horizontally. 