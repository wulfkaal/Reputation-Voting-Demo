## Setup

```
npm install
npm start
```
The app will open automatically at http://localhost:3000

Hot reloading in dev is enabled and every change you make in code will auto refresh your browser.

Full source maps are enabled in this configuration.

Install [React Dev Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)

Open dev tools in Chrome, navigate to the React tab and see all of your components and set breakpoints!

You can even look at the source of the page and set breakpoints in the Sources tab, but this lacks full React support.

## Notes about configuration

### React

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app)
This means that webpack and babel configuration are hidden. You can assume full availability to ES7 syntax.

Page routing is handled via [react-router-dom](https://www.npmjs.com/package/react-router-dom)
To create a new path on the client, update src/index.js:
```
<Route path="/proposals/:id" component={ProposalsContainer} />
```

Navigation is accomplished one of two ways:

Via Link
```
import { Link } from 'react-router-dom'
<Link to='/path'>Link Text</Link>
```

To create a custom link (via button or otherwise)
```
<div onClick={() => this.props.history.push('/proposals')}>
  Div Link
</div>
```

class attribute in React is a reserved word. Use className instead
```
<div className='myClass'></div>
```

### Redux

Follows best practices, best would be to read up on [Redux](https://redux.js.org/)

### Material UI

I reviewed Bootstrap 4 again, and I recommend against using this framework because it requires jquery.
Jquery manipulates DOM, and this is directly opposed to the nature of React. 
Furthermore, [Material-UI](https://material-ui.com/) is a mature framework with explicit support for React.
Material UI is based on [flex-box](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) and is a grid based layout system similar to Bootstrap.
However, the components are designed to work natively with React.

### JSS

JSS is a concept introduced with Material UI and mixes CSS into a .js file. 
At first this may seem counterintuitive and against standard design principals.
However, remember that React introduces a new programming paradigm wherein components 
should be self contained and have all the information they need to render. 
Separation of concerns is now by component instead of technology.

Sometimes you may want to reuse CSS anyway, and JSS supports this. Enter CSS into a
.js file and then import that jss to use later. See src/jss/base-component.js as an example.

Whether importing JSS or defining JSS inside a component, you must use the Material UI helper method
withStyles
```
withStyles(styles)(MyComponent)
```

### Patterns in this project

#### Container/Presenter

/src/containers contains the top level components that represent a url route.
These containers should encapsulate layout and Redux. Knowledge of Redux should never be pushed
down to presenter components.

/src/presenters contains components that have actual UI elements. props passed to the component 
function should contain everything you need to render the component.

#### High Order Components

A High Order Component is one that is a function that takes a component as a parameter
and wrapps the component and returns a new component. This is useful for security, layout
and anything else that should apply to multiple components.
See /hocs folder for examples.








