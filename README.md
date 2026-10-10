# React Native Practical Course
## Using native device features: saving app info in the device using SQLite

Please, implement the ability for the app to keep its state between starts.  
Whenever the state in the store is changed, the data should be updated in the database.  
When the app starts, the store should be initialized by the previously saved data from the DB.  
MainNavigator should not be rendered until the data is loaded.  

Data to be stored and retrieved:
 - **words** along with their learning info (the same structure as in the store)
 - **isDark** boolean value that defines the color scheme

Functions that need to be created in the *dbUtils* file:
 - **init** - creates tables for words and for theme if the tables do not exist
 - **addWord** - adds a new record for a new word into the table
 - **updateWord** - updates the record with a specific word in the table
 - **deleteWord** - deletes record with a specific word in the table (takes a string argument – word, without any additional info)
 - **getWords** - retrieves information about all stored words
 - **getTheme** - retrieves a boolean value, meaning whether the theme is dark (true if it is)
 - **setTheme** - takes a boolean value, meaning whether the theme is dark as an argument, and stores it in the table

  
<img src="./assets/demo-play.gif" width=250>  
