# Contributing to Catweb Index

Thank you for your interest in contributing to the Catweb Index! This guide will help you add your own site data to the project.

## How to Contribute

1. **Create a JSON File**  
   Navigate to the `sites` folder in the project directory. Create a new JSON file named after your site. For example, if your site is called "MySite.rbx" create a file named `mysite.json`.

2. **Follow the Schema**  
   Your JSON file must adhere to the schema defined in `json-schema/schema.json`. Below is an example structure to guide you:

   ```json
   {
       "$schema": "https://raw.githubusercontent.com/JoaoMPdS/catweb-index/main/json-schema/schema.json",

       "subdomains": {
           "": [
               {
                   "path": "/blog",
                   "title": "Blog",
                   "description": "MySite Blog",
                   "iconId": 2
               }
           ],
           "test": [
               {
                   "path": "/",
                   "title": "Test Root",
                   "description": "This is the root of test.MySite.rbx",
                   "iconId": 23132123123213
               }
           ]
       },

       "createdAt": "15/04/2025",
       "visits": {
           "current": 0,
           "updatedAt": "15/04/2025"
       },
       "creatorId": "your-unique-id"
   }
   ```

>**_NOTE:_**  Additionally, when you define a `path`, it will match any route that begins with it—such as `/test/something` or `/test/another-page`. This makes it easy to group related routes under a common base path. However, more specific routes will take precedence and can override these broader matches.

>**_NOTE:_** All dates must be in the DD/MM/YYYY format.