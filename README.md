# 67373_Treasure-House-Fashions

## Project Overview
This is the publicly viewable repository for Treasure House Fashions

### Running the backend
Before you run the backend, in `src/config/` you must make a new file `.env` to hold API information for connecting with the firebase with the following format:
```
FIREBASE_API_KEY=
FIREBASE_AUTH_DOMAIN=
FIREBASE_DATABASE_URL=
FIREBASE_PROJECT_ID=
FIREBASE_STORAGE_BUCKET=
FIREBASE_MESSAGING_SENDER_ID=
FIREBASE_APP_ID=
FIREBASE_MEASUREMENT_ID=
```

You may simply copy this into the new file `src/config/.env` and fill in each variable with the according value which can be found in the firebase console at `Project Overview -> Treasure-House-Fashions-Web-App settings icon -> scroll all the way down` and the relative information will be in the `Node.js` code snippet in the object named `firebaseConfig`.

Simply run `npm run clean:dist` to remove the current `compiled JS` if any, `npm run compile`, and `npm run cpenv` to copy the `.env` file you just created over to the `dist` folder so the compiled `JS` can read from the `.env` file with the API information.

## Backend File Structure

**/node_modules**: Directory for npm dependencies. \
**/src**: Contains your source code. \
**/api**: Contains the MVC (Model-View-Controller) elements. \
&emsp;**/controllers**: Process logic for handling requests and responses. \
&emsp;**/models**: Definitions of data structures for DynamoDB and corresponding methods of each object. \
&emsp;**/routes**: Definitions of API routes. \
&emsp;**/config**: Configuration files, including database configurations. \
&emsp;**/services**: Code for external services integration, including integrations with CharityProud. \
&emsp;**/utils**: Utility functions and helpers.     
**/tests**: Contains your unit and integration tests.  

## Frontend File Structure
## Firebase configuration
In the `config` directory, please add a new file `firebase_cfg.ts` with the following code; you can find this information in the firebase console on the `Project-Overview -> Web App -> Settings ->` and scrolling all the way down to find a similar codeblock with the information you need.
```
export const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};
```

