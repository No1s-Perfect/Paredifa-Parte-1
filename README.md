<img src="../web/img/favicon.png" align="left" style="width:32px;height:32px"/>

# PAREDIFA

## Authors
Team 01-10am.
- Andres Alvarez Duran     117520958
- Joaquin Barrientos Monge 117440348
- Oscar Ortiz Chavarria    208260347
- David Zarate Marin       116770797


## How to use
1. The user must have live-server installed in their device.
                  

2. Open your Windows Terminal or an equivalent program. 
Make sure your current working directory is the one containing the index.html file.

3. Now proceed by executing the live-server command. 
The used port can be changed by using the live-server --port=NUMBER command, where you type the port number of your preference instead of the of NUMBER placeholder. 
Now your server is up and runnning with our project. You kill the server by pressing CTRL + C. 

4. Your primary browser will open with the SPA of our project. You will see we have a navbar with the logo is our application on the left side,
and on the right side we have the About section and the Instructions. Feel free to click on any of those for further information.

5. On the left side we have a button 'Set Alphabet', where you will have the chance to set a new alphabet for the automata. You just have to type it in the pop-up modal!
We use a regex to detect the alphabet you input, so, there isn't a strict format to type it. You can put: _"123", "1,2,3", "1 2 3", "1-2-3"_. They all mean the same _{1, 2, 3}_ 
(a set containig 1, 2, and 3). 
    - **Important**: Ir the user forgets to set an alphabet. The program will suggest _{1, 0}_ as the default one.

6. Now that the alphabet is ready. The user is good to place some states and start building the automata. 
    - With the mouse situated anywhere withing the canvas, the user is able to create a state by pressing the letter **Q**. 
    - To change the location of the state by clicking on that state (it turns orange), and holding or draging the mouse anywhere is desired. (This is only one gesture. One click.)
    - The user is able to change the state name by clicking on any state (it turns orange) and pressing letter **R**. Then with _backspace_ remove the old name and typing the new one. 
    - By selecting a state and pressing **DEL** the user will remove that selected state. 
    - The user sets a state as initial by clicking on a state and pressing **S**. Only one initial state is allowed.
    - The user sets a state as final by clicking on a stated and pressing **F**. Several final states are alloed. 
    - If the user selects a final state an presses **F**, the state won't be final anymore.
   

7. Now that we have some states it time to connect them and make the automata! 
    - First you need to select a state by clicking on it. 
    - By pressing the letter **E** a very light arrow will appear, this is a temporary transition.
    - This temporary transition needs to be connected to a destination state. In order to do that you will have to drag your mouse to the desired state and press the 
    letter **E** again to connect both states. 
    - It is not ready yet, now we have to place the transition symbols between this to states. 
    Once you see the states area connected type the symbols from the alphabet that will connect thos states. When you fininsh press **ENTER**
    - **Important** if you try to place a symbol not inbcluded in the alphabet a warining will be shown on the top-left corner.

8. While the euser is building the antomata on the right side of the screen a panel will show the error and the small tasks needed to be completed before the automata is ready to run.

9. Once automata is completed the user will be able to enter an input string. This has to match the symbols from the alphabet, once again.
Otherwise, an error will be shown.

10. Once no errors are detected, the corresponding run buttons will be enabled on the center-top of the screen. Also, on the top-left corner of the canvas, the user will see 
the input string and which character is the automata currently processing highlighted in purple.
There are two options:
    - **Run continuous**: This will run the automata all at once, with no pauses.
    - **Run by steps**: This option will show two new buttons. Enabling the user to run the automata with pause and also rewind. 
        - **Next Step (in green):** This will color the next transition the automata will take. 
        - **Prev Step (in red):** By pressing this button the user is able to rewind the automata, and check the previous transitions.

11. Finally, once the automata finishes, a result will be shown on the right-pannel, below the errors dialog. 
The user will be able to identify the input string, and the final state, followed by a result.
    - Accepted will be shown in green if the input string finished in a final state.
    - Rejected will be shown in red if the input string finished in a non-final state.

12. The user has the option to Clar the Canvas by clicking the button in the bottom-right corner of the canvas.

13. This program supports JSON.
    - So when the user wants to save the automata, by clicking _Download as JSON_ will fill the text field above with the JSON formatted automata. 
The user then can copy and store that JSON in a local file. 
    - Otherwise, if the user has a JSON string, they can paste it in that same text field and click on the _Upload a JSON_ button.
    
14. Finally, the user will have the change to downolad the automata as as PNG image by clicking the _Save as PNG_ button in the bottom-right corner of the canvas. 

    

## Declaracion jurada
> Declaramos de manera jurada que el proyecto entregado fue realizado por el grupo de autores con participación proporcional y balanceada de todos y solo los autores declarados, de manera original y que las fuentes de consulta usadas son las declaradas.
