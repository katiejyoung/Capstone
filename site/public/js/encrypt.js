//Source: https://www.sitepoint.com/how-to-build-a-cipher-machine-with-javascript/
//Includes encrypt and decrypt functions
//Performs basic shift encryption, different shifts are used for different char types

const alphabetUp = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const alphabetLow = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
const special = ['@', '#', '$', '%', '<', '^', '>', '?'];       //Not all special characters are included, add more after input sterilization / password criteria established
const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

//Takes a passed character and performs a shift
function encrypt(char) {
  const shift1 = 5;      //This value can be changed to have different shift values
  const shift2 = 4;      //This value can be changed to have different shift values
  const shift3 = 6;      //This value can be changed to have different shift values
  const shift4 = 3;      //This value can be changed to have different shift values

    if (alphabetUp.includes(char))
    { 
        const position1 = alphabetUp.indexOf(char);      //Get position in of the original char
        const newPosition1 = (position1 + shift1)%26;                  //Perform the shift
        return alphabetUp[newPosition1]                                //return the new character
    }
    else if (alphabetLow.includes(char))
    { 
        const position2 = alphabetLow.indexOf(char);      //Get position in of the original char
        const newPosition2 = (position2 + shift2)%26;                  //Perform the shift
        return alphabetLow[newPosition2]                                //return the new character
    }
    else if (special.includes(char))
    { 
        const position3 = special.indexOf(char);      //Get position of the original char
        const newPosition3 = (position3 + shift3)%8;                  //Perform the shift
        return special[newPosition3]                                //return the new character
    }
    else if (numbers.includes(char))
    { 
        const position4 = numbers.indexOf(char);      //Get position of the original char
        const newPosition4 = (position4 + shift4)%10;                  //Perform the shift
        return numbers[newPosition4]                                //return the new character
    }
    else { return char }  
}


//Takes a passed character and performs a shift (back to the original char)
function decrypt(char) {
    const shift1 = 5;      //This value can be changed to have different shift values
    const shift2 = 4;      //This value can be changed to have different shift values
    const shift3 = 6;      //This value can be changed to have different shift values
    const shift4 = 3;      //This value can be changed to have different shift values
  
      if (alphabetUp.includes(char))
      { 
        const position1 = alphabetUp.indexOf(char);      //Get position in of the original char
        const newPosition1 = (position1 - shift1)%26;                  //Perform the shift
        return alphabetUp[newPosition1]                                //return the new character
      }
      else if (alphabetLow.includes(char))
      { 
        const position2 = alphabetLow.indexOf(char);      //Get position in of the original char
        const newPosition2 = (position2 - shift2)%26;                  //Perform the shift
        return alphabetLow[newPosition2]                                //return the new character
      }
      else if (special.includes(char))
      { 
          const position3 = special.indexOf(char);      //Get position of the original char
          const newPosition3 = (position3 - shift3)%8;                  //Perform the shift
          return special[newPosition3]                                //return the new character
      }
      else if (numbers.includes(char))
      { 
          const position4 = numbers.indexOf(char);      //Get position of the original char
          const newPosition4 = (position4 - shift4)%10;                  //Perform the shift
          return numbers[newPosition4]                                //return the new character
      }
      else { return char }  
  }


  //Corresponding html example
  /*
    form.addEventListener ('submit',event => {
        event.preventDefault();                                                                 //Don't allow the submit to happen until encryption
        output.innerHTML = [... form.plaintext.value ].map(char => encrypt(char)).join('');     //Change string into an array and send each char to the function
    }
    );
  */