# web-app-gallery

Upon downloading the web-app-gallery repo,  you will have two folders:

1. client
2. server

and this README.md file


------------------------------------------------------------------------------------------------

                                    #Running the Server


In the \server directory, open your terminal and type:


```npm start```



Server should be running without problem

------------------------------------------------------------------------------------------------

                                    #Running the Client


In the \client directory, open your terminal and type:


```npm start```


IMPORTANT: 

There were some unclear problems that I could not fix, so, if you get an error about 'react-scripts' not being recognized, first type in:


```npm install react-scripts --save```


and then


```npm start```


Client should be running without problem now.

------------------------------------------------------------------------------------------------
                                    #Running the Tests


In the \server directory, open your terminal and type:


```npm test```


Tests should be running without problem

------------------------------------------------------------------------------------------------

                                    #Running the Tests in Parallel


In the \server directory, open your terminal and type:


```npm run test:parallel```


Tests should be running without problem in parallel. 
In package.json, it is set up to 3 parallel processes for all of the tests.

------------------------------------------------------------------------------------------------