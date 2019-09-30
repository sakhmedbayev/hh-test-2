## Assumptions, compromises, and explanation that was made during the project execution

- the project was built using the latest 'create-react-app' tool build and extensively utilizing React-hooks API
- sometimes I had to use `div` tag to make styling work better (`fieldset` and `legend` tags would be more appropriate to use, yet they introduce some challenges in terms of styling). Those `div`'s also can be seen as a good logical sub-section of the form. For that matter, I used 'area-\*' and 'role' attributes with the `div` tags.
- additionally to the project requirements, I added a "Reset" `button` and `h1` tag was introduced. I believe it provides better accessibility and UX.
- 'react-testing-library' + 'jest' was used to test the project. I think it provides a better testing philosophy. Please refer to ["Guiding Principles"](https://testing-library.com/docs/guiding-principles) document of 'react-testing-library' for further explanation.
- the project does not utilize any third-party state management libraries but rather `useReducer` hook. I believe it would be too much to introduce any state management in projects of such size.
- I was not sure if any styling needs to be applied to `select` components. Seems like the screenshot in the second test's description was taken some time ago.
- I am not sure about the following part of the test description: "Use 'NextJS' as a base". Please clarify. Does it mean to use "Next.js" framework? Or something else?

##Below is an instruction for how to run the project. It comes from `create-react-app`'s repository.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
